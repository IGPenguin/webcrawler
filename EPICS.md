# EPICS.md — Major Expansion Plans

*7 epics · last updated 2026-06-01*

---

## P1 — Active *(design complete, ready to implement)*

### [LOOT-CHCE] Epic: Loot Choice System — 3-item pick overlay on all loot events
- When a player picks up loot (enemy drops, generator items, fishing catches, shop purchases), a 3-choice overlay appears showing three weighted-random items. Items reveal in auto-sequence animation; the player selects one, and the chosen raw CSV row is pushed via `pushEncounter + nextEncounter`, loading normally through all existing handlers.
- Design complete as of 2026-05-31 Perseus session. Partial implementation in place (`game-state.js`, `string-generator.js`, `inventory-manager.js`, first-draft `loot-choice.js`). Supersedes and absorbs [LOOT-TEAS].
- Priority: P1 — design complete, partial implementation in place; ready for a focused implementation session.
- Type: Epic
- Effort: L | Gain: XL
- Prerequisites: none

#### Design Brief

##### Overview (Perseus meeting 2026-05-31)

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

##### UI Design: Origins-Style Picker

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

##### Critical Flow Change vs. Earlier Design

**Old plan:** On pick, call `_applyChosenItem(snap)` — a helper that manually loads stats into enemy globals and calls `playerChangeStats()`.

**New plan (correct):** On pick, call `pushEncounter(chosenRow); nextEncounter();` — the chosen raw CSV row is pushed as the next encounter and loads normally. The player then sees it as a new encounter card and interacts with it via the action buttons. This:
- Preserves all existing encounter handling (log lines, slot-conflict swap dialog, special emojis)
- Requires zero stat-application code in the choice callback
- Means the player gets a full second encounter interaction with the chosen item (Grab to equip, etc.)
- Works correctly for consumables too if they're ever added to the pool

**This means `_applyChosenItem` is NOT needed and should not be implemented.**

---

##### LootChoiceManager — Revised API

`LootChoiceManager.show(rows, context, onPick)`
- `rows` — array of 3 raw CSV row arrays (not snapshots)
- `context` — `'corpse'` | `'prop'`
- `onPick(chosenRow)` — called with the raw row; caller does `pushEncounter(chosenRow); nextEncounter();`

`LootChoiceManager.snapFromRow(row)` — converts a raw CSV row to a display snapshot. Already in loot-choice.js.

`_buildCard(row)` (internal) — builds a `menu-history-entry` div from a raw row using origins-style HTML. Reads `row[14]` for the familiar badge. Returns `{el, row, snap}`.

**The current loot-choice.js was written with the old snapshot-based API.** It needs to be rewritten with the row-based API and origins-style HTML before integration. See the "Files Still Needed" section.

---

##### `_currentRawRow` — New Global

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

##### Files Already Changed

**`js/game-state.js`**
- `var _lootChoiceContext = 'prop';` — added. Tracks corpse vs prop context for the string pool.
- `var _currentRawRow = null;` — added.

**`js/string-generator.js`**
- `getLootChoiceLog(context, tier)` — added before `getLootDropLog()`. Two contexts × three rarity tiers × 5 strings each = 30 pool strings. Already complete.

**`js/inventory-manager.js`**
- `renderItemCard: _itemRowHtml` added to public return. Harmless and useful for future callers.

**`js/loot-choice.js`** (new file, but needs rewrite)
- Currently written with the old snapshot-based API (`show(items, context, onPick)` where items = snapshots, 3 fixed card IDs). **Must be rewritten** with the row-based API and origins-style HTML before integration.

---

##### Files Still Needed

###### `js/loot-choice.js` — Full rewrite

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

###### `index.md` — 3 additions

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

**2. CSS keyframe** — add inside the existing `<style>` block:
```css
@keyframes lootCardReveal {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```
No `.loot-choice-card` class needed — cards use `menu-history-entry` which already has all hover/selected styles.

