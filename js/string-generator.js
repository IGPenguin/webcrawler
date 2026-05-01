function _getCurrentNameEmoji() {
  if (playerEmoji) return playerEmoji;
  var lootEmojis = ['👺','🐴','🐷'];
  for (var i = 0; i < lootEmojis.length; i++) {
    if (playerName.startsWith(lootEmojis[i] + ' ')) return lootEmojis[i];
  }
  return '';
}

function renameCharacter(){
  var currentEmoji = _getCurrentNameEmoji();
  var displayName = playerName;
  if (currentEmoji && displayName.startsWith(currentEmoji + ' ')) {
    displayName = displayName.slice(currentEmoji.length + 1);
  }
  var newPlayerName = prompt("Rename your character: ", displayName);
  if (newPlayerName === "") {
    newPlayerName = "Nameless";
  } else if (!newPlayerName) {
    return playerName; // cancelled
  }
  playerName = newPlayerName;
  redraw();
  return playerName;
}

//String generators
function getFirstName(){
  return "Damned Soul";
}

function getOriginName(origin) {
  // Prestige name pools for Familiar (relentless / won't stay dead) and Legendary (mythic / ancient / heroic).
  // These tiers get exclusive vocabulary unavailable to lower tiers.
  var _achievId = (origin.achiev || '').trim();
  var _isFamiliar = !!(_achievId && _achievId !== 'none');
  var _net = (origin.atk||0)*3   + (origin.mgk||0)*2
           + (origin.hp||0)*1.5  + (origin.sta||0)*1.5
           + (origin.lck||0)*0.5 + (origin.int||0)*0.5
           + (origin.def||0);
  var _tier = _isFamiliar ? 'Familiar' : RarityManager.getTierForNet(_net);

  if (_tier === 'Familiar' || _tier === 'Legendary') {
    var _s = { atk: origin.atk||0, hp: origin.hp||0, sta: origin.sta||0,
               lck: origin.lck||0, int: origin.int||0, mgk: origin.mgk||0 };
    var _dom = null, _domMax = 0;
    for (var _k in _s) { if (_s[_k] > _domMax) { _domMax = _s[_k]; _dom = _k; } }

    var adj, noun;
    if (_tier === 'Familiar') {
      switch (_dom) {
        case 'atk': adj  = chooseFrom(["Relentless","Unyielding","Tenacious","Dogged","Undeterred"]);
                    noun = chooseFrom(["Brawler","Stalwart","Slugger","Combatant","Scrapper"]); break;
        case 'hp':  adj  = chooseFrom(["Enduring","Indomitable","Resolute","Persevering","Stubborn"]);
                    noun = chooseFrom(["Cornerstone","Rampart","Bedrock","Foundation","Holdout"]); break;
        case 'mgk': adj  = chooseFrom(["Devoted","Persistent","Faithful","Tireless","Stubborn"]);
                    noun = chooseFrom(["Disciple","Zealot","Practitioner","Devotee","Adherent"]); break;
        case 'sta': adj  = chooseFrom(["Ceaseless","Unyielding","Persistent","Unwavering","Undeterred"]);
                    noun = chooseFrom(["Roamer","Strider","Trudger","Rover","Plodder"]); break;
        case 'lck': adj  = chooseFrom(["Stubborn","Undying","Tenacious","Dogged","Unkillable"]);
                    noun = chooseFrom(["Chancer","Revenant","Scrapper","Holdout","Contender"]); break;
        case 'int': adj  = chooseFrom(["Patient","Weathered","Dogged","Tenacious","Undeterred"]);
                    noun = chooseFrom(["Keeper","Witness","Watcher","Inquirer","Chronicler"]); break;
        default:    adj  = chooseFrom(["Stubborn","Relentless","Dogged","Undying","Unkillable"]);
                    noun = chooseFrom(["Revenant","Holdout","Contender","Scrapper","Remnant"]); break;
      }
    } else {
      switch (_dom) {
        case 'atk': adj  = chooseFrom(["Undying","Glorious","Immortal","Unconquered","Eternal"]);
                    noun = chooseFrom(["Conqueror","Champion","Destroyer","Warlord","Scourge"]); break;
        case 'hp':  adj  = chooseFrom(["Ancient","Immovable","Deathless","Eternal","Undying"]);
                    noun = chooseFrom(["Colossus","Titan","Monolith","Bastion","Sentinel"]); break;
        case 'mgk': adj  = chooseFrom(["Ancient","Exalted","Ascendant","Sacred","Archaic"]);
                    noun = chooseFrom(["Archon","Oracle","Hierophant","Archmage","Sorcerer"]); break;
        case 'sta': adj  = chooseFrom(["Eternal","Undying","Ancient","Deathless","Immortal"]);
                    noun = chooseFrom(["Shade","Revenant","Phantom","Specter","Apparition"]); break;
        case 'lck': adj  = chooseFrom(["Blessed","Divine","Exalted","Anointed","Sacred"]);
                    noun = chooseFrom(["Prophet","Herald","Seer","Avatar","Vessel"]); break;
        case 'int': adj  = chooseFrom(["Ancient","Eternal","Exalted","Undying","Omniscient"]);
                    noun = chooseFrom(["Oracle","Augur","Loremaster","Sibyl","Visionary"]); break;
        default:    adj  = chooseFrom(["Ancient","Eternal","Immortal","Undying","Exalted"]);
                    noun = chooseFrom(["Legend","Titan","Champion","Archon","Hero"]); break;
      }
    }
    return adj + ' ' + noun;
  }

  var stats = {
    atk: origin.atk || 0,
    hp:  origin.hp  || 0,
    sta: origin.sta || 0,
    lck: origin.lck || 0,
    int: origin.int || 0,
    mgk: origin.mgk || 0
  };

  var dominant = null;
  var max = 0;
  for (var s in stats) {
    if (stats[s] > max) { max = stats[s]; dominant = s; }
  }

  if (!dominant) {
    var minVal = 0;
    var weakest = null;
    for (var s in stats) {
      if (stats[s] < minVal) { minVal = stats[s]; weakest = s; }
    }

    var adj, noun;
    if (!weakest) {
      adj  = chooseFrom(["Forgotten","Weary","Nameless","Pale","Worn","Tired","Grey","Plain","Quiet","Lost","Faded","Hollow"]);
      noun = chooseFrom(["Nobody","Commoner","Stranger","Remnant","Shade","Vagrant","Stray","Outcast","Wretch","Drifter","Soul","Castaway"]);
      return adj + ' ' + noun;
    }

    switch (weakest) {
      case 'hp':
        adj  = chooseFrom(["Brittle","Frail","Rotted","Decaying","Crumbling","Withered","Ruined","Blighted","Broken","Tattered"]);
        noun = chooseFrom(["Husk","Shade","Remnant","Castaway","Wretch","Exile","Vagrant","Pauper","Revenant","Specter"]);
        break;
      case 'sta':
        adj  = chooseFrom(["Heavy","Sluggish","Winded","Spent","Leaden","Exhausted","Bloated","Withered","Lumbering","Plodding"]);
        noun = chooseFrom(["Shambler","Straggler","Wretch","Sluggard","Plodder","Laggard","Lummox","Trudger","Clod","Castaway"]);
        break;
      case 'atk':
        adj  = chooseFrom(["Meek","Feeble","Faltering","Timid","Wavering","Harmless","Reluctant","Yielding","Gentle","Soft"]);
        noun = chooseFrom(["Penitent","Coward","Bystander","Martyr","Lamb","Witness","Appeaser","Shepherd","Supplicant","Wayfarer"]);
        break;
      case 'lck':
        adj  = chooseFrom(["Cursed","Jinxed","Doomed","Forsaken","Ill-Fated","Blighted","Damned","Condemned","Wretched","Struck"]);
        noun = chooseFrom(["Pariah","Scapegoat","Wretch","Castaway","Outcast","Victim","Fool","Stray","Shade","Wanderer"]);
        break;
      case 'int':
        adj  = chooseFrom(["Senseless","Witless","Dull","Blank","Thoughtless","Vacant","Oblivious","Mindless","Dim","Empty"]);
        noun = chooseFrom(["Brute","Dullard","Fool","Oaf","Lout","Thrall","Pawn","Hollow","Wretch","Simpleton","Drone","Cretin"]);
        break;
      case 'mgk':
        adj  = chooseFrom(["Drained","Spent","Mundane","Voided","Depleted","Inert","Parched","Sunken","Hollowed","Empty"]);
        noun = chooseFrom(["Husk","Shell","Castaway","Exile","Pauper","Remnant","Outcast","Vessel","Hollow","Wretch"]);
        break;
      default:
        return getFirstName();
    }
    return adj + ' ' + noun;
  }

  var adj, noun;
  switch (dominant) {
    case 'atk':
      adj  = chooseFrom(["Bloodied","Savage","Ruthless","Wrathful","Scarred","Relentless","Merciless","Vicious","Vengeful","Spiteful","Hardened","Ravaged"]);
      noun = chooseFrom(["Slayer","Butcher","Ravager","Reaper","Killer","Predator","Blade","Brute","Marauder","Wretch","Fury","Raider"]);
      break;
    case 'hp':
      adj  = chooseFrom(["Unbroken","Steadfast","Bound","Burdened","Weary","Sunken","Damned","Hollow","Forsaken","Immovable","Scarred","Enduring"]);
      noun = chooseFrom(["Sentinel","Martyr","Remnant","Husk","Bearer","Warden","Vessel","Survivor","Anchor","Keeper","Stone","Pillar"]);
      break;
    case 'mgk':
      adj  = chooseFrom(["Cursed","Veiled","Shrouded","Corrupted","Tainted","Haunted","Withered","Twisted","Ancient","Blighted","Unholy","Forsaken"]);
      noun = chooseFrom(["Acolyte","Harbinger","Heretic","Relic","Shade","Whisperer","Seer","Penitent","Ascetic","Seeker","Witness"]);
      break;
    case 'sta':
      adj  = chooseFrom(["Lurking","Restless","Fleeting","Unseen","Drifting","Tireless","Silent","Fading","Cold","Hollow","Lost","Pale"]);
      noun = chooseFrom(["Wanderer","Drifter","Pilgrim","Ghost","Vagrant","Phantom","Nomad","Exile","Recluse","Dancer","Runner","Shade"]);
      break;
    case 'lck':
      adj  = chooseFrom(["Blessed","Fated","Charmed","Wayward","Tempted","Doomed","Fallen","Twisted","Last","Forsaken","Bound","Reckless"]);
      noun = chooseFrom(["Fool","Gambler","Chaser","Believer","Stray","Outcast","Soul","Dreamer","Wretch","Prophet","Vagrant","One"]);
      break;
    case 'int':
      adj  = chooseFrom(["Thoughtful","Quiet","Ancient","Nameless","Forgotten","Veiled","Grieving","Fallen","Hollow","Broken","Distant","Wise"]);
      noun = chooseFrom(["Prophet","Scholar","Seeker","Witness","Watcher","Hermit","Sage","Recluse","Reader","Exile","Keeper","Pilgrim"]);
      break;
    default:
      return getFirstName();
  }

  return adj + ' ' + noun;
}

