import sys
import os
import re
from datetime import datetime

def parse_version_timestamp(content):
    match = re.search(r'var versionCode = "ver\. (\d{2}/\d{2}/\d{4} @ \d{2}:\d{2} [AP]M)"', content)
    if not match:
        return None
    ts_str = match.group(1)
    return datetime.strptime(ts_str, "%m/%d/%Y @ %I:%M %p")

def validate_csv(file_path, expected_columns, stat_indices, check_sequence=False):
    print(f"Validating {file_path}...")
    errors = []
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        if not lines:
            return [f"File {file_path} is empty"]
        
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
            
            # Emoji check (usually index 1 for encounters/story, index 0 for origins)
            emoji_idx = 1 if expected_columns == 14 else 0
            if not cols[emoji_idx].strip():
                errors.append(f"Line {i}: Missing emoji")

            # Stat numeric check
            for idx in stat_indices:
                val = cols[idx].strip()
                if val: # Some might be empty if optional, but usually they are numbers
                    try:
                        float(val.replace(',', '.')) # handle decimal if any
                    except ValueError:
                        errors.append(f"Line {i}: Column {idx} ('{val}') is not a number")

            # Sequence check for area
            if check_sequence:
                area = cols[0].strip()
                if area != last_area:
                    if area in seen_areas:
                        errors.append(f"Line {i}: Area '{area}' appears out of sequence (Mixed Area)")
                    seen_areas.add(area)
                    last_area = area
                    
    return errors

def main():
    all_errors = []
    
    # Validate encounters.csv
    if os.path.exists('data/encounters.csv'):
        all_errors.extend(validate_csv('data/encounters.csv', 14, range(4, 11), check_sequence=True))
    
    # Validate story.csv
    if os.path.exists('data/story.csv'):
        all_errors.extend(validate_csv('data/story.csv', 14, range(4, 11)))
        
    # Validate origins.csv
    if os.path.exists('data/origins.csv'):
        all_errors.extend(validate_csv('data/origins.csv', 10, range(2, 9)))

    # Version check if base config is provided
    if len(sys.argv) > 2:
        current_config_path = sys.argv[1]
        base_config_path = sys.argv[2]
        
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
