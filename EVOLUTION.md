# EVOLUTION.md — Loot Choice System + Hardcore Dream Encounter

**Status:** Planning complete. Partial implementation in place (see "Files Already Changed" below). Ready for a focused implementation session.

**Lineage:** Supersedes and absorbs [LOOT-TEAS] from TODOs.md. LOOT-TEAS proposed veiling the encounter card and snapping it open; this feature delivers a richer version of that same anticipation beat — three choices revealed sequentially, player picks one — and removes the need for LOOT-TEAS as a separate item.

---

## Feature 1: Loot Choice System

### Design Brief (Perseus meeting 2026-05-31)

When a player picks up loot (enemy drops, generator item encounters), instead of receiving one item automatically, a 3-choice overlay appears showing three weighted-random items. The items reveal in an auto-sequence animation. The player selects one and confirms. The others are discarded.

**Tone ruling:** Frame this as *finding something*, not *winning something*. Cards surface from darkness one by one. A flavored log line fires before the overlay opens ("One line of weight before every significant delivery" — DESIGN.md). No ratchet sounds. The reveal is a lid giving way.

**What LOOT-TEAS had right:** The pre-reveal anticipation beat — obscure the outcome, run a log line, then reveal. This feature delivers that at a higher level: three obscured cards revealed sequentially is a better version of the LOOT-TEAS veil+snap. The `getLootChoiceLog()` string pool (already implemented in string-generator.js) is the LOOT-TEAS "roll text pool" at scale.

**Scope:** All `enemyType === "Item"` Grab events: generator items, enemy drops, **fishing catches, and shade shop purchases**. Friend quest rewards (future feature) are also earmarked. Coins, ⚖️ scales, and items with special-purpose notes are excluded.

**Items to skip choice for:**
- `enemyEmoji === '🪙'` or `'💰'`
- `enemyEmoji === '⚖️'`
- `enemyTeam` includes `Lover's Memento`, `Piece of History`, or `Transient Currency`

**Fishing is NOT skipped** — it gets the 3-choice overlay, but its two alternate choices come from the fishing loot pool (not `generateRandomItem()`). See "Fishing Trigger" below.

---

### UI Design: Origins-Style Picker

The overlay uses the same pattern as the origins list in `menu.js` (`_renderOriginPicker`). This means:

- Scrollable list of `menu-history-entry` divs (not fixed `loot_card_0/1/2` IDs)
- Each card shows:
  - **Left column:** emoji (26px) + slot label below (e.g. "Weapon", "Trinket") in small text
  - **Right column:** item name in rarity color with `-webkit-text-stroke` stroke, Memory badge (🧩 Memory in green) floated right if `achiev` field is set and not `'none'`
  - Desc line 1 (13px, white)
  - Desc line 2 (12px, italic, 60% opacity, only if present after `<br>`)
  - Row background tinted by `RarityManager.getBg(tier)`
- Clicking a card: adds `menu-history-selected` class (gold inset border, defined in CSS already), activates the confirm button
- Confirm button: starts greyed out (`color:grey; disabled`), becomes gold when a card is selected, label updates to show chosen item name
- **Auto-sequence reveal:** cards start at `opacity:0`, each animates in via `lootCardReveal` CSS keyframe, staggered at `80ms + idx * 310ms`. Player can click any card as soon as it reveals — no need to wait for all three.
- Cards are **shuffled** before display so the current-encounter item isn't always in a fixed slot.

**Memory/familiar badge** (exact HTML from menu.js):
```html
<span style="float:right; font-size:12px; -webkit-text-stroke:0; paint-order:stroke fill; padding-right:10px; margin-top:-2px;">🧩 <i style="font-weight:600; color:#62a862ff; -webkit-text-stroke:3px #121212; paint-order:stroke fill;">Memory</i></span>
```
Check `row[14].split(":").slice(1).join(":").trim()` — badge shows if that value is non-empty and not `'none'`.

---

### Critical Flow Change vs. Earlier Design

**Old plan:** On pick, call `_applyChosenItem(snap)` — a helper that manually loads stats into enemy globals and calls `playerChangeStats()`.

