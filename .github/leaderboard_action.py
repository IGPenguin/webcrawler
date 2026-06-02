"""
Stay Dead — Leaderboard processor.
Pulls the Google Sheet CSV, verifies HMAC, censors profanity,
deduplicates, sorts by score, and writes /tmp/highscores.json.
"""

import csv
import hashlib
import hmac
import io
import json
import os
import re
import urllib.request

SALT      = os.environ['LEADERBOARD_SALT']
CSV_URL   = os.environ['SHEET_CSV_URL']
OUT_PATH  = '/tmp/highscores.json'
TOP_N     = 200

# English + Czech profanity list (common forms only)
_PROFANITY = [
    # English
    'fuck', 'shit', 'cunt', 'nigger', 'faggot', 'retard', 'bitch',
    'asshole', 'bastard', 'whore', 'cock', 'pussy', 'dickhead',
    # Czech
    'kurva', 'pica', 'píča', 'kokot', 'hajzl', 'hovno', 'debil',
    'picat', 'zasrat', 'jebat', 'mrdat', 'kunda', 'zkurvit',
    'hovado', 'sráč', 'čurák', 'kurevník', 'jebaný', 'zasranej',
]
_PROFANITY_RE = re.compile(
    '|'.join(re.escape(w) for w in sorted(_PROFANITY, key=len, reverse=True)),
    re.IGNORECASE
)


def _verify(row: dict) -> bool:
    msg = '{}|{}|{}'.format(
        row.get('charName', ''),
        row.get('score', ''),
        row.get('datetime', '')
    ).encode('utf-8')
    expected = hmac.new(SALT.encode('utf-8'), msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, row.get('hash', ''))


def _censor(text: str) -> str:
    if not text:
        return text
    return _PROFANITY_RE.sub('***', text)


def main() -> None:
    response = urllib.request.urlopen(CSV_URL, timeout=30)
    content  = response.read().decode('utf-8')
    reader   = csv.DictReader(io.StringIO(content))

    valid: list[dict] = []
    seen: set[tuple]  = set()

    for row in reader:
        # Skip rows that fail HMAC verification
        if not _verify(row):
            print(f"SKIP (bad hash): {row.get('charName', '?')} score={row.get('score', '?')}")
            continue

        # Deduplicate by charName + datetime (exact same run can't appear twice)
        key = (row.get('charName', ''), row.get('datetime', ''))
        if key in seen:
            continue
        seen.add(key)

        try:
            row['score'] = int(row['score'])
        except (ValueError, KeyError, TypeError):
            continue

        row['nickname'] = _censor(row.get('nickname', ''))
        row['charName']  = _censor(row.get('charName', ''))

        # Drop the raw HMAC hash from public output
        row.pop('hash', None)

        valid.append(row)

    valid.sort(key=lambda r: r['score'], reverse=True)
    valid = valid[:TOP_N]

    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(valid, f, indent=2, ensure_ascii=False)

    print(f'Wrote {len(valid)} entries to {OUT_PATH}')


if __name__ == '__main__':
    main()
