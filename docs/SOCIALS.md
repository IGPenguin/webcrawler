# Styx Flow — 2026-06-02 — Stay Dead: Beta Marketing

*18 items · updated post-Perseus review (EP + CM + Content Creator + Hardcore Fan + SO)*

---

## P0 — Quality Gate *(nothing goes live without this)*

### [PRELAUNCH-QUAL] Chore: Pre-launch playtests and leaderboard seeding
- Complete 3 full wins across different builds (attack, INT, mage) to seed valid highscores — the rankings screen is part of the first impression; an empty leaderboard reads as abandoned.
- Terka completes at least 1 full run to a win — a non-dev playtest catches onboarding assumptions you're blind to.
- H13 QA/eng playtest pass — colleague eyes on the game before public launch.
- Confirm the donation QR dialog is shipped and functional — ITCH-WRPR is blocked on this; the wrapper page will advertise a button that doesn't work.
- Priority: P0 — nothing in this document goes live until these gates pass.
- Type: Chore
- Effort: M | Gain: L

---

## P1 — Before Anything Goes Public

### [FRIENDS-MSG] Chore: Personal messages to friends — try the beta
- Direct messages (not a broadcast post) to people who'd genuinely try it — the ones who'll give you an honest sentence about where they stopped.
- This is your fastest signal and warmest possible audience. Do it the day the itch.io page is live.
- Priority: P1 — warm audience generates your first itch.io comments; cold audiences judge an empty page as abandoned.
- Type: Chore
- Effort: XS | Gain: M

### [H13-SLACK] Chore: Share in H13 team Slack
- Post in the relevant channel (spam or general) — your professional colleagues are a warm audience who'll try it out of genuine curiosity.
- Same effect as friends: seeds the itch.io page with early activity before cold traffic arrives.
- Priority: P1 — warm professional network; zero friction to reach.
- Type: Chore
- Effort: XS | Gain: M

### [ITCH-PAGE] Chore: Create itch.io store page (web UI, one-time)
- Go to https://igpenguin.itch.io/stay-dead and fill the store page — this is the public-facing link for all other outreach.
- Required fields: title, short description (tone + premise + honest beta framing), tags (roguelike, text-based, browser, dark-fantasy, single-player), price (free), enable itch.io comments as feedback channel.
- Short description angle: what kind of game it is, who it's for, why beta — no hype.
- Link to: the game (GitHub Pages), the repo, and the wiki.
- Priority: P1 — every other outreach item links here; nothing cold goes live without this.
- Type: Chore
- Effort: S | Gain: L

### [ITCH-WRPR] Chore: Replace URL placeholders and upload HTML5 wrapper to itch.io
- Blocked on: [PRELAUNCH-QUAL] — specifically the donation QR dialog being shipped and functional.
- Find the three URL placeholders in the `index.html` wrapper file and replace with live URLs (GitHub Pages game URL, repo, wiki).
- Upload as an HTML5 game on itch.io so the game can optionally be played embedded on the page.
- Verify the iframe loads the game correctly after upload.
- Verify telemetry events still fire inside the iframe (check browser console for `cheat_used`, score submit, etc.).
- Priority: P1 — wrapper must be correct before the itch.io page goes live.
- Type: Chore
- Effort: XS | Gain: M

### [ITCH-DEVLOG] Chore: Post itch.io launch devlog
- Write and post a short devlog on itch.io: "Open Beta is live — here's what I'm looking for."
- Include: what Stay Dead is, what beta means (rough edges, real stakes), specific feedback asks (first run to second, where you stopped, which ending you reached, what felt unfair vs. your fault).
- This becomes the first thing anyone reading the page sees after the description.
- Priority: P1 — sets expectations and signals an active developer; without it the page feels abandoned.
- Type: Chore
- Effort: S | Gain: M

---

## P2 — First Week (Warm Network, Then Cold)

### [LINKEDIN] Chore: LinkedIn milestone post
- Post it when it's actually true — day of or week of the birth if that's when it happens. The timing is the reason it will land; don't schedule it for "a good moment."
- The draft is raw and good. Add one sentence about the game that anyone can picture: "There are nine different ways the story ends" works for people who've never heard of a roguelike.
- Add a second CTA alongside "reshare and star my repos": "or just play it for five minutes" — more actionable for the non-dev half of your network.
- Link to itch.io, not GitHub.
- Priority: P2 — warm personal network; goes before cold subreddits.
- Type: Chore
- Effort: S | Gain: M

### [FACEBOOK] Chore: Facebook post
- Your most accessible warm audience — people who know you personally and will try it because you shipped something.
- Short post: what it is in one sentence, that it's free, link to itch.io. Personal tone, same as LinkedIn.
- Priority: P2 — warm reach you're not currently using; easy to do alongside LinkedIn.
- Type: Chore
- Effort: XS | Gain: M