**New plan (correct):** On pick, call `pushEncounter(chosenRow); nextEncounter();` — the chosen raw CSV row is pushed as the next encounter and loads normally. The player then sees it as a new encounter card and interacts with it via the action buttons. This:
- Preserves all existing encounter handling (log lines, slot-conflict swap dialog, special emojis)
- Requires zero stat-application code in the choice callback
- Means the player gets a full second encounter interaction with the chosen item (Grab to equip, etc.)
- Works correctly for consumables too if they're ever added to the pool

**This means `_applyChosenItem` is NOT needed and should not be implemented.**

---

### LootChoiceManager — Revised API

`LootChoiceManager.show(rows, context, onPick)`
- `rows` — array of 3 raw CSV row arrays (not snapshots)
- `context` — `'corpse'` | `'prop'`
- `onPick(chosenRow)` — called with the raw row; caller does `pushEncounter(chosenRow); nextEncounter();`

`LootChoiceManager.snapFromRow(row)` — converts a raw CSV row to a display snapshot. Already in loot-choice.js.

`_buildCard(row)` (internal) — builds a `menu-history-entry` div from a raw row using origins-style HTML. Reads `row[14]` for the familiar badge. Returns `{el, row, snap}`.

**The current loot-choice.js was written with the old snapshot-based API.** It needs to be rewritten with the row-based API and origins-style HTML. See the "Files Still Needed" section.

---

### `_currentRawRow` — New Global

Because the loot choice needs the current encounter's raw CSV row as one of the three choices, and that row is only available in `loadEncounter()` (not reconstructible from enemy globals), we need to capture it.

**Add to `js/game-state.js`** (after `_lootChoiceContext`):
```js
var _currentRawRow = null; // raw CSV row of currently loaded encounter; set in loadEncounter()
```

**Add to `js/encounter-loader.js`** — at the very start of `loadEncounter(index, fileLines)`, right after `encounterIndex = index; var row = fileLines[index];`:
```js
_currentRawRow = row;
```

The intercept in action-resolver reads `_currentRawRow` as the first choice option.

---

### Files Already Changed

**`js/game-state.js`**
- `var _lootChoiceContext = 'prop';` — added. Tracks corpse vs prop context for the string pool.
- `var _currentRawRow = null;` — added. (Done this session.)

**`js/string-generator.js`**
- `getLootChoiceLog(context, tier)` — added before `getLootDropLog()`. Two contexts × three rarity tiers × 5 strings each = 30 pool strings. Already complete.

**`js/inventory-manager.js`**
- `renderItemCard: _itemRowHtml` added to public return. Not strictly needed by the new design (loot-choice.js builds its own HTML inline), but harmless and useful for future callers.

**`js/loot-choice.js`** (new file, but needs rewrite)
- Currently written with the old snapshot-based API (`show(items, context, onPick)` where items = snapshots, 3 fixed card IDs). **Must be rewritten** with the row-based API and origins-style HTML before integration. See below.

---

### Files Still Needed

#### `js/loot-choice.js` — **Full rewrite**

Discard the current snapshot-based implementation. Write fresh with:

```js
var LootChoiceManager = (function() {
  var _active = false;
  var _onPick = null;
  var _selectedRow = null;

  function snapFromRow(row) {
    if (!row || !row.length) return null;
    var rawType = String(row[3].split(":").slice(1).join(":"));
    var slot = rawType.startsWith("Item-") ? rawType.slice(5).toLowerCase() : null;
    return {
      emoji: String(row[1].split(":").slice(1).join(":")),
      name:  String(row[2].split(":").slice(1).join(":")),
      hp:    parseInt(row[4].split(":")[1])   || 0,
      atk:   parseInt(row[5].split(":")[1])   || 0,
      sta:   parseInt(row[6].split(":")[1])   || 0,
      lck:   parseFloat(row[7].split(":")[1]) || 0,
      int:   parseFloat(row[8].split(":")[1]) || 0,
      mgk:   parseInt(row[9].split(":")[1])   || 0,
      def:   parseInt(row[10].split(":")[1])  || 0,
      slot:  slot,
      note:  RarityManager.stripTagFromNote(String(row[11].split(":").slice(1).join(":"))),
      desc:  String(row[12].split(":").slice(1).join(":"))
    };
  }

  function _snapTier(data) {
    var noteTag = RarityManager.getTierFromNote(data.note || '');
    if (noteTag) return noteTag;
    if ((data.note || '').includes('Artifact')) return 'Legendary';
    return RarityManager.getTierForItemNet(RarityManager.calcNet(data));
  }

  function _highestTier(snaps) {
    var vals = { Legendary: 5, Rare: 4, Uncommon: 3, Common: 2, Cursed: 1 };
    var best = 'Common';
    snaps.forEach(function(s) {
      var t = _snapTier(s);
      if ((vals[t] || 0) > (vals[best] || 0)) best = t;
    });
    return best;
  }

  function _buildCard(row) {
    var snap = snapFromRow(row);
    if (!snap) return null;
    var tier       = _snapTier(snap);
    var rarityBg   = RarityManager.getBg(tier);
    var rarityColor = RarityManager.getColor(tier);
    var descParts  = snap.desc.split(/<br\s*\/?>/i);
    var descLine1  = descParts[0] || '';
    var descLine2  = descParts.length > 1 ? descParts.slice(1).join('<br>') : '';
    var slotLabel  = snap.slot ? (snap.slot.charAt(0).toUpperCase() + snap.slot.slice(1)) : '';
    var _achiev    = row[14] ? String(row[14].split(":").slice(1).join(":")).trim() : 'none';
    var memBadge   = (_achiev && _achiev !== 'none')
      ? ' <span style="float:right;font-size:12px;-webkit-text-stroke:0;padding-right:10px;margin-top:-2px;">🧩 <i style="font-weight:600;color:#62a862ff;-webkit-text-stroke:3px #121212;paint-order:stroke fill;">Memory</i></span>'
      : '';

    var el = document.createElement('div');
    el.className = 'menu-history-entry';
    el.setAttribute('tabindex', '0');
    el.style.cursor = 'pointer';
    el.style.userSelect = 'none';
    el.style.opacity = '0';
    if (rarityBg) el.style.backgroundColor = rarityBg;

    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;padding:10px 6px 8px 12px;margin-top:8px;">'
        + '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;width:42px;gap:3px;align-self:center;">'
          + '<span style="font-size:26px;line-height:1;margin-bottom:2px;">' + snap.emoji + '</span>'
          + (slotLabel ? '<h5 style="margin:0;font-size:10px;font-style:normal;font-weight:600;opacity:0.8;text-align:center;color:#fff;white-space:nowrap;">' + slotLabel + '</h5>' : '')
        + '</div>'
        + '<div style="flex:1;min-width:0;">'
          + '<h5 style="margin:0 0 3px 0;font-size:16px;font-style:normal;font-weight:600;color:' + rarityColor + ';text-align:left;-webkit-text-stroke:3px #121212;paint-order:stroke fill;">'
          + snap.name + memBadge + '</h5>'
          + '<h5 style="margin:0;font-size:13px;font-style:normal;font-weight:400;text-align:left;line-height:165%;color:#fff;">' + descLine1 + '</h5>'
          + (descLine2 ? '<h5 style="margin:0;font-size:12px;font-style:italic;font-weight:400;opacity:0.6;text-align:left;line-height:150%;color:#fff;">' + descLine2 + '</h5>' : '')
        + '</div>'
      + '</div>';
    return { el: el, row: row, snap: snap };
  }

  function show(rows, context, onPick) {
    if (_active) return;
    _active = true;
    _onPick = onPick;
    _selectedRow = null;

    var overlay    = document.getElementById('loot_choice_overlay');
    var logEl      = document.getElementById('loot_choice_log');
    var listEl     = document.getElementById('loot_choice_list');
    var confirmBtn = document.getElementById('loot_choice_confirm');
    if (!overlay || !logEl || !listEl || !confirmBtn) {
      _active = false; if (onPick && rows[0]) onPick(rows[0]); return;
    }

    var snaps = rows.map(snapFromRow).filter(Boolean);
    logEl.textContent = getLootChoiceLog(context, _highestTier(snaps));
    listEl.innerHTML = '';
    confirmBtn.innerHTML = '✦ Choose...';
    confirmBtn.style.color = 'grey';
    confirmBtn.disabled = true;
    confirmBtn.onclick = null;
    overlay.style.display = 'flex';

    // Shuffle rows
    var shuffled = rows.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = t;
    }

    var cards = shuffled.map(_buildCard).filter(Boolean);
    cards.forEach(function(card) { listEl.appendChild(card.el); });

    // Wire click handlers
    cards.forEach(function(card) {
      card.el.addEventListener('click', function() {
        listEl.querySelectorAll('.menu-history-entry').forEach(function(el) {
          el.classList.remove('menu-history-selected');
        });
        card.el.classList.add('menu-history-selected');
        _selectedRow = card.row;
        confirmBtn.innerHTML = '✦ Take ' + card.snap.emoji + ' ' + card.snap.name;
        confirmBtn.style.color = '#FFD940';
        confirmBtn.disabled = false;
        confirmBtn.onclick = _pick;
      });
    });

    // Auto-sequence reveal
    cards.forEach(function(card, idx) {
      setTimeout(function() {
        card.el.style.animation = 'lootCardReveal 0.28s ease forwards';
      }, 80 + idx * 310);
    });
  }

  function _pick() {
    if (!_active || !_selectedRow) return;
    _active = false;
    var row = _selectedRow;
    _selectedRow = null;
    var overlay = document.getElementById('loot_choice_overlay');
    if (overlay) overlay.style.display = 'none';
    var cb = _onPick; _onPick = null;
    if (cb) cb(row);
  }

  return { show: show, snapFromRow: snapFromRow };
})();
```