function getGameTip(){
  const random_quotes = ["<b>👀 Search</b> for loot in places of interest.","Always <b>💤 Sleep</b> when you get a chance.","<b>💨 Hasty</b> attacks can only be <b>🔰 Blocked</b>.","<b>🔺 Heavy</b> attacks can only be <b>🌀 Dodged</b>.","<b>🔻 Small</b> creatures can be <b>👋 Grabbed</b>.","<b>👋 Grab</b> exhausted enemies to <b>knock them out</b>.","<b>🧠 Intellect</b> helps befreinding companions.","<b>💫 Cast</b> spells always hit before retaliation.","<b>🍴 Eating</b> when relaxed provides a bonus.","Use <b>🔰 Block</b> or <b>🌀 Dodge</b> before <b>⚔️ Attack</b>.","<b>💤 Sleep</b> recovers <b>🟢 Energy</b> and <b>🔵 Mana</b>.","<b>🍀 Luck</b> rises the chance for a critical hit.","<b>👋 Grab</b> sombe <b>🪱 Bait</b> to do <b>🎣 Fishing</b> later.","<b>💌 Report</b> any issues to make a difference.","<b>💬 Speaking</b> can sometimes stop the fight.","<b>🍀 Luck</b> may help you  survive a fatal hit.", "Some <b>🔱 Altars</b> require 🔪  for a <b>Sacrifice<b>.","<b>🎣 Fishing </b> provides a variety of unique items.", "<b>✏️ Rename</b> your hero by clicking their name.","<b>🐞 Report</b> issues by clicking the version code.","Pick up 🗝️ <b>Keys</b> to unlock secrets later.","🪄 <b>Cast</b> a spell to open lock for -2 🔵 <b>Mana</b>.","🪬 <b>Curse</b> lowers the enemy damage by half.","Casting ❤️‍🩹 <b>Heal</b> restores up to <b>+2 ❤️ Health</b>.","<b>🟠 Legendary</b> items provide unique advantage.","🔥 <b>Cook</b> bad food to remove negative effects.","<b>🍀 Luck</b> affects your chances for getting loot.","Open <b>🗝️ Locked</b> objects by <b>🪄 Cast</b> for -2 🔵","Non-deadly solutions always award more "+decorateStatusText("","XP",colorGold)+".","Gain "+decorateStatusText("","XP",colorGold)+" to <b>🎉 Level Up</b> and get stronger.","<b>🧠 Intellect</b> affects "+decorateStatusText("","XP",colorGold)+" gains both ways.","<b>💀 Killing</b> enemies affects <b>karma negatively</b>.","<b>Good karma</b> grants <b>🎁 Bonus</b> on <b>✨ Revival</b>.","You need to <b>💤 Sleep</b> to get a <b>🎉 Level Up</b>.","Pending <b>🎉 Level Up</b> is marked by the <b>⇡</b> symbol.","No one likes to be called a <i><b>✏️ Cheater</b></i>.","<b>⚔️ Attack</b> locks repedately to smash them open.","<b>💔 Recalling</b> memories hurts first, helps later.","Carefully consider where you <b>💤 Sleep</b>.","Spend <b>🪙 Drachmae</b> to improve your chances.","Risking <b>🪙 Drachmae</b> has a ~50% success rate.","<b>🍀 Luck</b> affects various random chances.","Renaming to <b><i>✏️ Poco Dinero</b></i> counts as cheating.","<b>🎣 Fishing</b> is dangerous, make sure to be rested."];
  return random_quotes[Math.floor(Math.random() * random_quotes.length)];
}