### [RDDT-ROGUE] Chore: Post to r/roguelikes
- Lead with the rival invasion system — not "rival invasions" as a feature name, but what it actually does: real players from the leaderboard show up as boss encounters, carrying their actual inventory and ending type, and speak their last words when they die. No other roguelike does this. That is the opening sentence.
- Do not lead with the genre checklist (energy system, action bar, 9 endings) — those describe six other roguelikes. The rival system is the differentiator.
- Format: 2-3 sentences max, concrete feedback ask ("which ending did you reach on first attempt?"), link to itch.io.
- Avoid: hype language, "I made a game" opener, wall of text.
- Priority: P2 — highest-signal community for this genre; most likely to attract repeat players.
- Type: Chore
- Effort: S | Gain: L

### [RDDT-TEXT] Chore: Post to r/textgames
- Lead with tone and writing: the grief-as-armor premise, Rosabel, the corrupted world that didn't stop when you died.
- This audience cares about voice and atmosphere; mention the 9 endings and that each has distinct writing.
- This post should read nothing like the r/roguelikes post — different angle entirely.
- Priority: P2 — strong fit for the writing-first audience; high engagement if the voice lands.
- Type: Chore
- Effort: S | Gain: L

### [RDDT-WEB] Chore: Post to r/WebGames
- Lead with the zero-friction angle: runs in the browser, no install, mobile-optimized.
- Keep it short — this audience wants to play, not read. One hook sentence + link.
- Priority: P2 — browser-first crowd; lowest friction to try.
- Type: Chore
- Effort: XS | Gain: M

### [RDDT-INDIE] Chore: Post to r/indiegaming
- Lead with the personal story: solo dev, nights and weekends, what you learned building it. AI-assisted workflow is part of the story and worth mentioning here.
- Human angle performs better here than mechanical pitch. The dev story is the hook.
- Priority: P2 — broader audience, less genre-specific; good for reach outside hardcore roguelike crowd.
- Type: Chore
- Effort: S | Gain: M

---

## P3 — Week 2–3

### [DISCORD-JOIN] Chore: Join Discord servers and post in showcase channels
- Target servers: Roguelikes Discord (official), itch.io Discord (active dev + player), Text Adventure / Interactive Fiction servers.
- Find "share your game" or "indie-showcase" channels in each.
- Post: brief pitch, honest beta framing, specific feedback ask. Same tone as Reddit — no hype.
- Priority: P3 — high-signal audience, lower reach than Reddit; worth doing after first Reddit wave.
- Type: Chore
- Effort: S | Gain: M

### [CREATOR-OUT] Chore: Outreach to Juniperdev — first creator target
- Reach out via her Discord. The message needs to lead with the single most watchable moment in the game — the rival invasion: a real player from the leaderboard shows up as a boss, carrying their actual run's inventory, and speaks their last words when they die. That is a reaction moment. Lead with that, not with "text-based mobile roguelike."
- If no response in ~2 weeks, move to the next target (small/mid YouTuber or streamer covering browser roguelikes or text games; 5K–50K subscribers).
- One yes here is worth 10 Reddit posts.
- Priority: P3 — high ceiling but uncertain; don't block other outreach on this.
- Type: Chore
- Effort: XS | Gain: L

### [MTOOLKIT-XPRO] Chore: Mtoolkit release note + cross-promotion
- Ship a Mtoolkit changelog note and link it from the beta launch post where relevant.
- The AI-assisted dev story (Claude Code + Gemini CLI) is a separate hook for devtool and indie dev communities — a different audience from the game's players that the LinkedIn post will reach organically.
- Worth a targeted post or mention in devtool communities if Mtoolkit's audience overlaps.
- Priority: P3 — separate audience from the game's players; don't mix the pitches, but use the overlap.
- Type: Chore
- Effort: S | Gain: M

### [RDDT-DEV] Chore: Post to r/gamedev (optional)
- Angle: solo dev soft launch, AI-assisted workflow, what you shipped and how.
- Lower priority than player-facing communities; use only if you want dev-community feedback or want to lean into the AI toolchain story.
- Priority: P3 — dev audience, not player audience; worth doing alongside MTOOLKIT-XPRO if the AI story resonates.
- Type: Chore
- Effort: S | Gain: S

---

## P4 — After First Wave Arrives

### [DISCORD-OWN] Idea: Create your own Discord server
- An empty Discord before launch looks abandoned. Open one only after people are already asking questions.
- Trigger: when players start asking "is there a Discord?" in itch.io comments or Reddit threads.
- Priority: P4 — premature before first wave; a Discord that opens when people are already asking looks responsive, not desperate.
- Type: Idea
- Effort: XS | Gain: M

### [SIGNAL-REV] Chore: Signal review at week 3–4
- Pull telemetry data: second-run rate, boss_killed area distribution, which endings appear in leaderboard.
- Read itch.io and Reddit comments for: mechanics they didn't know existed, where they stopped, what felt unfair.
- Decide: widen reach further, or polish first based on what beta players actually did.
- Priority: P4 — premature to do before data exists; do this after 2–3 weeks of beta traffic.
- Type: Chore
- Effort: S | Gain: L

---

*Styx Flow complete — 18 items processed*