---

#### `index.md` — 3 additions

**1. HTML overlay** — add after the existing `swap_overlay` div (around line 380):
```html
<!-- Loot choice overlay -->
<div id="loot_choice_overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.90); z-index:9999; align-items:center; justify-content:center; flex-direction:column;">
  <div class="card" style="background-color:#202020; padding:20px 20px 14px 20px; max-width:320px; width:90%; box-shadow:0 0 0 3px #000;">
    <div id="loot_choice_log" style="text-align:center; font-size:13px; color:#aaa; margin-bottom:12px; font-style:italic; min-height:1.4em;"></div>
    <div id="loot_choice_list" style="display:flex; flex-direction:column; gap:0; overflow-y:auto; max-height:420px;"></div>
    <button id="loot_choice_confirm" class="menu-btn" style="margin-top:14px; color:grey;" disabled>✦ Choose...</button>
  </div>
</div>
```

**2. CSS keyframe** — add inside the existing `<style>` block (search for it in index.md, or add a new one):
```css
@keyframes lootCardReveal {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```
No `.loot-choice-card` class needed — cards use `menu-history-entry` which already has all hover/selected styles in the compiled CSS.

**3. Script tag** — add after `encounter-generator.js` (line 77):
```html
<script src="js/loot-choice.js"></script>
```
Must load before `action-resolver.js` (line 83). All dependencies (`RarityManager`, `string-generator.js`, `inventory-manager.js`) are already loaded by this point.

---

#### `js/encounter-loader.js` — 1 line

At the very start of `loadEncounter(index, fileLines)`, right after `var row = fileLines[index];`:
```js
_currentRawRow = row;
```

---

#### `js/action-resolver.js` — 3 additions

**1. Set `_lootChoiceContext = 'corpse'`** before each `pushEncounter(corpseLoot)` call in `case 'button_grab':` (lines ~1793 and ~1807):
```js
_lootChoiceContext = 'corpse';  // ← add before each pushEncounter(corpseLoot)
pushEncounter(corpseLoot);
```

**2. Loot choice intercept** — in `button_grab` → `case "Item":`, insert just before `// ── Slot equip/swap ──` (line ~2253):
```js
// ── Loot choice intercept ─────────────────────────────────────────────────
var _skipChoice =
  enemyEmoji === '🪙' || enemyEmoji === '💰' || enemyEmoji === '⚖️' ||
  (enemyTeam && (enemyTeam.includes("Lover's Memento") ||
    enemyTeam.includes("Piece of History") || enemyTeam.includes("Transient Currency")));

if (!_skipChoice && _currentRawRow) {
  // For fishing: alternate choices come from the fishing loot pool, not generateRandomItem()
  var _lc1, _lc2;
  if (isFishing) {
    _lc1 = linesLoot[getWeightedLootIndex(playerLck, playerKarma)] || null;
    _lc2 = linesLoot[getWeightedLootIndex(playerLck, playerKarma)] || null;
  } else {
    _lc1 = generateRandomItem();
    _lc2 = generateRandomItem();
  }
  var _lcCtx = _lootChoiceContext;
  _lootChoiceContext = 'prop';
  LootChoiceManager.show(
    [_currentRawRow, _lc1, _lc2].filter(Boolean),
    _lcCtx,
    function(chosenRow) { pushEncounter(chosenRow); nextEncounter(); }
  );
  break;
}
// ─────────────────────────────────────────────────────────────────────────
```