function getPoem(){
  const random_quotes = ["Please\\ be careful what you wish for\\ my love.<br>It might as well be exactly what you get.","Do not ever follow where I fell\\ my heart.<br>The ground has swallowed my beauty.","My vows outlived my breath\\ it seems.<br>They whisper still\\ beneath the soil.","The earth tried to keep me\\ but not anymore.<br>I rose with your name on my lips.","You whispered into the grave like a prayer.<br>And I came\\ half dream\\ half devotion.","I drank from the chalice of sorrow.<br>It tasted like you — and I awoke.","I stitched myself from bones and vows.<br>Just to stand where you once wept.","You said 'forever' with a mortal tongue.<br>I kept my promise — what's your excuse?","The mirror cracked when I passed.<br>It still shows me, just not the same way.","The bells no longer ring for weddings.<br>Not since you spoke my name.","The trees hum softly where I fell and rose.<br>No birds have sung there since.","I left a kiss upon the oak we carved.<br>The bark split down the middle.","Don't reach for the old book\\ my love.<br> Some secrets should remain hidden forever.","You'll want to fix what was never broken.<br>But disturbing the peace won't help.","You did this to me... did this to us!<br>Why wouldn't you let me go?","The world could remain peaceful.<br>If only you would listen to me.",  "I still wear your name like a veil.<br>Even the worms dare not touch it.","You called me back with love.<br>But love does not know mercy.","I waited in the soil so long.<br>The stars forgot my name.","Every petal you left on my grave<br>grew thorns when you turned away.","Your healing hands became my undoing.<br>But I am not fully gone.","The endless cold welcomed me first.<br>Then I remembered your warmth.","You begged the ancient gods to give me back.<br>They laughed and released the darkness.","I came the way you asked.<br>Not fully whole — but yours.","Our vow didn't end with my death.<br>Only my breathing did.","They buried me with lovely roses.<br>But I bloomed with something else.","You desperately prayed for an act of god.<br>I became one you could not bear.","Even now\\ I reach for you - nowhere to find you.<br>Only shadows take my hand.","The stars we used to watch together...\\\\ <br>They now turn their faces away.","Your twisted love outlived my breath.<br>Then cursed me forever.","You called me back with trembling hands.<br>Now tremble for what you've done.","I hoped you'd mourn me.<br>Not try to fix me.","You wanted me to never leave.<br>I'll soon fulfill your wish.","Love me as I am now.<br>Or rot beside me.", "You broke me with foul magic.<br>Now I return with justice.", "I died believing in your endless love.<br>Now I rise certain of your betrayal.","The wicked altar remembers what you forgot.<br>And so do I\\ my love."];
  return "<i>"+random_quotes[Math.floor(Math.random() * random_quotes.length)]+"</i>";
}

