// Returns { speed (units/s), successMin, successMax } derived from current global player+enemy state.
// speed is on a 0–100 scale — at speed 60 the cursor crosses the full bar in ~1.67 s.
// adjustment: optional ±integer added to zoneW before clamping (positive = easier, negative = harder).
function calcActionBarConfig(button, adjustment) {
  var pAtk = Math.max(0, playerAtk  || 0);
  var pSta = Math.max(0, playerSta  || 0);
  var pMgk = Math.max(0, playerMgk  || 0);
  var pLck = Math.max(0, playerLck  || 0);
  var pInt = Math.max(0, playerInt  || 0);

  var eAtk = Math.max(0, (enemyAtk || 0) + (enemyAtkBonus || 0));
  var eSta = Math.max(0, (enemySta || 0) - (enemyStaLost || 0));
  var eMgk = Math.max(0, (enemyMgk || 0) - (enemyMgkLost || 0));
  var eInt = enemyInt || 0;
  var eDef = Math.max(0, enemyDef  || 0);
  var types = String(enemyType || '');

  var isHeavy     = types.includes('Heavy');
  var isSwift     = types.includes('Swift');
  var isSpirit    = types.includes('Spirit');
  var isUndead    = types.includes('Undead');
  var isTough     = types.includes('Tough');
  var isSmall     = types.includes('Small');
  var isBoss      = types.includes('Boss');
  var isHot       = types.includes('Hot');
  var isToxic     = types.includes('Toxic');
  var isGrabbable = /Container|^Item$|Consumable|^Prop$/.test(types);
  var isTrap      = types.includes('Trap');
  var isAltar     = types.includes('Altar');
  var isCurse     = types === 'Curse';

  // Cursor speed presets
  var ACTION_BAR_SPEED_MULT = 1.3 * GAME_CONFIG.speedMult; // Base 1.3; difficulty multiplier applied on top (>1 = harder).
  var spdUnreal = 150;
  var spdInsane = 120;
  var spdHard = 90;
  var spdNormal = 60;
  var spdEasy = 30;

  // ── Ending state ─────────────────────────────────────────────────────────
  if (isEndingState) {
    if (document.getElementById(button) && document.getElementById(button).disabled) {
      return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
    }
    var _isDark = button === 'button_attack' || button === 'button_roll' || button === 'button_curse';
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100,
             barStyle: _isDark ? 'dark' : undefined };
  }

  // ── Special cases ────────────────────────────────────────────────────────

  // Upgrade encounter — all actions always succeed
  if (types === 'Upgrade') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Sleep when already rested — impossible (bar all-red)
  if (button === 'button_sleep' && playerRested && types !== "Death") {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Sleep at fishing spot after already having rested this visit — impossible
  if (button === 'button_sleep' && fishingRested && types === 'Fishing' && types !== "Death") {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Cast / Heal / Curse with no mana — impossible (bar all-red)
  // button_pray is exempt on Curse type (action-resolver allows it without MGK)
  if ((button === 'button_cast' || (button === 'button_pray' && !isCurse) || button === 'button_curse') && pMgk <= 0) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Sleep vs harmless creature (no ATK) — always succeeds, crit gives bonus STA
  if (button === 'button_sleep' && /Standard|Swift|Heavy|Pet|Spirit|Demon|Undead|Boss|Small|Stingy|Toxic|Hot|Tough|Reflective|Recruit|Friend/.test(types) && eAtk <= 0) {
    var _csW = Math.min(8, Math.max(2, Math.round(2 + pLck * 0.8)));
    var _csMin = 50 - Math.floor(_csW / 2);
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100,
             critSuccessMin: _csMin, critSuccessMax: _csMin + _csW };
  }

  // Speak / Block / Roll at an obstacle — impossible, it's a wall
  if ((button === 'button_speak' || button === 'button_block' || button === 'button_roll' ) && types === 'Trap-Obstacle') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Attack obstacle with no stamina — same difficulty as attacking an enemy exhausted
  if (button === 'button_attack' && types === 'Trap-Obstacle' && pSta === 0) {
    return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
  }

  // Attack obstacle with stamina — real skill check with crits
  if (button === 'button_attack' && types === 'Trap-Obstacle') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 30, successMax: 70,
             critSuccessMin: 48, critSuccessMax: 52, critFailW: 10 };
  }

  // Grab obstacle — same difficulty as attacking it
  if (button === 'button_grab' && types === 'Trap-Obstacle') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 30, successMax: 70,
             critSuccessMin: 48, critSuccessMax: 52, critFailW: 10 };
  }

  // Exhausted grab: near-impossible without stamina (items/containers/fishing/dream unaffected)
  if (button === 'button_grab' && pSta === 0 && !isGrabbable && types !== 'Fishing' && types !== "Death" && !types.includes('Dream')) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 46, successMax: 54,
             critSuccessMin: 49, critSuccessMax: 51 };
  }

  // Resurrection: gold-only strip — hit it or die permanently; impossible on Hardcore
  if (button === 'button_attack' && types.includes('Death')) {
    if (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.label === 'Hardcore') {
      return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
    }
    return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT), successMin: 48, successMax: 52,
             critSuccessMin: 48, critSuccessMax: 52, critFailW: 5 };
  }

   // Review on death: slow & green
  if (button === 'button_block' && types.includes('Death')) {
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

   // Give up|inactive "-" on death: slow & red
  if ((button === 'button_attack' || button === 'button_roll' || button === 'button_grab' || button === 'button_sleep' || button === 'button_speak') && types.includes('Death')) {
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Friend walk — always free to leave
  if (button === 'button_roll' && types === 'Friend') {
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Trap-Roll walk — insanely hard to avoid triggering
  if (button === 'button_roll' && types === 'Trap-Roll') {
    return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
  }

  // Trap-Big walk — moderately hard, no crits
  if (button === 'button_roll' && types === 'Trap-Big') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 36, successMax: 64 };
  }

  // Prop / encounterUsed / Fishing walk: very wide zone — tiny stumble risk exists
  if (button === 'button_roll' && ( types === 'Prop' || types === 'Fishing' || encounterUsed)) {
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 5, successMax: 95 };
  }

  // Dream: only sleep and walk are meaningful — all other actions are impossible
  if (types.includes('Dream') && button !== 'button_sleep' && button !== 'button_roll') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Dream walk with no stamina — impossible
  if (types.includes('Dream') && button === 'button_roll' && pSta === 0) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Dream sleep/walk: normal speed, full success, no crits
  if (types.includes('Dream') && (button === 'button_sleep' || button === 'button_roll')) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Dead / sleeping enemy — not moving, guaranteed hit or block
  if (corpseState !== "" && (button === 'button_attack' || button === 'button_block')) {
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Attack / Block at zero player stamina — hard as fishing with no bait
  if (pSta === 0 && enemyType!="Item" && enemyType!="Shop" && (button === 'button_attack' || button === 'button_block')) {
    return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
  }

  // Roll against exhausted enemy — very easy, but humiliating to fail
  if (button === 'button_roll' && (enemySta - enemyStaLost) <= 0 && enemyType!="Item" && enemyType!="Shop") {
    var _ka = (playerKarma || 1) - 1;
    var _csW = Math.min(7, Math.max(1, Math.round((2 + pLck * 0.6 + _ka * 0.4) * 1.25)));
    var _csMin = 50 - Math.floor(_csW / 2);
    var _cfW = Math.min(10, Math.max(1, Math.round(5 - pLck * 0.5 - _ka * 0.5)));
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 10, successMax: 90,
             critSuccessMin: _csMin, critSuccessMax: _csMin + _csW, critFailW: _cfW };
  }

  // Heavy grab: very very hard — tiny zone, high speed; fail enrages them
  if (button === 'button_grab' && isHeavy) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 46, successMax: 54,
             critSuccessMin: 49, critSuccessMax: 51 };
  }

  // Reflective: spells and curses always reflect — impossible to land
  if ((button === 'button_cast' || button === 'button_curse') && types === 'Reflective') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Curse submit / walk when unresolved - will hurt
   if ((button === 'button_sleep' || button === 'button_roll') && ( types === 'Curse' && !encounterUsed)) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Curse 100% safe if already resolved
  if (button === "button_pray" && encounterUsed) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Curse endure: zone scales with the player stat being affected by the curse
  if ((button === 'button_roll' || button === "button_pray") && types === 'Curse') {
    var resistScore = 0;
    if ((enemyHp  || 0) < 0) resistScore = Math.max(resistScore, Math.max(0, playerHpMax || 0));
    if ((enemySta || 0) < 0) resistScore = Math.max(resistScore, pSta);
    if ((enemyAtk || 0) < 0) resistScore = Math.max(resistScore, pAtk);
    if ((enemyLck || 0) < 0) resistScore = Math.max(resistScore, pLck);
    if ((enemyInt || 0) < 0) resistScore = Math.max(resistScore, pInt);
    if ((enemyMgk || 0) < 0) resistScore = Math.max(resistScore, pMgk);

    // TODO make curse stats affect chance success
    var curseW = Math.max(15, Math.min(70, 20 + resistScore * 10));

    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: Math.max(5, 50 - Math.round(curseW/2)), successMax: Math.min(95, 50 + Math.round(curseW/2)) };
  }

  // Tutorial safeguard: Dream Shrimp must always be consumable — eat is full green, ditch is all red
  if (enemyName === 'Dream Shrimp') {
    if (button === 'button_grab') return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
    if (button === 'button_roll') return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Small grab: zone shrinks proportionally with creature's remaining stamina
  if (button === 'button_grab' && types === 'Small') {
    var eStaSmall = Math.max(0, (enemySta || 0) - (enemyStaLost || 0));
    var smallBase = Math.max(20, Math.min(80, Math.round(50 + pSta * 6)));
    var smallW = Math.max(8, Math.round(smallBase / (eStaSmall + 1)));
    var smallMid = 50;
    var sMin = Math.max(3, smallMid - Math.round(smallW / 2));
    var sMax = Math.min(97, smallMid + Math.round(smallW / 2));
    if (eStaSmall > 0) {
      var csW = Math.max(1, Math.min(4, Math.round(1 + pLck * 0.4)));
      var csMin = Math.max(sMin + 1, smallMid - Math.floor(csW / 2));
      var csMax = Math.min(sMax - 1, csMin + csW);
      if (csMax - csMin < 1) { csMin = -1; csMax = -1; }
      return { speed: Math.round(spdHard * ACTION_BAR_SPEED_MULT), successMin: sMin, successMax: sMax, critSuccessMin: csMin, critSuccessMax: csMax };
    }
    return { speed: Math.round(spdHard * ACTION_BAR_SPEED_MULT), successMin: sMin, successMax: sMax };
  }

  // Container search: luck scales zone width — bad luck = high chance of finding nothing
  if (button === 'button_grab' && types.includes('Container') && !types.includes('Locked')) {
    var searchW = Math.max(25, Math.min(82, Math.round(40 + pLck * 9)));
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: Math.max(4, 50 - Math.round(searchW/2)), successMax: Math.min(96, 50 + Math.round(searchW/2)) };
  }

  // Shop: Gamble (button_block) = gold-only strip, same difficulty as reincarnate; all other shop actions = full success zone
  if (types === 'Shop') {
    var availableCoins = (savedCoins || 0) - (spentCoins || 0);
    var shopPrices = { button_attack: 1, button_grab: 1, button_block: 1, button_sleep: 2, button_speak: 3 };
    var price = shopPrices[button] || 0;
    if (price > 0 && availableCoins < price) {
      return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
    }
    if (button === 'button_block') return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT), successMin: 48, successMax: 52,
                                            critSuccessMin: 48, critSuccessMax: 52, critFailW: 5 };
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Fishing: 0 STA = impossible; no bait = near-impossible; bait quality shifts zone width
  if (button === 'button_grab' && types === 'Fishing') {
    if (pSta === 0) {
      return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
    }
    var fishBait = checkPlayerHasItem(validBaits);
    if (fishBait === "") {
      return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
    }
    var fishBQ = baitQuality[fishBait] !== undefined ? baitQuality[fishBait] : 1;
    var fishMin = Math.max(3, 35 - fishBQ * 4);
    var fishMax = Math.min(90, 57 + fishBQ * 4);
    var fishCritSuccessW = Math.max(1, Math.round((3 + pLck * 0.5) * 0.5));
    var fishCritFailW = 6;
    var fishCenter = Math.round((fishMin + fishMax) / 2);
    var fishCsMin = Math.max(fishMin + 1, fishCenter - Math.floor(fishCritSuccessW / 2));
    var fishCsMax = Math.min(fishMax - 1, fishCsMin + fishCritSuccessW);
    if (fishCsMax - fishCsMin < 2) { fishCsMin = -1; fishCsMax = -1; }
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: fishMin, successMax: fishMax,
             critSuccessMin: fishCsMin, critSuccessMax: fishCsMax, critFailW: fishCritFailW };
  }

  // Trap-Big attack/cast — physically cannot be hit or burned
  if ((button === 'button_attack' || button === 'button_cast') && types === 'Trap-Big') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Attack Item/Consumable — wide zone (smash to destroy)
  if (button === 'button_attack' && (types === 'Item' || types === 'Consumable' || types === 'Consumable-Container')) {
    var _itemW = Math.max(35, Math.min(75, Math.round(50 + pAtk * 4)));
    var _itemMid = 50;
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT),
             successMin: Math.max(4, _itemMid - Math.floor(_itemW/2)),
             successMax: Math.min(96, _itemMid + Math.floor(_itemW/2)),
             critSuccessMin: -1, critSuccessMax: -1, critFailW: 0 };
  }

  // Attack Container (unlocked) — wide zone (smashes it open)
  if (button === 'button_attack' && types.includes('Container') && !types.includes('Locked')) {
    var _ctnW = Math.max(35, Math.min(75, Math.round(50 + pAtk * 4)));
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT),
             successMin: Math.max(4, 50 - Math.floor(_ctnW/2)),
             successMax: Math.min(96, 50 + Math.floor(_ctnW/2)),
             critSuccessMin: -1, critSuccessMax: -1, critFailW: 0 };
  }

  // Friend grab — they don't resist a touch
  if (button === 'button_grab' && types === 'Friend') {
    return { speed: Math.round(spdEasy * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Grab Spirit — physically impossible, untouchable by definition
  if (button === 'button_grab' && isSpirit) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Grab Stingy / Toxic / Undead — impossible (they bite back, you know it)
  if (button === 'button_grab' && (types.includes('Stingy') || types.includes('Toxic') || types.includes('Undead'))) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Curse only works on living creatures, Friends, Altars, and Fishing (special)
  // Everything else fizzles immediately
  if (button === 'button_curse'
      && !/Standard|Swift|Heavy|Pet|Spirit|Demon|Undead|Boss|Small|Stingy|Toxic|Hot|Tough|Reflective|Recruit|Friend/.test(types)
      && types !== 'Altar' && types !== 'Fishing' && types !== 'Upgrade') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Trap wrong-action: small zone — risk of triggering it, but no penalty if passed
  // "Right" actions (Trap-Attack→attack, Trap-Roll→roll, Trap-Sleep→sleep, Trap-Obstacle→attack)
  // get normal calc; every other button on that trap type is penalised here.
  if (isTrap && types !== 'Trap' && types !== 'Trap-Big') {
    var _trapRight = (types === 'Trap-Attack'   && button === 'button_attack')
                  || (types === 'Trap-Roll'     && button === 'button_roll')
                  || (types === 'Trap-Sleep'    && button === 'button_sleep')
                  || (types === 'Trap-Obstacle' && button === 'button_attack');
    if (!_trapRight) {
      return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 44, successMax: 56,
               critSuccessMin: 49, critSuccessMax: 52, critFailW: 5 };
    }
  }

  // Grab Prop — always succeeds, no skill required
  if (button === 'button_grab' && types === 'Prop') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Caress (grab Memory) — always succeeds
  if (button === 'button_grab' && types === 'Memory') {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Recall (speak Memory) — graceful pass zone, fishing-no-bait-width crit zone for skip
  if (button === 'button_speak' && types === 'Memory') {
    return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT),
             successMin: 15, successMax: 85,
             critSuccessMin: 47, critSuccessMax: 53 };
  }

  // Friend speak — difficulty based on INT differential
  if (button === 'button_speak' && types === 'Friend') {
    var _fInt = Math.max(0, enemyInt || 0);
    var _diff = _fInt - pInt;
    var friendW;
    var friendSpeed;
    if (_diff > 2) {
      // Friend much smarter — fishing-no-bait level
      friendW = 6; friendSpeed = spdUnreal;
    } else if (_diff > 0) {
      friendW = Math.max(15, Math.round(25 - _diff * 5));
      friendSpeed = spdHard;
    } else if (_diff === 0) {
      friendW = 40; friendSpeed = spdNormal;
    } else {
      // Player smarter — scales easier
      friendW = Math.min(80, Math.round(45 + (-_diff) * 8));
      friendSpeed = spdNormal;
    }
    var _fMid = 50;
    var _fSMin = Math.max(3, _fMid - Math.floor(friendW / 2));
    var _fSMax = Math.min(97, _fMid + Math.floor(friendW / 2));
    var _fcSW = Math.max(2, Math.round(2 + pLck * 0.5));
    var _fcSMin = Math.max(_fSMin + 1, _fMid - Math.floor(_fcSW / 2));
    var _fcSMax = Math.min(_fSMax - 1, _fcSMin + _fcSW);
    if (_fcSMax - _fcSMin < 2) { _fcSMin = -1; _fcSMax = -1; }
    var _fcFW = _diff > 2 ? 8 : Math.max(3, Math.round(5 - pLck * 0.4));
    return { speed: Math.round(friendSpeed * ACTION_BAR_SPEED_MULT),
             successMin: _fSMin, successMax: _fSMax,
             critSuccessMin: _fcSMin, critSuccessMax: _fcSMax, critFailW: _fcFW };
  }

  // Prop speak now falls through to the standard stat-based speak calculation

  // Block Spirit — impossible, spectral attacks pass through any physical guard
  if (button === 'button_block' && isSpirit) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Block Hot/Toxic — very hard but possible; success deflects instead of absorbing
  if (button === 'button_block' && (isHot || isToxic)) {
    return { speed: Math.round(spdHard * ACTION_BAR_SPEED_MULT), successMin: 40, successMax: 60 };
  }

  // Block Heavy with stamina remaining — near-impossible, crashes through any guard
  if (button === 'button_block' && isHeavy && eSta > 0) {
    return { speed: Math.round(spdUnreal * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
  }

  // Tease (block on passive mob with stamina remaining) — hard, creature resists provocation
  if (button === 'button_block' && eAtk === 0 && eSta > 0 && !isGrabbable && !isTrap && !isAltar) {
    return { speed: Math.round(spdHard * ACTION_BAR_SPEED_MULT), successMin: 42, successMax: 58 };
  }

  // Pet minion (grab on exhausted Pet) — hard, they won't hold still
  if (button === 'button_grab' && types.includes('Pet') && eSta <= 0) {
    return { speed: Math.round(spdHard * ACTION_BAR_SPEED_MULT), successMin: 42, successMax: 58 };
  }

  // Attack Spirit — physically impossible, no contact can be made
  if (button === 'button_attack' && isSpirit) {
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Attack Swift with stamina remaining — near-impossible, they dodge
  if (button === 'button_attack' && isSwift && eSta > 0) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
  }

  // Roll Heavy with stamina remaining — slow and telegraphed, easy to sidestep
  if (button === 'button_roll' && isHeavy && eSta > 0) {
    var _ka = (playerKarma || 1) - 1;
    var _csW = Math.min(7, Math.max(1, Math.round((2 + pLck * 0.6 + _ka * 0.4) * 1.25)));
    var _csMin = 50 - Math.floor(_csW / 2);
    var _cfW = Math.min(10, Math.max(1, Math.round(5 - pLck * 0.5 - _ka * 0.5)));
    return { speed: Math.round(spdNormal * ACTION_BAR_SPEED_MULT), successMin: 18, successMax: 82,
             critSuccessMin: _csMin, critSuccessMax: _csMin + _csW, critFailW: _cfW };
  }

  // Knockout on a not tired living creature — resists hard
  // Uses base enemyAtk (not eAtk) to ignore anger bonuses from prior actions this encounter.
  // Grab Swift with stamina — absurdly hard, 2-wide zone
  if (button === 'button_grab' && isSwift && eSta > 0) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 49, successMax: 51 };
  }

  // Boss grab with stamina remaining — very hard, same as Heavy
  if (button === 'button_grab' && isBoss && eSta > 0) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 46, successMax: 54 };
  }

  var _isCreatureMob = /Standard|Swift|Heavy|Pet|Spirit|Demon|Undead|Boss|Small|Stingy|Toxic|Hot|Tough|Reflective|Recruit|Friend/.test(types);
  if (button === 'button_grab' && _isCreatureMob && eSta > 0) {
    var grabW = Math.max(4, Math.min(30, Math.round((18 + pAtk * 3) / eSta)));
    var grabMin = Math.max(3, 50 - Math.round(grabW / 2));
    var grabMax = Math.min(97, 50 + Math.round(grabW / 2));
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: grabMin, successMax: grabMax };
  }

  var pStat, eStat, baseW, baseSpeed;

  switch (button) {
    case 'button_attack':
      pStat     = pAtk;
      eStat     = (isTough ? eDef * 3 : 0)
                + eSta * 0.4;
      baseW     = isTrap ? 65 : 40;
      baseSpeed = spdNormal;
      break;

    case 'button_roll':
      pStat     = pSta;
      eStat     = (isSwift ? eSta * 2 : 0) + eAtk * 0.5;
      baseW     = 38;
      baseSpeed = spdNormal;
      break;

    case 'button_block':
      pStat     = pAtk;
      eStat     = (isHeavy  ? eSta * 2.5 : eSta)
                + (isUndead ? 4           : 0)
                + eAtk * 0.4;
      baseW     = 42;
      baseSpeed = spdNormal;
      break;

    case 'button_grab':
      pStat     = pAtk;
      eStat     = (isSmall  ? eSta * 3 : eSta * 2)   // unspent enemy STA scales grab difficulty
                + (isUndead ? 6        : 0);
      baseW     = isGrabbable ? 78 : 35;
      baseSpeed = isGrabbable ? spdNormal : spdHard;
      break;

    case 'button_sleep':
      pStat     = pSta;
      eStat     = eAtk * 0.25;
      baseW     = 62;
      baseSpeed = spdNormal;
      break;

    case 'button_speak':
      pStat     = pInt;
      eStat     = (isSpirit ? Math.max(0, eInt) * 2 : Math.max(0, eInt));
      baseW     = isAltar || isCurse ? 52 : 42;
      baseSpeed = spdNormal;
      break;

    case 'button_cast':
      pStat     = pMgk;
      eStat     = eMgk * 0.8;
      baseW     = 40;
      baseSpeed = spdNormal;
      break;

    case 'button_pray':
      pStat     = pLck;
      eStat     = Math.max(0, eInt) * 0.4;
      baseW     = isAltar ? 62 : 48;
      baseSpeed = spdNormal;
      break;

    case 'button_curse':
      pStat     = pMgk + pLck * 0.5;
      eStat     = eMgk + Math.max(0, eInt) * 0.35;
      baseW     = 38;
      baseSpeed = spdNormal;
      break;

    default:
      pStat = 1; eStat = 0; baseW = 50; baseSpeed = 42;
  }

  if (isBoss) eStat += 5;

  var zoneW = Math.round(baseW + pStat * 6 - eStat * 4 + (adjustment || 0));

  // Base 0.75 zone width; multiplied by difficulty zoneMult (0.8 = 20% narrower, 1.2 = 20% wider)
  zoneW = Math.round(zoneW * 0.75 * GAME_CONFIG.zoneMult);
  zoneW = Math.max(12, Math.min(72, zoneW));

  // Default speed multiplier * 5, scaled by ACTION_BAR_SPEED_MULT
  var speed = Math.round((baseSpeed + pStat * 20) * ACTION_BAR_SPEED_MULT);
  speed = Math.max(spdEasy, Math.min(spdUnreal, speed));

  // Zone position: random, luck blends toward an easier left-centre placement
  var maxStart   = 100 - zoneW;
  var rawStart   = Math.random() * maxStart;
  var luckTarget = 15 + Math.random() * 30;
  var luckBlend  = Math.min(0.8, pLck * 0.12);
  var zoneStart  = Math.round(rawStart * (1 - luckBlend) + luckTarget * luckBlend);
  zoneStart = Math.max(4, Math.min(maxStart - 4, zoneStart));

  // Crit zones — disabled when action requires stamina but player has none, or for item/consumable pickup/ditch
  var _requiresSta = (button === 'button_attack' || button === 'button_roll' || button === 'button_block');
  var _noCrits = (_requiresSta && pSta === 0)
              || ((types === 'Item' || types === 'Consumable') && (button === 'button_grab' || button === 'button_roll'))
              || (button === 'button_grab' && types.includes('Locked'));

  if (_noCrits) {
    return { speed: speed, successMin: zoneStart, successMax: zoneStart + zoneW };
  }

  // Crit zone widths: more luck/positive karma → wider success zone, narrower fail zone
  var karmaAdj = (playerKarma || 1) - 1;
  var critSuccessW = Math.min(7, Math.max(1, Math.round((2 + pLck * 0.6 + karmaAdj * 0.4) * 1.25))); // 1.25 is the crit zone multiplier
  var critFailW    = Math.min(10, Math.max(1, Math.round(5 - pLck * 0.5 - karmaAdj * 0.5)));

  // Ensure success zone doesn't overlap crit-fail edges — action-bar.js disables crits if it does
  zoneStart = Math.max(critFailW + 1, Math.min(100 - zoneW - critFailW - 1, zoneStart));

  // Crit success: centered inside the success zone
  var csCenter = zoneStart + Math.round(zoneW / 2);
  var csMin = Math.max(zoneStart + 1, csCenter - Math.floor(critSuccessW / 2));
  var csMax = Math.min(zoneStart + zoneW - 1, csMin + critSuccessW);
  if (csMax - csMin < 2) { csMin = -1; csMax = -1; }

  return { speed: speed, successMin: zoneStart, successMax: zoneStart + zoneW,
           critSuccessMin: csMin, critSuccessMax: csMax, critFailW: critFailW };
}
