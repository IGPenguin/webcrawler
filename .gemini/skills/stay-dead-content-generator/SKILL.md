---
name: stay-dead-content-generator
description: Procedural content generation for the Stay Dead RPG. Use this skill to design new items, enemies, or encounters following specific area themes, stat scaling rules, and CSV formatting standards.
---

# Stay Dead Content Generator

This skill provides the procedural knowledge required to expand the "Stay Dead" dataset while maintaining thematic consistency, mechanical balance, and technical integrity.

## 🛠 Workflow

1.  **Research:**
    *   Consult `ideas/misc.csv` and `ideas/boosts.csv` for unused emojis and concepts.
    *   Use `grep` to verify emoji uniqueness in `data/encounters.csv`.
2.  **Strategy:**
    *   Determine the target Area and Slot (`Head`, `Chest`, `Weapon`, `Legs`).
    *   Select the power tier based on the Area (see [Item Rules](references/item-rules.md)).
3.  **Generation:**
    *   Draft the CSV row following the exact column schema.
    *   Ensure the description is declarative and uses correct HTML formatting.
4.  **Validation:**
    *   Run `bash validate-csv.sh` to ensure the new data meets project standards.

## 📜 Key Principles

- **Melancholic Tone:** Descriptions should be short, slightly ironic, and never verbose.
- **Power Scaling:** Progression should be felt as the player moves deeper into the world.
- **Surgical Integration:** When adding new items, maintain the existing load order and area clustering in `data/encounters.csv`.

For detailed stat tables and formatting examples, refer to `references/item-rules.md`.
