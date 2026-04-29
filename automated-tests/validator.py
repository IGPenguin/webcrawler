import sys
import os
import re
from datetime import datetime

# --- Configuration: Manual Limits (Modify as needed) ---
TEXT_LIMITS = {
    'encounter_name': 35,
    'encounter_desc': 120,
    'encounter_msg': 120,
    'origin_name': 35,
    'origin_desc': 150,
    'achievement_desc': 60,
    'achievement_hint': 80,
    'log_message': 100,
    'button_text': 30,
}

# Warning threshold multiplier (warn if text is > average * multiplier)
# Set to 0 to disable average-based warnings
AVG_MULTIPLIER = 2.0

def parse_version_timestamp(content):
    match = re.search(r'var versionCode = "ver\. (\d{2}/\d{2}/\d{4} @ \d{2}:\d{2} [AP]M)"', content)
    if not match:
        return None
    ts_str = match.group(1)
    return datetime.strptime(ts_str, "%m/%d/%Y @ %I:%M %p")

def make_identifier(text):
    clean = re.sub(r'<[^>]+>', '', text or '')
    snippet = clean[:30].rstrip()
    return f'"{snippet}..."' if len(clean) > 30 else f'"{clean}"'

def check_length(text, limit, category, location, identifier, warnings):
    if not text:
        return 0
    clean_text = re.sub(r'<[^>]+>', '', text)
    if len(clean_text) > limit:
        warnings.append(f'Long Text - {category}: {location} - {identifier} is {len(clean_text)} chars (limit {limit})')
    return len(clean_text)

def check_average_outliers(lengths_data, category, warnings):
    if not lengths_data or AVG_MULTIPLIER <= 0:
        return

    actual_lengths = [l for l, _, _ in lengths_data if l > 0]
    if not actual_lengths:
        return

    avg = sum(actual_lengths) / len(actual_lengths)
    threshold = avg * AVG_MULTIPLIER

    # Don't warn for very short averages or if threshold is too low
    if threshold < 40:
        threshold = 40
    if avg < 10:
        threshold = max(threshold, 30)

    for length, location, identifier in lengths_data:
        if length > threshold and length > 30:
            warnings.append(f'Long Text - {category}: {location} - {identifier} is {length} chars (avg {avg:.0f}, limit {int(threshold)})')

