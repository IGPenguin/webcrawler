# Stay Dead Item Generation Rules

## 🎨 Emoji Selection
- **Source:** Primary inspiration from `ideas/misc.csv`.
- **Uniqueness:** MUST search `data/encounters.csv` (using `grep`) for any emoji before assigning it to a new item.
- **Tone:** Favor slightly surreal, melancholic, or mundane-turned-magical objects (e.g., `💡 Filament Cap`, `🩺 Mariner's Ear`).

## 📊 Stat Scaling (Area-Based)
Items should feel progressively more powerful but balanced with trade-offs in later areas.

| Area | Net Stat Total | Typical Stat Spike | Typical Penalty |
| :--- | :--- | :--- | :--- |
| **Fading Wildlands** | +1 | +1 | None |
| **Forsaken Village** | +1 to +2 | +2 | -1 (Secondary stat) |
| **Twisted Fairyland** | +1 to +2 | +2 (Magic focus) | -1 (Intellect/Luck) |
| **River of Sorrows** | +2 | +2 | -1 (Luck) |
| **Shrouded Necropolis**| +1 to +2 | +3 | -2 (Health/Magic) |

## 🛡️ Equipment Slots
Ensure a balance of items for these specific `Item-` types:
- `Item-Head`
- `Item-Chest`
- `Item-Weapon`
- `Item-Legs`

## 📝 Formatting & Style
- **Delimiter:** Primary delimiter is `;` (semicolon).
- **Description:** Use `<b>` tags for stat mentions and `<br>` for line breaks.
- **Message:** No emojis in the message field (column 14). Keep it short and evocative.
- **Note:** Mark higher-tier or unique items as `<b>Artifact</b>`.
- **Def Stat:** `def` (Physical Defence) should be used sparingly, primarily on Head and Legs.

## 🎣 Fishing Loot Pool
- Items for the `Fishing` area should be aquatic, discarded, or sunken themed.
- Stats should be balanced around +2 total.
- Emojis should be nautical or debris-related.