**3. Script tag** — add after `encounter-generator.js` (line 77):
```html
<script src="js/loot-choice.js"></script>
```
Must load before `action-resolver.js` (line 83). All dependencies (`RarityManager`, `string-generator.js`, `inventory-manager.js`) are already loaded by this point.

---

###### `js/encounter-loader.js` — 1 line

At the very start of `loadEncounter(index, fileLines)`, right after `var row = fileLines[index];`:
```js
_currentRawRow = row;
```

---

###### `js/action-resolver.js` — 3 additions

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

**No `_applyChosenItem` helper needed** — `pushEncounter + nextEncounter` handles everything through the normal encounter flow.

---

##### Additional Loot Choice Triggers

###### Fishing Trigger

Fishing is included. The overlay appears when the player grabs a fishing catch. The two alternate rows use `getWeightedLootIndex(playerLck, playerKarma)` to pull from `linesLoot`. The chosen row is pushed via `pushEncounter(chosenRow); nextEncounter();` — the fish still loads normally as an encounter, preserving all existing fishing item handling.

Context string: `'prop'` (environmental find, not a body).

**No changes needed to `getRandomFish()` or `game-loop.js` fishing flow.** The intercept in `action-resolver.js` already fires on any `case "Item"` Grab regardless of `isFishing`.

###### Shade Shop Trigger

When the player buys an item or artifact from the drachma shop, instead of receiving a single randomly selected item, the 3-choice overlay appears with three weighted-random shop stock options.

Implementation in `encounter-loader.js` → `drachmaeBuy()`: instead of directly calling `pushEncounter(row); nextEncounter();` for an item purchase, collect 3 candidate rows and call `LootChoiceManager.show(rows, 'prop', function(chosenRow) { pushEncounter(chosenRow); nextEncounter(); })`.

The two additional rows via `getWeightedEncounter(["Item", "Item-head", "Item-chest", "Item-weapon", "Item-legs", "Item-trinket"])`. Context string: `'prop'`.

**Note:** v2 scope — get the base loot overlay working first.

###### Friend Quest Reward Trigger

When the player successfully Speaks to a Friend who wants a specific item, the existing reward path at `action-resolver.js` line ~2920 fires:

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

Quest item removal and achievement check also run before `show()`.

Context string: `'prop'`.

---

##### Architecture Notes

- `pushEncounter` inserts at `encounterIndex + 1` — LIFO. The intercept pushes the chosen row as the next encounter; `nextEncounter()` loads it. The player gets a fresh encounter interaction.
- `_currentRawRow` survives from `loadEncounter()` to the Grab handler because no encounter transition happens between them.
- The shuffle in `show()` ensures the current-encounter item doesn't always appear first.
- If the chosen item has a slot conflict, `loadEncounter()` will show the slot-diff log on load, and the player's subsequent Grab will trigger the normal `InventoryManager.tryEquip()` swap dialog. Two interactions in sequence — expected and correct.
- `generateRandomItem()` excludes Artifacts, Lover's Memento, Piece of History, Lost Possession. Good defaults.

##### What Was NOT Changed (intentional scope)

- The swap dialog (`showSwapDialog`) - unchanged; still shows on slot conflict after chosen item loads
- `generateRandomItem()` - unchanged; used as-is for item/corpse loot alternate choices
- `getRandomFish()` / `game-loop.js` fishing flow - unchanged; the intercept fires on Grab in action-resolver, not in the fish generation path
- Consumables in choice pool - deferred; architecture supports it, not in v1 scope

##### Testing Checklist

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

## P2 — Planned *(concept clear, design session needed)*

### [SPELL-SYS] Epic: Spell System — scrolls, overlay, MGK-gated cast actions
- Replace the Curse button with a generic Spell button. Players start knowing no spells; 📜 Spell Scrolls are found as encounters. Casting costs 3 MGK; opens a scrollable spell list overlay; action bar check resolves the outcome. Crit fail applies the spell to self.
- Priority: P2 — concept is clear; full Hades Gate design session required before any implementation begins.
- Type: Epic
- Effort: XL | Gain: XL
- Prerequisites: none

