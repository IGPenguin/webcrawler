# Technical Debt

This file tracks TODOs, hacks, and areas needing refactoring in the `js/` directory.<br>
Once these are solved, implement validator to check for any such comments (+ //FIXME) and throw warnings.

## js/action-config.js
- **L189:** `// TODO make curse stats affect chance success`

## js/action-resolver.js
- **L961:** `//TODO: No time to do it better now` (Handling enemy HP/damage logic)
- **L1686:** `//TODO Was 🍭, needs replacement` (Enemy emoji assignment)
- **L2472:** `//TODO refactor to something else` (Upgrade case in transfunctioner)

## js/achievements.js
- **L211:** `//Hehehehe, hack to log after logging action done` (Timing/ordering hack)

## js/encounter-loader.js
- **L42:** `//I'll end up in hell for these hacks` (Enemy boss type assignment)

## js/enemy-skills.js
- **L14:** `//TODO: switch emojis around >> 🐅 > ⚔️`

## js/game-loop.js
- **L2:** `//TODO refactor into encounters.csv (in the next life)`
- **L22:** `//Hacky hacky hack and mess on top of it` (Generator check logic)

## js/logging.js
- **L30:** `//Ahhh, yeah more hacks at 1 AM` (Coin emoji handling)
- **L31:** `//Very much HACKS... YOLO!!!` (String splitting for prices)

## js/menu.js
- **L614:** `// TODO Fix the .png` (Session sharing)
- **L646:** `/// TODO Hide buttons` (Sharing UI)
- **L661:** `// TODO Show buttons` (Sharing UI)

## js/player-skills.js
- **L401:** `//TODO this seems to not handle enemyDef at various places`
- **L451:** `//Another nasty hack, why is this so spaghetti` (HP change logic)
- **L587:** `//TODO Revise this threshold` (Karma threshold)

## js/ui-buttons.js
- **L113:** `//TODO: Invent new perk` (Rest/Sleep button)

## js/ui-render.js
- **L60:** `//Hacky hacky hacky hack hack hack, hacky hacky hacky, yeah yeah` (Team sorting/rendering)
- **L72:** `//TODO: Perhaps there should also be "Flying"??`
- **L101:** `//Tutorial hack` (Specific area UI override)
- **L319:** `//Hack` (Rest button label)
- **L335:** `//TODO Refactor usage or remove` (Enemy type display)