The existing slot equip / loot string / `playerChangeStats` code below is untouched — it only runs for items that skip the choice overlay (coins, special emojis).

**No `_applyChosenItem` helper needed** — the `pushEncounter + nextEncounter` pattern handles everything through the normal encounter flow.

---

---

### Additional Loot Choice Triggers

#### Fishing Trigger

Fishing is now included. The overlay appears when the player grabs a fishing catch. The two alternate rows use `getWeightedLootIndex(playerLck, playerKarma)` to pull from `linesLoot` (the fishing-specific pool from `encounters.csv` area=Fishing rows). The chosen row is pushed via `pushEncounter(chosenRow); nextEncounter();` — the fish still loads normally as an encounter, preserving all existing fishing item handling (fishing stats, fishingRested flag, etc.).

Context string: `'prop'` (same as generator items — fishing is an environmental find, not a body).

**No changes needed to `getRandomFish()` or `game-loop.js` fishing flow.** The intercept in `action-resolver.js` already fires on any `case "Item"` Grab regardless of `isFishing`. The only change is removing `isFishing` from the `_skipChoice` guard and generating alternates from `linesLoot` instead of `generateRandomItem()`.

#### Shade Shop Trigger

When the player buys an item or artifact from the drachma shop (the Undertaker Shade), instead of receiving a single randomly selected item, the 3-choice overlay appears with three weighted-random shop stock options.

Implementation in `encounter-loader.js` → `drachmaeBuy()` (or wherever the shop item row is resolved): instead of directly calling `pushEncounter(row); nextEncounter();` for an item purchase, collect 3 candidate rows and call `LootChoiceManager.show(rows, 'prop', function(chosenRow) { pushEncounter(chosenRow); nextEncounter(); })`.

The two additional rows should be generated via `getWeightedEncounter(["Item", "Item-head", "Item-chest", "Item-weapon", "Item-legs", "Item-trinket"])` to match shop stock quality.

Context string: `'prop'`.

**Note:** Coins/drachma purchases remain unchanged — only item/artifact shop choices use the overlay. Exactly how shop stock is assembled (which types are valid, whether consumables appear) is a scoping call for implementation day. This is v2 scope — get the base loot overlay working first.

#### Friend Quest Reward Trigger

When the player successfully Speaks to a Friend who wants a specific item (quest items listed in the `type` field, `/`-separated), the existing reward path at `action-resolver.js` line ~2920 fires:

```js
pushEncounter(getRandomEncounter(["Item"],["Artifact"]));  // ← single artifact, replace with 3-choice
```

Replace that single push with:
```js
var _qa = getRandomEncounter(["Item"],["Artifact"]);
var _qb = getRandomEncounter(["Item"],["Artifact"]);
var _qc = getRandomEncounter(["Item"],["Artifact"]);
LootChoiceManager.show([_qa, _qb, _qc].filter(Boolean), 'prop', function(chosenRow) {
  pushEncounter(chosenRow);
  nextEncounter();
});
```

**Critical:** the XP gain and stat changes (`playerGainXP`, `playerChangeStats`) at lines 2925-2936 must run **before** calling `LootChoiceManager.show()` and then `break` — the overlay is async and those lines would never execute if placed after `show()`. Restructure the qualifying block so reward stats fire first, then the overlay, then `break`.

Context string: `'prop'` (receiving a gift, not looting a body).

The quest item removal (`playerLootString = playerLootString.replace(heldQuestItem, "")`) and achievement check (`AchievementManager.check('quest_complete')`) also run before `show()`.