#### Design Brief

##### Overview

Replace the Curse button with a generic "📓 Spell" button. Players start knowing no spells. On click with no spells known, log: "Cannot cast any spells ...yet?"

**Learning spells:** 📜 Spell Scrolls are found as encounters (add a sample row to story.csv right after the debug comment). On seeing a Scroll, the Speak button becomes "🧠 Learn" — success chance based on INT; on fail: "Could not comprehend" (no second chance). Each scroll rolls which spell it contains from the pool of currently unknown spells only.

**Casting:** Costs 3 MGK. Opens a scrollable spell list overlay on click (max height = action buttons). Selecting a spell starts an action bar check. Crit success costs -1 MGK extra. Crit fail applies the spell to self (special cases: Harden = deplete all STA; Syphon = just hurt yourself).

**Basic spells:**
- 🐸 Hex - Change enemy to harmless 1/1 frog
- 🔥 Burn - Deal 4 damage
- 🧊 Freeze - Deplete enemy stamina
- ⚡️ Surge - Restore own stamina to full
- 🪬 Curse - Lower enemy attack by 3
- 🪨 Harden - 2 physical damage protection for the rest of the fight
- 🩸 Syphon - Damage enemy for 2, then again for 2

**Scope:** XL effort. Design via Hades Gate before any implementation.

---

### [KARMA-OVR] Epic: Karma Overhaul — full run-shaping system with tiered mechanical effects
- Karma as a full run-shaping force: tiered revive intervals, speak/attack-based gain/loss, cross-run decay, mischievous variants at negative karma, perks/flaws at ±10 thresholds, bonus encounters for good karma, proactive repair actions for recovery.
- Must not ship incomplete — a half-implemented karma system is worse than the current one. Hint system required before mechanic expansions so players can see implications before actions lock them in.
- Priority: P2 — concept is clear; Hades Gate session needed; hint/transparency UI is a hard prerequisite before most mechanical expansions.
- Type: Epic
- Effort: XL | Gain: XL
- Prerequisites: karma hint/transparency UI (not yet in backlog — add before starting)

#### Design Brief

##### Design Points

- Revive interval scaled by karma level
- Speak on aggressive enemies = +1 karma; Attack on neutral/friendly = -2 karma
- Karma decays toward neutral (1) across runs
- Tiered reincarnation bonus (not flat — see [KARMA-SCALE] in TODOs for the short-term fix)
- Mischievous encounter variants when karma < 0
- Perks and flaws unlock at ±10 karma thresholds
- Good karma triggers a bonus encounter (not only on revive)
- Proactive repair actions for negative karma recovery

**Hint system required first:** Players must be able to see karma implications before actions lock them in. Hints and karma UI must ship before most mechanic expansions.

---

### [INV-XPND] Epic: Inventory Expansion — consumables array, additional equipment slots
- Major architecture expansion: consumables array (separate from the loot emoji string), head/chest/hands item slots with swap mechanic, intentional food eating only (no auto-consume on pickup), open inventory by clicking the loot/party bar.
- Priority: P2 — concept is clear; full design via Hades Gate before implementation; enables [ORIG-ITEMS] and [INV-ITEMS] as downstream features.
- Type: Epic
- Effort: XL | Gain: L
- Prerequisites: none (enables [ORIG-ITEMS], [INV-ITEMS])

#### Design Brief

##### Design Points

- Consumables array (separate from the loot emoji string)
- head/chest/hands item slots with swap mechanic (prevents fast stacking)
- Intentional food eating only — no auto-consume on pickup
- Open inventory by clicking the loot/party bar

**Connected work:** Enables [ORIG-ITEMS] (origins with starting items), [INV-ITEMS] (new items for new slots), and any future crafting or trading systems.

---