def validate_csv(file_path, expected_columns, stat_indices, check_sequence=False):
    print(f"Validating {file_path}...")
    errors = []
    warnings = []

    name_lengths = []
    desc_lengths = []
    msg_lengths = []
    origin_name_lengths = []
    origin_desc_lengths = []

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        if not lines:
            return [f"File {file_path} is empty"], []

        header = lines[0].strip().split(';')
        if len(header) != expected_columns:
            errors.append(f"Header has {len(header)} columns, expected {expected_columns}")

        last_area = None
        seen_areas = set()
        area_first_row = {}  # area -> (line_num, row_id)

        for i, line in enumerate(lines[1:], start=2):
            stripped_line = line.strip()
            if not stripped_line or stripped_line.startswith('//'):
                continue
            cols = stripped_line.split(';')
            if len(cols) != expected_columns:
                hint = f' [{cols[1].strip()} {cols[2].strip()}]' if len(cols) >= 3 else (f' [{cols[1].strip()}]' if len(cols) >= 2 else '')
                errors.append(f"Line {i}{hint}: Found {len(cols)} columns, expected {expected_columns}")
                continue

            # Build row identity for use in all error messages
            if expected_columns == 15:
                row_id = f'[{cols[1].strip()} {cols[2].strip()}]'
            elif expected_columns == 11:
                row_id = f'[{cols[1].strip()}]'
            else:
                row_id = ''

            # Emoji check
            emoji_idx = 1 if expected_columns == 15 else 0
            emoji_val = cols[emoji_idx].strip()
            if not emoji_val:
                errors.append(f"Line {i} {row_id}: Missing emoji")
            elif re.search(r'[a-zA-Z]', emoji_val):
                errors.append(f"Line {i} {row_id}: Emoji column contains unexpected characters: '{emoji_val}'")

            # Stat numeric check
            for idx in stat_indices:
                val = cols[idx].strip()
                if val:
                    try:
                        float(val.replace(',', '.'))
                    except ValueError:
                        col_name = header[idx] if idx < len(header) else idx
                        errors.append(f"Line {i} {row_id}: '{col_name}' ('{val}') is not a number")

            # Text length checks for encounters/story
            if expected_columns == 15:
                name = cols[2]
                etype = cols[3]
                desc = cols[12]
                msg = cols[13]

                loc = f"{file_path}:{i}"
                is_generator = etype.strip().startswith("Generator")

                n = check_length(name, TEXT_LIMITS['encounter_name'], 'Name', loc, row_id, warnings)
                name_lengths.append((n, loc, row_id))

                if not (is_generator and desc.strip() == "XXX"):
                    n = check_length(desc, TEXT_LIMITS['encounter_desc'], 'Description', loc, row_id, warnings)
                    desc_lengths.append((n, loc, row_id))

                if not (is_generator and msg.strip() == "XXX"):
                    n = check_length(msg, TEXT_LIMITS['encounter_msg'], 'Message', loc, row_id, warnings)
                    msg_lengths.append((n, loc, row_id))

            # Text length checks for origins
            if expected_columns == 11:
                loc = f"{file_path}:{i}"
                n = check_length(cols[1], TEXT_LIMITS['origin_name'], 'Origin Name', loc, row_id, warnings)
                origin_name_lengths.append((n, loc, row_id))
                n = check_length(cols[9], TEXT_LIMITS['origin_desc'], 'Origin Description', loc, row_id, warnings)
                origin_desc_lengths.append((n, loc, row_id))

            # Sequence check for area
            if check_sequence:
                area = cols[0].strip()
                if area != last_area:
                    if area in seen_areas:
                        # last_area is the blip interrupting this block — flag where it started
                        blip_line, blip_rid = area_first_row[last_area]
                        errors.append(f"Line {blip_line} {blip_rid}: Area '{last_area}' interrupts '{area}' block — misplaced row or typo")
                    else:
                        seen_areas.add(area)
                        area_first_row[area] = (i, row_id)
                    last_area = area

    check_average_outliers(name_lengths, 'Name', warnings)
    check_average_outliers(desc_lengths, 'Description', warnings)
    check_average_outliers(msg_lengths, 'Message', warnings)
    check_average_outliers(origin_name_lengths, 'Origin Name', warnings)
    check_average_outliers(origin_desc_lengths, 'Origin Description', warnings)

    return errors, warnings