---

### Architecture Notes

- `pushEncounter` inserts at `encounterIndex + 1` — LIFO. Last pushed = first encountered. The intercept pushes the chosen row as the next encounter; nextEncounter() loads it. The player gets a fresh encounter interaction (Grab to equip/take, etc.).
- `_currentRawRow` survives from `loadEncounter()` call to the Grab handler because no encounter transition happens between them — the player is still on the same encounter.
- The shuffle in `show()` ensures the current-encounter item doesn't always appear first, preserving the slot-machine feel even for the "known" item.
- If the chosen item has a slot conflict, `loadEncounter()` will show the slot-diff log on load, and the player's subsequent Grab will trigger the normal `InventoryManager.tryEquip()` swap dialog. Two interactions in sequence — expected and correct.
- `generateRandomItem()` excludes Artifacts, Lover's Memento, Piece of History, Lost Possession. Good defaults.

---

### Testing Checklist

- [ ] Generator Item encounter → Grab → 3-choice overlay appears with origins-style cards
- [ ] All 3 cards reveal sequentially (80ms, 390ms, 700ms)
- [ ] Click card → highlights gold, confirm button activates with item name
- [ ] Confirm → overlay closes, chosen item loads as next encounter
- [ ] Second Grab on chosen item → item equips/adds to loot normally
- [ ] Corpse loot → overlay uses 'corpse' string pool
- [ ] Generator item → overlay uses 'prop' string pool
- [ ] Fishing encounter → overlay appears with two alternate rows from linesLoot pool
- [ ] Chosen fish → loads as normal encounter, fishingRested/fishing stats unaffected
- [ ] Coin encounter → no overlay
- [ ] ⚖️ encounter → no overlay
- [ ] Memory badge shows on achievement-gated items
- [ ] Both desc lines display correctly (line 2 italic, 60% opacity)
- [ ] Slot label shows under emoji for slot items (e.g. "Weapon")
- [ ] `validate-js.sh` passes
- [ ] `bash test-boot.sh` passes

---

## Feature 2: Hardcore Pre-Boss Dream Sequence

### Design Brief

On Hardcore difficulty only, inject a two-beat Dream sequence immediately before the final boss in Shrouded Necropolis. The sequence completely replaces the boss fight — the player never reaches Rosabel.

**Beat 1 — Lucid Descent `💭`:** The lore reveal. The corrupted world was never real — the player dreamed it into being. This explains reincarnation, loot agency, everything. Continue/Walk advances to Beat 2.

**Beat 2 — Curse Lifted `✨`:** The awakening. The spell breaks. Walking out triggers `gameEnd()` with a special `win_dream` endType — a full win, complete with score submission and the stack overflow screen. The boss encounter queued behind these two is never loaded.

**Tone:** Game voice. Spare. One revelation, then the door opens.

---

### Encounter Rows (hardcode in `js/game-state.js`)

```js
var hardcoreDreamReveal = [
  "area:Shrouded Necropolis",
  "emoji:💭",
  "name:Lucid Descent",
  "type:Dream",
  "hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0",
  "note:Lore",
  "desc:The corruption was never real. You dreamed it into being.<br>That is why you return. The dreamer does not die.",
  "message:The spell broke the moment you understood.",
  "achiev:none"
];

var hardcoreDreamWake = [
  "area:Shrouded Necropolis",
  "emoji:✨",
  "name:Curse Lifted",
  "type:Dream",
  "hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0",
  "note:Lore|HardcoreWin",
  "desc:The fog falls away. The necropolis is empty.<br>You have been standing here a long time.",
  "message:Walked out of the dream. Left the dead behind.",
  "achiev:none"
];
```

The `HardcoreWin` tag in the note field is how the Walk handler detects this specific dream and triggers the win path instead of `nextEncounter()`.

---

### Implementation

#### `js/game-state.js`
Add both rows near the other hardcoded rows (`soulbindingArch`, `drachmaShop`, etc.).

#### `js/encounter-generator.js` — `case 9: // Boss`
After `pushEncounter(getRandomEncounter(allBosses))`, add:

```js
// Hardcore-only: two-beat dream sequence in Shrouded Necropolis
// LIFO: boss pushed first (+1), then wake (+1→boss to +2), then reveal (+1→wake to +2→boss to +3)
// Player encounters: reveal → wake → (boss never reached if win triggered)
if (areaName.includes("Shrouded") && GAME_CONFIG.label === 'Hardcore') {
  pushEncounter(hardcoreDreamWake);
  pushEncounter(hardcoreDreamReveal);
}
```

**LIFO push order matters:** Push boss first, then wake, then reveal — each new push goes to +1, displacing the rest. Final queue: reveal at +1, wake at +2, boss at +3. Player encounters reveal → wake → (win fires, boss never loads).

#### `js/action-resolver.js` — Dream Walk handler
Locate the existing `case "Dream":` Walk handler. It currently logs `enemyMsg` and calls `nextEncounter()`. Add a check for the `HardcoreWin` note before that:

```js
case "Dream":
  // button_walk
  if (enemyType === "Dream") {
    if ((enemyNoteRaw || '').includes('HardcoreWin')) {
      // Hardcore dream win path — skip boss, award win
      logPlayerAction(actionString, enemyMsg);
      adventureEndReason = "dream";
      gameEnd('win_dream');
      break;
    }
    logPlayerAction(actionString, enemyMsg);
    nextEncounter();
    break;
  }
```

Note: `enemyNoteRaw` needs to be the note field before `RarityManager.stripTagFromNote()` strips the bracket tags, OR check `enemyType === "Dream" && enemyName === "Curse Lifted"` as a simpler alternative. Either works; the name check is more robust against future note field changes.

#### `js/score-manager.js` — New endType
Add `win_dream` to `ScoreManager.getEndingLabel()`:
```js
case 'win_dream': return 'Woke Up';
```
The `win_` prefix means it automatically gets the +100 win bonus in the score formula (existing `endType.startsWith('win_')` check). No other score changes needed.

#### `js/achievements.js` — Hardcore win achievement
Add a new achievement ID (e.g. `hardcore_dream`). Unlock it in `_doGameEnd()` when `endType === 'win_dream'`:
```js
if (endType === 'win_dream') {
  AchievementManager.unlock('hardcore_dream');
}
```

Define the achievement entry in `achievements.js` with appropriate display name and icon. Suggested:
- ID: `hardcore_dream`
- Name: "The Dreamer"
- Desc: "Woke up. Left the dream. Won Hardcore without the final fight."

#### `js/save-manager.js`
No changes needed. `win_dream` flows through `gameEnd()` → `_doGameEnd()` → `ScoreManager.submitOrPrompt()` exactly like all other win endTypes. The score dialog and stack overflow screen appear as normal.

---

### Testing Checklist

- [ ] Standard/Easy difficulty: no dream sequence before final boss, boss loads normally
- [ ] Hardcore: `💭 Lucid Descent` appears as first dream before the boss
- [ ] Walk on Lucid Descent → logs message → `✨ Curse Lifted` loads as next encounter
- [ ] Walk on Curse Lifted → logs message → score dialog appears (win flow, not boss fight)
- [ ] Score screen shows endType `win_dream` → label "Woke Up"
- [ ] Win bonus (+100) applied to score
- [ ] Achievement `hardcore_dream` ("The Dreamer") unlocks on win
- [ ] Hardcore boss encounter never loads after the wake (queue discarded by gameEnd)
- [ ] Other actions on either dream follow existing Dream handling in action-resolver.js

---

## What Was NOT Changed (intentional)

- The swap dialog (`showSwapDialog`) — unchanged; still shows on slot conflict after chosen item loads
- `generateRandomItem()` — unchanged; used as-is for item/corpse loot alternate choices
- `getRandomFish()` / `game-loop.js` fishing flow — unchanged; the intercept fires on Grab in action-resolver, not in the fish generation path
- Consumables in choice pool — deferred; architecture supports it, not in v1 scope
- Standard, Easy, Normal difficulty — no dream sequence before final boss
- Bride endings (9 paths via `resolveEnding()`) — unchanged; Hardcore dream win skips them entirely, not replaces them

---

*Written 2026-06-01. Features: Loot Choice System (absorbs [LOOT-TEAS]) + Hardcore Dream Win Sequence. This is the first post-beta release patch.*