## P3 — Long-term Vision

### [PET-SLOT] Epic: Structured Pet System — named pets with personality-driven contextual barks
- Replace emoji-string pet tracking with a structured object: `{name, type, stats, personality}`. Enables named pets (Kerberos, etc.), personality-driven bark pools per type+personality pairing, per-pet stat contributions, and deep contextual reactions to enemy types, areas, traps, and boss proximity.
- Priority: P3 — compelling long-term vision; gated on [PET-ENCNTR] shipping and validating in beta first.
- Type: Epic
- Effort: XL | Gain: XL
- Prerequisites: [PET-ENCNTR] shipped and validated in beta

#### Design Brief

##### Design Points

Replace emoji-string pet tracking with a structured object: `{name, type, stats, personality}`.

Each type + personality pairing (cat+playful, dog+loyal, lizard+cold, bird+curious, etc.) gets its own bark pool with contextual reactions to enemy types, areas, traps, and boss proximity.

**Deep contextual tier:** Pet "sees" the run's story structure and generators; warns intelligently about danger types ahead, not just "boss is next."

**Named pets:** Kerberos for dogs, etc. Name maps persist between bark firings so the same pet has the same name throughout a run.

---

### [COMP-STAK] Epic: Companion Narrative Stakes — individuation, steal/kill mechanic, rescue arc
- Give companions a story arc, not just a trophy slot. Three pillars: a logged "named moment" when a companion joins (individuation); enemies that can steal or kill companions; a follow-up rescue/revenge encounter when a companion is taken.
- **Hard rule:** Do NOT implement steal/kill until individuation is in. Loss only lands after attachment is built.
- Priority: P3 — long-term vision; requires [COMP-PLAY] confirmed shipped and companions proven in beta.
- Type: Epic
- Effort: XL | Gain: XL
- Prerequisites: [COMP-PLAY] assumed shipped (not in backlog — verify); companions proven stable in beta

#### Design Brief

##### Three Pillars

**Individuation:** A logged "named moment" when a companion joins — one line that establishes who they are to the player before they can be lost.

**Steal/kill mechanic:** Enemies can target and take or kill companions. Must feel like a real loss, not a stat penalty.

**Rescue/revenge fight:** A follow-up encounter when a companion is taken — the player can pursue.

**Hard prerequisite:** Do NOT implement steal/kill until individuation is in. Loss only lands after attachment is built.

---

## P4 — Speculative / Shelved

### [PATH-CHCE] Epic: Branching Encounter Paths — pre-generated two-path crossroads choices
- At one or more crossroads per run, present two pre-generated paths forward as a genuine lock-in choice. Both paths must be pre-resolved before the choice screen appears. Companion type determines what hint is surfaced (dog barks at danger, cat paws toward loot, lone player is blind).
- Priority: P4 — blocked on multiple unshipped prerequisites; the dog's warning is what makes the crossroads matter and requires [PET-ENCNTR] to already be proven.
- Type: Epic
- Effort: L | Gain: XL
- Prerequisites: [ENC-PREGEN] stable, [PET-ENCNTR] shipped, [COMP-PLAY] confirmed shipped

#### Design Brief

##### Design Points

At one or more crossroads moments per run, present two pre-generated paths forward — a genuine lock-in choice. Both paths must be pre-resolved before the choice screen appears.

**Path shapes:** High-danger/high-reward vs. safe/low-reward. The exact design space is open; details via Hades Gate.

**Companion intel:** Companion type determines what hint is surfaced before the choice:
- 🐶 Dog barks at the dangerous branch
- 🐱 Cat paws toward the high-loot one
- Lone player: blind choice, no hint

The dog's warning (from [PET-ENCNTR]) is what makes the crossroads matter — it becomes a test of trust in your companion.

**Prerequisites:** [ENC-PREGEN] stable, [PET-ENCNTR] shipped. Full design via Hades Gate before implementation.

---

*EPICS.md — 7 epics*