def validate_js_files(js_dir):
    print(f"Validating JS files in {js_dir}...")
    warnings = []

    ach_desc_lengths = []
    ach_hint_lengths = []
    log_lengths = []
    btn_lengths = []
    enc_name_lengths = []
    enc_desc_lengths = []
    enc_msg_lengths = []

    # Regexes
    ach_desc_re = re.compile(r'desc:\s*[\'"](.*?)[\'"]', re.IGNORECASE)
    ach_hint_re = re.compile(r'hint:\s*[\'"](.*?)[\'"]', re.IGNORECASE)
    log_action_re = re.compile(r'logAction\(\s*[\'"](.*?)[\'"]', re.IGNORECASE)
    log_player_action_re = re.compile(r'logPlayerAction\([^,]+,\s*[\'"](.*?)[\'"]', re.IGNORECASE)
    button_set_re = re.compile(r'setButton\([^,]+,\s*[\'"](.*?)[\'"]', re.IGNORECASE)
    button_inner_re = re.compile(r'\.innerHTML\s*=\s*[\'"](.*?)[\'"]', re.IGNORECASE)
    hc_name_re = re.compile(r'["\']name:(.*?)["\']', re.IGNORECASE)
    hc_desc_re = re.compile(r'["\']desc:(.*?)["\']', re.IGNORECASE)
    hc_msg_re = re.compile(r'["\']message:(.*?)["\']', re.IGNORECASE)

    for root, _, files in os.walk(js_dir):
        for file in files:
            if not file.endswith('.js'):
                continue

            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            def get_loc(match):
                line_no = content.count('\n', 0, match.start()) + 1
                return f"{file}:{line_no}"

            # Achievements
            if 'achievements.js' in file:
                for m in ach_desc_re.finditer(content):
                    loc, idf = get_loc(m), make_identifier(m.group(1))
                    ach_desc_lengths.append((check_length(m.group(1), TEXT_LIMITS['achievement_desc'], 'Achievement Description', loc, idf, warnings), loc, idf))
                for m in ach_hint_re.finditer(content):
                    loc, idf = get_loc(m), make_identifier(m.group(1))
                    ach_hint_lengths.append((check_length(m.group(1), TEXT_LIMITS['achievement_hint'], 'Achievement Hint', loc, idf, warnings), loc, idf))

            # Logs
            for m in log_action_re.finditer(content):
                loc, idf = get_loc(m), make_identifier(m.group(1))
                log_lengths.append((check_length(m.group(1), TEXT_LIMITS['log_message'], 'Log Message', loc, idf, warnings), loc, idf))
            for m in log_player_action_re.finditer(content):
                loc, idf = get_loc(m), make_identifier(m.group(1))
                log_lengths.append((check_length(m.group(1), TEXT_LIMITS['log_message'], 'Log Message', loc, idf, warnings), loc, idf))

            # Buttons
            for m in button_set_re.finditer(content):
                loc, idf = get_loc(m), make_identifier(m.group(1))
                btn_lengths.append((check_length(m.group(1), TEXT_LIMITS['button_text'], 'Button Text', loc, idf, warnings), loc, idf))
            for m in button_inner_re.finditer(content):
                if 'button' in m.group(0).lower() or 'btn' in m.group(0).lower() or 'js/ui-buttons.js' in file_path:
                    loc, idf = get_loc(m), make_identifier(m.group(1))
                    btn_lengths.append((check_length(m.group(1), TEXT_LIMITS['button_text'], 'Button Text', loc, idf, warnings), loc, idf))

            # Hardcoded Encounters
            for m in hc_name_re.finditer(content):
                loc, idf = get_loc(m), make_identifier(m.group(1))
                enc_name_lengths.append((check_length(m.group(1), TEXT_LIMITS['encounter_name'], 'Name', loc, idf, warnings), loc, idf))
            for m in hc_desc_re.finditer(content):
                loc, idf = get_loc(m), make_identifier(m.group(1))
                enc_desc_lengths.append((check_length(m.group(1), TEXT_LIMITS['encounter_desc'], 'Description', loc, idf, warnings), loc, idf))
            for m in hc_msg_re.finditer(content):
                loc, idf = get_loc(m), make_identifier(m.group(1))
                enc_msg_lengths.append((check_length(m.group(1), TEXT_LIMITS['encounter_msg'], 'Message', loc, idf, warnings), loc, idf))

    check_average_outliers(ach_desc_lengths, 'Achievement Description', warnings)
    check_average_outliers(ach_hint_lengths, 'Achievement Hint', warnings)
    check_average_outliers(log_lengths, 'Log Message', warnings)
    check_average_outliers(btn_lengths, 'Button Text', warnings)
    check_average_outliers(enc_name_lengths, 'Name', warnings)
    check_average_outliers(enc_desc_lengths, 'Description', warnings)
    check_average_outliers(enc_msg_lengths, 'Message', warnings)

    return warnings

VOID_ELEMENTS = {
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
}

