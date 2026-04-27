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

def check_length(text, limit, category, location, warnings):
    if not text:
        return 0
    # Strip HTML for length check
    clean_text = re.sub(r'<[^>]+>', '', text)
    if len(clean_text) > limit:
        warnings.append(f"Length Warning [{category}]: '{clean_text[:20]}...' at {location} is {len(clean_text)} chars (limit {limit})")
    return len(clean_text)

def check_average_outliers(lengths_data, category, warnings):
    if not lengths_data or AVG_MULTIPLIER <= 0:
        return
    
    actual_lengths = [l for l, loc in lengths_data if l > 0]
    if not actual_lengths:
        return
        
    avg = sum(actual_lengths) / len(actual_lengths)
    threshold = avg * AVG_MULTIPLIER
    
    # Don't warn for very short averages or if threshold is too low
    if threshold < 40: 
        threshold = 40
    if avg < 10:
        threshold = max(threshold, 30)

    for length, location in lengths_data:
        if length > threshold and length > 30: 
            warnings.append(f"Average Warning [{category}]: Outlier at {location} is {length} chars (avg {avg:.1f}, threshold {threshold:.1f})")

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
        
        for i, line in enumerate(lines[1:], start=2):
            stripped_line = line.strip()
            if not stripped_line or stripped_line.startswith('//'):
                continue
            cols = stripped_line.split(';')
            if len(cols) != expected_columns:
                errors.append(f"Line {i}: Found {len(cols)} columns, expected {expected_columns}")
                continue
            
            # Emoji check
            emoji_idx = 1 if expected_columns == 14 else 0
            if not cols[emoji_idx].strip():
                errors.append(f"Line {i}: Missing emoji")

            # Stat numeric check
            for idx in stat_indices:
                val = cols[idx].strip()
                if val:
                    try:
                        float(val.replace(',', '.'))
                    except ValueError:
                        errors.append(f"Line {i}: Column {idx} ('{val}') is not a number")

            # Text length checks for encounters/story
            if expected_columns == 14:
                name = cols[2]
                etype = cols[3]
                desc = cols[12]
                msg = cols[13]
                
                loc = f"{file_path}:{i}"
                is_generator = etype.strip().startswith("Generator")
                
                name_lengths.append((check_length(name, TEXT_LIMITS['encounter_name'], 'Name', loc, warnings), loc))
                
                if not (is_generator and desc.strip() == "XXX"):
                    desc_lengths.append((check_length(desc, TEXT_LIMITS['encounter_desc'], 'Desc', loc, warnings), loc))
                
                if not (is_generator and msg.strip() == "XXX"):
                    msg_lengths.append((check_length(msg, TEXT_LIMITS['encounter_msg'], 'Msg', loc, warnings), loc))

            # Text length checks for origins
            if expected_columns == 10:
                name = cols[1]
                desc = cols[9]
                
                loc = f"{file_path}:{i}"
                origin_name_lengths.append((check_length(name, TEXT_LIMITS['origin_name'], 'Origin Name', loc, warnings), loc))
                origin_desc_lengths.append((check_length(desc, TEXT_LIMITS['origin_desc'], 'Origin Desc', loc, warnings), loc))

            # Sequence check for area
            if check_sequence:
                area = cols[0].strip()
                if area != last_area:
                    if area in seen_areas:
                        errors.append(f"Line {i}: Area '{area}' appears out of sequence (Mixed Area)")
                    seen_areas.add(area)
                    last_area = area
                    
    check_average_outliers(name_lengths, 'Name Outlier', warnings)
    check_average_outliers(desc_lengths, 'Desc Outlier', warnings)
    check_average_outliers(msg_lengths, 'Msg Outlier', warnings)
    check_average_outliers(origin_name_lengths, 'Origin Name Outlier', warnings)
    check_average_outliers(origin_desc_lengths, 'Origin Desc Outlier', warnings)

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
                        ach_desc_lengths.append((check_length(m.group(1), TEXT_LIMITS['achievement_desc'], 'Achiev Desc', get_loc(m), warnings), get_loc(m)))
                    for m in ach_hint_re.finditer(content):
                        ach_hint_lengths.append((check_length(m.group(1), TEXT_LIMITS['achievement_hint'], 'Achiev Hint', get_loc(m), warnings), get_loc(m)))

                # Logs
                for m in log_action_re.finditer(content):
                    log_lengths.append((check_length(m.group(1), TEXT_LIMITS['log_message'], 'Log', get_loc(m), warnings), get_loc(m)))
                for m in log_player_action_re.finditer(content):
                    log_lengths.append((check_length(m.group(1), TEXT_LIMITS['log_message'], 'Log', get_loc(m), warnings), get_loc(m)))

                # Buttons
                for m in button_set_re.finditer(content):
                    btn_lengths.append((check_length(m.group(1), TEXT_LIMITS['button_text'], 'Button', get_loc(m), warnings), get_loc(m)))
                for m in button_inner_re.finditer(content):
                    if 'button' in m.group(0).lower() or 'btn' in m.group(0).lower() or 'js/ui-buttons.js' in file_path:
                        btn_lengths.append((check_length(m.group(1), TEXT_LIMITS['button_text'], 'Button', get_loc(m), warnings), get_loc(m)))

                # Hardcoded Encounters
                for m in hc_name_re.finditer(content):
                    enc_name_lengths.append((check_length(m.group(1), TEXT_LIMITS['encounter_name'], 'HC Name', get_loc(m), warnings), get_loc(m)))
                for m in hc_desc_re.finditer(content):
                    enc_desc_lengths.append((check_length(m.group(1), TEXT_LIMITS['encounter_desc'], 'HC Desc', get_loc(m), warnings), get_loc(m)))
                for m in hc_msg_re.finditer(content):
                    enc_msg_lengths.append((check_length(m.group(1), TEXT_LIMITS['encounter_msg'], 'HC Msg', get_loc(m), warnings), get_loc(m)))

    check_average_outliers(ach_desc_lengths, 'Achiev Desc Outlier', warnings)
    check_average_outliers(ach_hint_lengths, 'Achiev Hint Outlier', warnings)
    check_average_outliers(log_lengths, 'Log Outlier', warnings)
    check_average_outliers(btn_lengths, 'Button Outlier', warnings)
    check_average_outliers(enc_name_lengths, 'HC Name Outlier', warnings)
    check_average_outliers(enc_desc_lengths, 'HC Desc Outlier', warnings)
    check_average_outliers(enc_msg_lengths, 'HC Msg Outlier', warnings)

    return warnings

def main():
    all_errors = []
    all_warnings = []
    
    # Validate encounters.csv
    if os.path.exists('data/encounters.csv'):
        errs, warns = validate_csv('data/encounters.csv', 14, range(4, 11), check_sequence=True)
        all_errors.extend(errs)
        all_warnings.extend(warns)
    
    # Validate story.csv
    if os.path.exists('data/story.csv'):
        errs, warns = validate_csv('data/story.csv', 14, range(4, 11))
        all_errors.extend(errs)
        all_warnings.extend(warns)
        
    # Validate origins.csv
    if os.path.exists('data/origins.csv'):
        errs, _ = validate_csv('data/origins.csv', 10, range(2, 9))
        all_errors.extend(errs)

    # Validate JS files
    if os.path.exists('js'):
        all_warnings.extend(validate_js_files('js'))

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
        print("\nValidation Warnings found:")
        for warn in all_warnings:
            print(f" ! {warn}")

    if all_errors:
        print("\nValidation Errors found:")
        for err in all_errors:
            print(f" - {err}")
        sys.exit(1)
    else:
        print("\nAll checks passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