function getBridePoemByLove() {
  var accusatory = [
    "You did this to me... did this to us!<br>Why wouldn't you let me go?",
    "You broke me with foul magic.<br>Now I return with justice.",
    "I died believing in your endless love.<br>Now I rise certain of your betrayal.",
    "Your twisted love outlived my breath.<br>Then cursed me forever.",
    "You called me back with trembling hands.<br>Now tremble for what you've done.",
    "I hoped you'd mourn me.<br>Not try to fix me.",
    "Love me as I am now.<br>Or rot beside me.",
    "You begged the ancient gods to give me back.<br>They laughed and released the darkness.",
    "You wanted me to never leave.<br>I'll soon fulfill your wish.",
    "The world could remain peaceful.<br>If only you would listen to me."
  ];
  var longing = [
    "My vows outlived my breath, it seems.<br>They whisper still, beneath the soil.",
    "I came the way you asked.<br>Not fully whole — but yours.",
    "Our vow didn't end with my death.<br>Only my breathing did.",
    "Even now, I reach for you — nowhere to find you.<br>Only shadows take my hand.",
    "You whispered into the grave like a prayer.<br>And I came, half dream, half devotion.",
    "I waited in the soil so long.<br>The stars forgot my name.",
    "The endless cold welcomed me first.<br>Then I remembered your warmth.",
    "I still wear your name like a veil.<br>Even the worms dare not touch it.",
    "Every petal you left on my grave<br>grew thorns when you turned away.",
    "The stars we used to watch together...<br>They now turn their faces away."
  ];
  var pool = (playerLove >= 3) ? longing : accusatory;
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getShopMessage(){
  var random_quotes = ["Well met, what's it gonna be this time?","Oh, its you again... take your pick carefully.","Back so soon? I guess you need a better gear.","You again? I guess you failed your quest then.","Out of lives again? Out of Drachmae soon too.","You really know how to keep me in business.","Failure suits you. My wares as well.","Back again? My prices stayed the same.","Another try, another tab to pay.","You fall, I profit. Circle of life.","The afterlife is free, my shop isn't.","You died. I survived. Let's trade.","Welcome back, my purse missed you already.","Still trying? Admirable... and profitable.","You again? Fate loves wasting time.","If effort was currency, you'd be rich.","No discount, no mercy, no refunds.","Your enemies hit hard. My prices hit harder.","You failed again. At least you're consistent.","You fall, they laugh, I charge full price.","Careful now. Dying gets expensive.","Try not to waste this investment too.","You keep dying. I keep stocking.","Another attempt? Hope your wallet holds up.","Progress is slow. My patience is slower.","You lost everything… except spending habits.","Back from the void? At least not empty handed.","The grave is patient, I am not.","You look worse. My inventory looks better.","Failure is a habit and so is buying.","You can't cheat death... or my prices.","Another reset, same old desperation.","At this rate, you'll haunt my shop forever."]
.filter(item => !usedShopMessages.includes(item));
  if (playerShopped) random_quotes = ["Sure sure, I got plenty more in stock.","Seems like you have more to spend.","There's no discount for returning customers.","Not done yet? Still got plenty more.","Ah, a spender. I totally approve.","Coins still rattling? I've got more for you.","Plenty of stock, pity about your skill.","Keep buying, maybe luck will notice you.","You live, you die, you shop. Cycle continues.","Still have coin? I can surely fix that.","Gear's heavier, purse is lighter. Balance restored.","Nothing like fresh regret in shiny packaging.","You buy it, I profit. Fair trade.","More trinkets, same doomed story.","You can't buy talent, but you're trying.","Still breathing and still paying. Good.","Spend now, regret later. Or not?","Don't worry, I won't mind when you're broke.","Stock's full, your fate is not.","Oh look, you found more currency to waste.","You must really believe this will help.","I admire your optimism. It's delicious.","Another shiny thing to die with.","You buy, they kill, I restock.","If preparation mattered, you'd be unstoppable.","I'll happily enable your next failure.","A wise investment… probably.","Good choice. Not good enough, but good.","Your purse bleeds, my shelves smile.","One step closer to being stylishly deceased.","Keep this up and I'll name a shelf after you.","Still have coin? Then we're not done."].filter(item => !usedShopMessages.includes(item));

  if (random_quotes.length==0) random_quotes.push("Ugh, hate to see you here all the time.")
  var message = random_quotes[Math.floor(Math.random() * random_quotes.length)]+"<br>";
  usedShopMessages+=message;

  return message
}