def _strip_jekyll_front_matter(raw):
    if not raw.startswith('---'):
        return raw
    idx = raw.find('\n---', 3)
    if idx == -1:
        return raw
    fm_end = idx + 4
    return '\n' * raw[:fm_end].count('\n') + raw[fm_end:]

def validate_html_file(file_path):
    """Check tag balance, duplicate IDs (errors) and style trailing semicolons (warnings)."""
    print(f"Validating HTML in {file_path}...")
    errors = []
    warnings = []

    with open(file_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    content = _strip_jekyll_front_matter(raw)

    def line_of(pos):
        return content.count('\n', 0, pos) + 1

    # Style attribute values should end with ';' — warning, not a structural break
    for m in re.finditer(r'style\s*=\s*"(.*?)"', content, re.DOTALL):
        val = m.group(1).strip()
        if val and not val.endswith(';'):
            short = val.replace('\n', ' ')
            short = ('...' + short[-57:]) if len(short) > 60 else short
            warnings.append(
                f"HTML Style - {file_path}:{line_of(m.start())}: "
                f"style value does not end with ';': \"{short}\""
            )

    # Duplicate id attributes — error: breaks getElementById
    seen_ids = {}
    for m in re.finditer(r'\bid\s*=\s*"([^"]+)"', content, re.IGNORECASE):
        id_val = m.group(1)
        ln = line_of(m.start())
        if id_val in seen_ids:
            errors.append(
                f"HTML IDs - {file_path}:{ln}: "
                f"duplicate id=\"{id_val}\" (first at line {seen_ids[id_val]})"
            )
        else:
            seen_ids[id_val] = ln

    # Tag balance — error: broken structure
    tag_re = re.compile(
        r'<!--.*?-->'              # skip comments
        r'|</(\w[\w:-]*)\s*>'     # close tag → group 1
        r'|<(\w[\w:-]*)([^>]*)>', # open/self-close → group 2 (name), group 3 (attrs)
        re.DOTALL
    )
    stack = []
    for m in tag_re.finditer(content):
        ln = line_of(m.start())
        if m.group(1) is not None:
            tag = m.group(1).lower()
            if tag in VOID_ELEMENTS:
                continue
            if not stack:
                errors.append(f"HTML Tags - {file_path}:{ln}: unexpected </{tag}> with nothing open")
            elif stack[-1][0] != tag:
                errors.append(
                    f"HTML Tags - {file_path}:{ln}: "
                    f"</{tag}> does not match open <{stack[-1][0]}> (line {stack[-1][1]})"
                )
            else:
                stack.pop()
        elif m.group(2) is not None:
            tag = m.group(2).lower()
            if tag in VOID_ELEMENTS:
                continue
            if (m.group(3) or '').rstrip().endswith('/'):
                continue  # self-closing e.g. <h2 ... />
            stack.append((tag, ln))
    for tag, ln in stack:
        errors.append(f"HTML Tags - {file_path}:{ln}: unclosed <{tag}>")

    return errors, warnings

def validate_html_in_js(js_dir):
    """Check style trailing semicolons in HTML embedded in JS string literals (warnings only)."""
    print(f"Validating HTML in JS files under {js_dir}...")
    warnings = []

    for root, _, files in os.walk(js_dir):
        for fname in sorted(files):
            if not fname.endswith('.js'):
                continue
            fpath = os.path.join(root, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            for i, line in enumerate(lines, 1):
                if line.strip().startswith('//'):
                    continue

                # style="VALUE" in single-quoted JS strings — complete, not concatenated
                # Lookahead (?!\s*"?\s*\+) excludes VALUE"+ (string-end then concat)
                for m in re.finditer(r'style="([^"<>+]+)"(?!\s*"?\s*\+)', line):
                    val = m.group(1).strip()
                    if val and not val.endswith(';'):
                        warnings.append(
                            f"HTML Style - {fname}:{i}: "
                            f"style value does not end with ';': \"{val[-60:]}\""
                        )

                # style=\"VALUE\" in double-quoted JS strings — complete, not concatenated
                for m in re.finditer(r'style=\\"([^\\"]+)\\"(?!\s*"?\s*\+)', line):
                    val = m.group(1).strip()
                    if val and not val.endswith(';'):
                        warnings.append(
                            f"HTML Style - {fname}:{i}: "
                            f"style value does not end with ';': \"{val[-60:]}\""
                        )

    return warnings

def check_tutorial_skip_index(story_csv_path, data_loader_path):
    errors = []

    dos_count = 0
    with open(story_csv_path, 'r', encoding='utf-8') as f:
        for line in f:
            stripped = line.strip()
            if not stripped or stripped.startswith('//'):
                continue
            cols = stripped.split(';')
            if cols[0].strip() == 'Depths of Slumber':
                dos_count += 1

    with open(data_loader_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all loadEncounter(N) calls with a literal integer — these are the tutorial skip calls
    skip_calls = [(m.group(1), int(m.group(1))) for m in re.finditer(r'loadEncounter\((\d+)\)', content)]

    if not skip_calls:
        errors.append(f"Tutorial Skip - no literal loadEncounter(N) calls found in {data_loader_path}")
        return errors

    for raw, idx in skip_calls:
        if idx != dos_count:
            errors.append(
                f"Tutorial Skip - data-loader.js: loadEncounter({idx}) but story.csv has "
                f"{dos_count} 'Depths of Slumber' rows (expected loadEncounter({dos_count}))"
            )

    return errors

def main():
    all_errors = []
    all_warnings = []

    # Validate encounters.csv
    if os.path.exists('data/encounters.csv'):
        errs, warns = validate_csv('data/encounters.csv', 15, range(4, 11), check_sequence=True)
        all_errors.extend(errs)
        all_warnings.extend(warns)

    # Validate story.csv
    if os.path.exists('data/story.csv'):
        errs, warns = validate_csv('data/story.csv', 15, range(4, 11))
        all_errors.extend(errs)
        all_warnings.extend(warns)

    # Check tutorial skip index consistency
    if os.path.exists('data/story.csv') and os.path.exists('js/data-loader.js'):
        all_errors.extend(check_tutorial_skip_index('data/story.csv', 'js/data-loader.js'))

    # Validate origins.csv
    if os.path.exists('data/origins.csv'):
        errs, _ = validate_csv('data/origins.csv', 11, range(2, 9))
        all_errors.extend(errs)

    # Validate JS files
    if os.path.exists('js'):
        all_warnings.extend(validate_js_files('js'))

    # Validate HTML structure and style attributes
    if os.path.exists('index.md'):
        errs, warns = validate_html_file('index.md')
        all_errors.extend(errs)
        all_warnings.extend(warns)
    if os.path.exists('js'):
        all_warnings.extend(validate_html_in_js('js'))

    # Version check if base config is provided
    if len(sys.argv) > 2:
        current_config_path = sys.argv[1]
        base_config_path = sys.argv[2]

        if os.path.exists(current_config_path) and os.path.exists(base_config_path):
            with open(current_config_path, 'r') as f:
                current_ts = parse_version_timestamp(f.read())
            with open(base_config_path, 'r') as f:
                base_ts = parse_version_timestamp(f.read())

            if not current_ts:
                all_errors.append(f"Could not parse version from {current_config_path}")
            if not base_ts:
                print(f"Warning: Could not parse version from base config {base_config_path}")
            elif current_ts and current_ts <= base_ts:
                all_errors.append(f"Version check failed: Current version ({current_ts}) is not newer than base version ({base_ts}). Run version.sh!")

    if all_warnings:
        print("\nWarnings:")
        for warn in all_warnings:
            print(f"  {warn}")

    if all_errors:
        print("\nErrors:")
        for err in all_errors:
            print(f"  {err}")
        sys.exit(1)
    else:
        print("\nAll checks passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
