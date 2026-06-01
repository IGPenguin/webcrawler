---
name: text-pass
description: Run a writing/voice polish pass on any player-facing log message pool in Stay Dead. Gathers text from string-generator.js (and optionally scans for any remaining inline strings in logic files), then routes through Perseus Blade for expert review. All text must live in string-generator.js as named chooseFrom() functions — never inline in action-resolver.js, player-skills.js, or enemy-skills.js.
---

# Stay Dead — Text Pass Skill

A structured workflow for polishing player-facing log messages. Covers gathering, reviewing, and applying changes while keeping all text centralised in `string-generator.js`.

---

## When to use

- A pool of messages feels tonally off or generic
- You want to add variation (2–3 options) to a single-string message
- You discover inline strings in a logic file that should be in `string-generator.js`
- After adding a new game system — new text pools need a voice pass before ship

---

## Step 1 — Gather the target text

Identify what to review. Options:

**A. Named function(s) in string-generator.js**
Read the specific functions the user names. Example: `getRecallPassText`, `getWalkCritText`, all `getSleep*` functions.

**B. A topic area (e.g. "combat feedback", "sleep messages", "loot drops")**
Grep for relevant function names and inline strings:
```bash
grep -n "logPlayerAction\|logAction" js/action-resolver.js js/player-skills.js js/enemy-skills.js | grep -v "get[A-Z]" | head -60
```
This surfaces any remaining inline string literals in logic files — they're candidates for extraction.

**C. Full audit**
Read all functions in `string-generator.js` that return `chooseFrom([...])`.

---

## Step 2 — Check the architecture rule

Before reviewing content, verify that any identified inline strings in logic files are flagged for extraction. The rule (from CLAUDE.md):

> All player-facing log message text must live in `string-generator.js` as named functions returning `chooseFrom([...])` pools. Never write inline strings directly in `action-resolver.js`, `player-skills.js`, or `enemy-skills.js`.

If inline strings are found: extract them to named functions first, update call sites, then proceed to the voice pass.

---

## Step 3 — Route through Perseus Blade

Call `/perseus` with the gathered text. The standard strike team for this project is:

- **Narrative Writer** — voice consistency, tone violations, lines that break the world
- **Game Design Lead** — mechanical signal clarity (does the player understand what happened?)
- **Hardcore Fan** — whether lines serve Stay Dead's specific grief-soaked identity

Brief Perseus with:
1. The pool names and all current entries
2. The game's tone: *Diablo 2-era dark fantasy, terse, second-person "you", grief-wearing-armor. Never quippy, never modern idiom, never generic.*
3. What to look for: their/your pronoun errors, tone register mismatches, generic lines that could appear in any game, typos/grammar
4. Instruction: *suggest specific rewrites for the weakest entries, keep old entries unless they actively break the voice*

---

## Step 4 — Apply changes

For each suggestion from Perseus:

1. **Typos / grammar** — fix directly, no approval needed
2. **New pool entries** — add to the existing `chooseFrom([...])`, keep old entries unless they're genuinely broken
3. **Replacements for wrong-valence lines** — (e.g. a "crit success" message that reads like a fail) — replace the specific entry
4. **Tone register violations** — replace the offending line, suggest a world-appropriate alternative

Never delete an entire pool and rebuild from scratch unless the user explicitly asks.

---

## Step 5 — Extract any new single-string messages

If the work surfaces new call sites in logic files that use raw string literals:

1. Add a named function to `string-generator.js` with `chooseFrom([...])` — even single-variant pools, so variations can be added later without touching logic
2. Update the call site to call the function
3. Name the function clearly: `getSleepFullLog`, `getRestCritLog`, `getSpeakDefaultLog`, etc. — verb + context + "Log" suffix

---

## Naming conventions for new functions

| Context | Example name |
|---|---|
| Out-of-combat full sleep recovery | `getSleepFullLog()` |
| Already rested, sleep wasted | `getSleepWastedLog()` |
| In-combat Rest crit (+1 sta) | `getRestCritLog()` |
| Default Speak with no effect | `getSpeakDefaultLog()` |
| Reincarnation on revival | `getReincarnateLog()` |
| Stamina full, rest wasted | `getStaminaWastedLog()` |

General pattern: `get[Context][Outcome]Log()` — always returns `chooseFrom([...])`.

---

## Voice reference (quick)

Before writing or reviewing any line, check against DESIGN.md. Key rules:

- Second-person "you" throughout — never "they" or "their" referring to the player
- Terse. One sentence. No conjunctions unless the line earns them.
- No modern idioms: not "breaking a sweat", "a spring in your step", "groggy", "in a good mood"
- Not a tooltip: "You successfully attacked" is wrong. "The blow landed harder than you expected" is right.
- If the line could appear unchanged in any other game, it is not good enough.
- The world is corrupted, not whimsical. Lightness is allowed but must stay inside the world's voice.

Strong examples to calibrate against:
- "The grief. Still there. Still yours."
- "Her name almost came out. Almost."
- "Something forgotten is remembering you."
- "She slips away with your every sleep."
