function _getCurrentNameEmoji() {
  if (playerEmoji) return playerEmoji;
  var lootEmojis = ['👺','🐴','🐷'];
  for (var i = 0; i < lootEmojis.length; i++) {
    if (playerName.startsWith(lootEmojis[i] + ' ')) return lootEmojis[i];
  }
  return '';
}

function renameCharacter(onDone) {
  var currentEmoji = _getCurrentNameEmoji();
  var displayName = playerName;
  if (currentEmoji && displayName.startsWith(currentEmoji + ' ')) {
    displayName = displayName.slice(currentEmoji.length + 1);
  }
  showCompanionNameDialog('rename', displayName, function(chosenName) {
    if (chosenName === null) { if (onDone) onDone(playerName); return; }
    var newName = chosenName || 'Nameless';
    playerName = newName;
    redraw();
    if (onDone) onDone(playerName);
  }, function() {
    if (onDone) onDone(playerName); // cancelled — no change
  });
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
  var _net = RarityManager.calcNet(origin);
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
      adj  = chooseFrom(["Blessed","Fated","Charmed","Lucky","Tempted","Doomed","Fallen","Twisted","Last","Forsaken","Bound","Reckless"]);
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
  const random_quotes = [
    "<b>👀 Search</b> for loot in places of interest.",
    "<b>💤 Sleeping</b> too much bears consequences.",
    "<b>💨 Hasty</b> attacks can only be <b>🔰 Blocked</b>.",
    "<b>🔺 Heavy</b> attacks can only be <b>🌀 Dodged</b>.",
    "<b>🔻 Small</b> creatures can be <b>👋 Grabbed</b>.",
    "<b>👋 Grab</b> exhausted enemies to <b>knock them out</b>.",
    "<b>🧠 Intellect</b> helps befreinding companions.",
    "<b>💫 Cast</b> spells always hit before retaliation.",
    "<b>🍴 Eating</b> when relaxed provides a bonus.",
    "Use <b>🔰 Block</b> or <b>🌀 Dodge</b> before <b>⚔️ Attack</b>.",
    "<b>💤 Sleep</b> recovers <b>🟢 Energy</b> and <b>🔵 Mana</b>.",
    "<b>🍀 Luck</b> rises the chance for a critical hit.",
    "<b>👋 Grab</b> some <b>🪱 Bait</b> to do <b>🎣 Fishing</b> later.",
    "<b>💌 Report</b> any issues to make a difference.",
    "<b>💬 Speaking</b> can sometimes stop the fight.",
    "<b>🍀 Luck</b> may help you  survive a fatal hit.",
    "Some <b>🔱 Altars</b> require 🔪  for a <b>Sacrifice<b>.",
    "<b>🎣 Fishing </b> provides a variety of unique items.",
    "<b>✏️ Rename</b> your hero by clicking their name.",
    "<b>🐞 Report</b> issues by clicking the version code.",
    "Pick up 🗝️ <b>Keys</b> to unlock secrets later.",
    "🪄 <b>Cast</b> a spell to open lock for -2 🔵 <b>Mana</b>.",
    "🪬 <b>Curse</b> lowers the enemy damage by half.",
    "Casting ❤️‍🩹 <b>Heal</b> restores up to <b>+2 ❤️ Health</b>.",
    "<b>🟠 Legendary</b> items provide unique advantage.",
    "🔥 <b>Cook</b> bad food to remove negative effects.",
    "<b>🍀 Luck</b> affects your chances for getting loot.",
    "Open <b>🗝️ Locked</b> objects by <b>🪄 Cast</b> for -2 🔵",
    "Non-deadly solutions always award more "+decorateStatusText("","XP",colorGold)+".",
    "Gain "+decorateStatusText("","XP",colorGold)+" to <b>🎉 Level Up</b> and get stronger.",
    "<b>🧠 Intellect</b> affects "+decorateStatusText("","XP",colorGold)+" gains both ways.",
    "<b>💀 Killing</b> enemies affects <b>karma negatively</b>.",
    "<b>Good karma</b> grants <b>🎁 Bonus</b> on <b>✨ Revival</b>.",
    "You need to <b>💤 Sleep</b> to get a <b>🎉 Level Up</b>.",
    "Pending <b>🎉 Level Up</b> is marked by a <b>⇡</b> symbol.",
    "No one likes to be called a <i><b>✏️ Cheater</b></i>.",
    "<b>⚔️ Attack</b> locks few times to break them open.",
    "<b>💔 Recalling</b> memories hurts first, helps later.",
    "Carefully consider where you <b>💤 Sleep</b>.",
    "Spend <b>🪙 Drachmae</b> to improve your chances.",
    "<b>🍀 Luck</b> affects various random chances.",
    "The name <b><i>✏️ Poco Dinero</b></i> counts as cheating.",
    "<b>🎣 Fishing</b> is dangerous, make sure to be rested.",
    "Try deep-sleeping at the <b>⛩️ Soulbinding Arch</b>.",
  ];
  return random_quotes[Math.floor(Math.random() * random_quotes.length)];
}

function getPoem(){
  const random_quotes = [
    "Please, be careful what you wish for, my love.<br>It might as well be exactly what you get.",
    "Do not ever follow where I fell, my heart.<br>The ground has swallowed my beauty.",
    "My vows outlived my breath, it seems.<br>They whisper still, beneath the soil.",
    "The earth tried to keep me, but not anymore.<br>I rose with your name on my lips.",
    "You whispered into the grave like a prayer.<br>And I came, half hatred, half devotion.",
    "I drank from the chalice of sorrow.<br>It tasted like you — and I awoke.",
    "I stitched myself from bones and vows.<br>Just to stand where you once wept.",
    "You said 'forever' with a mortal tongue.<br>I kept my promise — what's your excuse?",
    "The mirror cracked when I passed.<br>It still shows me, just not the same way.",
    "The bells no longer ring for weddings.<br>Not since you spoke my name.",
    "The trees hum softly where I fell and rose.<br>No birds have sung there since.",
    "I left a kiss upon the oak we carved.<br>The bark split down the middle.",
    "Don't reach for the old book, my love.<br> Some secrets should remain hidden forever.",
    "You'll want to fix what was never broken.<br>But disturbing the peace won't help.",
    "You did this to me... did this to us!<br>Why wouldn't you let me go?",
    "The world could remain peaceful.<br>If only you would listen to me.",
    "I still wear your name like a veil.<br>Even the worms dare not touch it.",
    "You called me back with love.<br>But love does not know mercy.",
    "I have been waiting in the soil for so long.<br>The stars even forgot my name.",
    "Every petal you left on my grave<br>grew thorns when you turned away.",
    "Your healing hands became my undoing.<br>But I am not fully gone.",
    "The endless cold welcomed me first.<br>Then I remembered your warmth.",
    "You begged the ancient gods to give me back.<br>They laughed and released the darkness.",
    "I came the way you asked.<br>Not fully whole — but yours.",
    "Our vow didn't end with my death.<br>Only my breathing did.",
    "They buried me with lovely roses.<br>But I bloomed with something else.",
    "You desperately prayed for an act of god.<br>I became one you could not bear.",
    "Even now, I reach for you - nowhere to find you.<br>Only shadows take my hand.",
    "The stars we used to watch together...<br>They now turn their faces away.",
    "Your twisted love outlived my breath.<br>Then cursed me forever.",
    "You called me back with trembling hands.<br>Now tremble for what you've done.",
    "I hoped you'd mourn me.<br>Not try to fix me.",
    "You wanted me to stay.<br>I'll fulfill your wish.",
    "Love me as I am now.<br>Or rot beside me.",
    "You broke me with foul magic.<br>Now I return with justice.",
    "I died believing in your endless love.<br>Now I rise certain of your betrayal.",
    "The wicked altar remembers what you forgot.<br>And so do I, my love."];
  return "<i>"+random_quotes[Math.floor(Math.random() * random_quotes.length)]+"</i>";
}

function getBrideOpeningByLove() {
  var accusatory = [
    "You broke me with foul magic.<br>Now I return with justice.",
    "I died believing in your love.<br>Then I risen, sure of betrayal.",
    "Your love outlived my breath.<br>Then cursed me forever.",
    "You called me back, trembling.<br>Now tremble for what you did.",
    "You begged the gods for me.<br>They released the darkness.",
    "You wanted me to stay.<br>I have fulfilled your wish.",
    "The world could be peaceful.<br>If only you would listen."
  ];
  var longing = [
    "My vows outlived my breath.<br>They whisper beneath the soil.",
    "I came the way you asked.<br>Not fully whole, but yours.",
    "Your whisper was like prayer.<br>I came half hatred, half devotion.",
    "I waited in the soil so long.<br>The stars forgot my name.",
    "I wear your name like a veil.<br>Even the worms won't touch it.",
    "Every petal on my grave...<br>Has been filling with poison.",
    "Stars we watched together...<br>They now turn their faces."
  ];
  var pool = (playerLove >= 3) ? longing : accusatory;
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getBrideDyingByLove() {
  var accusatory = [
    "You did this to me... to us!<br>Why wouldn't you let me go?",
    "Love me as I am now.<br>Or rot beside me.",
    "I hoped you'd mourn me.<br>Not try to fix me.",
  ];
  var longing = [
    "My vows outlived my breath.<br>They whisper beneath the soil.",
    "Vows don't end with death.<br>Only my breathing did.",
    "I reach, but find shadows.<br>Only shadows take my hand.",
    "The cold welcomed me first.<br>Then I remembered your warmth.",
    "I wear your name like a veil.<br>Even the worms won't touch it.",
    "Every petal on my grave...<br>Has been filling with poison.",
  ];
  var pool = (playerLove >= 3) ? longing : accusatory;
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

var ENDING_FRAMES = {
  button_attack: [
    {emoji:'⚔️', text:'The deed is finally done.',    text2:'You will not be clean again.'},
    {emoji:'🩸', text:'She finally rests in peace.',  text2:'She waited so long for this.'},
    {emoji:'🖤', text:'And you walk on alone.',       text2:'As you were always going to.'}
  ],
  button_roll: [
    {emoji:'💔', text:'You turn your back.',           text2:'She watches as you disappear.'},
    {emoji:'🥀', text:'The world slowly rots.',        text2:'No one is coming to stop it.'},
    {emoji:'👰🏻‍♀️', text:'She still waits, always will.', text2:'Her patience outlived your vow.'}
  ],
  button_block: [
    {emoji:'🔰', text:'You stand your ground.',        text2:'Resolve never found you.'},
    {emoji:'🗿', text:'Slowly turning to stone.',      text2:'This is a true devotion.'},
    {emoji:'💞', text:'Your hearts bound forever.',    text2:'Neither free, neither gone.'}
  ],
  button_grab: [
    {emoji:'🫂', text:'You hold her close.',           text2:'She does not pull away.'},
    {emoji:'🌑', text:'The darkness takes you both.',  text2:'You always knew it would.'},
    {emoji:'🖤', text:'Together. At last.',             text2:'A cost you were willing to pay.'}
  ],
  button_sleep: [
    {emoji:'💤', text:'You lie beside her.',           text2:'No armor. No grief. Just this.'},
    {emoji:'🌿', text:'The ground grows still.',       text2:'Even the corruption stands still.'},
    {emoji:'🤍', text:'Your hearts make no sound.',    text2:'The debt is not paid. Forgiven.'}
  ],
  button_speak: [
    {emoji:'❤️', text:'You say her name: Rosabel!',    text2:'She did not expect you to know.'},
    {emoji:'✨', text:'Something stirs inside her.',   text2:'Not hope, something older than that.'},
    {emoji:'💖', text:'She remembers who she was.',    text2:'Before your grief, before the grave.'}
  ],
  button_cast: [
    {emoji:'❤️‍🩹', text:'You unravel the curse.',       text2:'Thread by thread. Year by year.'},
    {emoji:'✨', text:'The magic tears it apart.',     text2:'Nothing survives being unmade.'},
    {emoji:'🪽', text:'She is finally free.',          text2:'Not saved. Set free.'}
  ],
  button_pray: [
    {emoji:'🙏', text:'You beg the gods for mercy.',  text2:'You have no other option left.'},
    {emoji:'🌩️', text:'Something hears your call.',   text2:'Its not mercy, just pure interest.'},
    {emoji:'🌪️', text:'The gods take her gently.',    text2:'She rises to the dark skies.'}
  ],
  button_curse: [
    {emoji:'💀', text:'You seal the pact forever.',    text2:'No gods were consulted on this.'},
    {emoji:'🌑', text:'The darkness claims you both.', text2:'It was patient, it always is.'},
    {emoji:'👹', text:'None of you deserve peace.',    text2:'And so it will always be.'}
  ]
};

function getRunStartMessage() {
  var pool = [
    "Your destiny still awaits.<br>Do not fail again.",
    "The corruption spreads.<br>Your love lingers.",
    "You have died before.<br>You will die again.",
    "Death was meant to set free.<br>Until it did not.",
    "The whole world is dying.<br>Try to remember why.",
    "The cursed do not rest.<br>Neither should you.",
    "The world didn't ask for this.<br>Neither did she.",
    "Every corpse you pass<br>whispers her name.",
    "Whatever you finally find.<br> Take the right decision.",
    "Your love broke something.<br>Your courage must answer.",
    "The dead world remembers.<br>Resolve your sins.",
    "The world is corrupted.<br>Only you can undo it.",
    "The world decays every step.<br>Make haste to stop it.",
    "Something brought you back.<br>It is about time to end it."
  ];
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getRunEndMessage() {
  var pool = [
    "The loop continues.<br>She is still waiting.",
    "Flesh returns to dust.<br>The sin remains.",
    "Broken and forgotten.<br>Just like this world.",
    "The darkness claims you.<br>The debt is unpaid.",
    "Your light flickers out.<br>The world stays dead.",
    "A desperate end for<br>a desperate soul.",
    "Grief was your armor.<br>It wasn't enough.",
    "The corruption wins.<br>It always does.",
    "Silence falls again.<br>Listen to the decay.",
    "Your bones will join<br>the ones you stepped on.",
    "The failed spell echoes.<br>You are but a shadow.",
    "Forsaken by the sun.<br>Bound to the rot.",
    "The river flows cold.<br>Your story ends here.",
    "One more ghost added<br>to the list of regrets."
  ];
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getResignMessage() {
  var pool = [
    "Another damned soul.",
    "The world does not mourn.",
    "Even ghosts can quit.",
    "The rot claims another.",
    "The gate closes quietly.",
    "One fewer soul to mourn.",
    "Some wounds choose to stay.",
    "The darkness needed no help.",
    "Grief takes many forms.",
  ];
  return chooseFrom(pool);
}

function getWeddingInvitationPoem() {
  var pool = [
    "You sent this once trembling.<br>She never stopped believing.",
    "The text held her handwriting.<br>The oath stayed unsaid.",
    "A dress was chosen, flowers ordered.<br>Only one of you was ready.",
    "She sealed it with her breath.<br>It stayed sealed forever.",
    "She wrote your name at the top.<br>Even then, she already knew.",
    "It said: arrive before sundown.<br>You arrived. Just not in time.",
    "She held this the night before.<br>But couldn't hold it the day after.",
    "A fold marks where she carried it.<br>Close to where it mattered.",
    "You promised to be there.<br>You were, just not the way she was.",
    "The envelope was never opened.<br>It stayed undelivered forever."
  ];
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getWeddingInvitationFade() {
  var pool = [
    "Sealed with a pressed flower.<br>She chose it herself.",
    "A name, written by her hand.<br>The deed was never done.",
    "We were supposed to be there.<br>She is still to come.",
    "Gold-edged, still unopened.<br>Unlike the gates of hell.",
    "After all those days...<br>The wax holds her prints.",
    "You carried this once.<br>The feeling has changed.",
    "Still sealed. Still waiting.<br>Just like you and her.",
    "The paper holds her perfume.<br>It is never gonna fade.",
    "A promise folded into paper.<br>Yet still undelivered."
  ];
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getLoversMementoFade() {
  var pool = [
    "The ink held long enough.<br>The words never arrived.",
    "Written in full, undeliveired.<br>Still smells of her perfume.",
    "She would have read it twice.<br>You kept it instead.",
    "Still folded the way she did it.<br>The crease has not softened.",
    "Every word still there.<br>Still unsaid as far as she knows.",
    "No address. No reply.<br>Sealed like a wound that held.",
    "Her name was going to be first.<br>It still is.",
    "Wind carried this a long way.<br>It still did not reach her."
  ];
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getMeetingPlaceFade() {
  var pool = [
    "Something about this place.<br>You can't name it.",
    "You have seen this before.<br>But not in this life.",
    "The air here is different.<br>Feels heavier somehow.",
    "You slow without meaning to.<br>Something holds you here.",
    "This place feels familiar.<br>Something happened here.",
    "You have stood here before.<br>But the world was different.",
    "You stare at a familiar gate.<br>The feeling unsettles you.",
    "Something is wrong here.<br>It feels too well known.",
    "The corruption missed a spot.<br>Or perhaps spared it.",
    "You had to stop walking.<br>This caught your attention."
  ];
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getMeetingPlaceRecall() {
  var pool = [
    "Saw her smile here the first time.<br>The world was still whole.",
    "She was standing right here.<br>You didn't know what to say.",
    "The world felt different that day.<br>She made it that way.",
    "She laughed here before.<br>You didn't see it.",
    "She had flowers in her hair.<br>You never asked which kind.",
    "You were just passing through.<br>She changed that forever.",
    "She was sitting just there.<br>You almost walked past.",
    "You didn't know her name yet.<br>You learned it quickly.",
    "She was right there.<br>The world had not yet fallen.",
    "This is where it began.<br>Before you broke it all.",
    "You didn't know her name yet.<br>You were about to meet."
  ];
  return '<i>' + pool[Math.floor(Math.random() * pool.length)] + '</i>';
}

function getLootDropLog() {
  return chooseFrom([
    "Seems like they dropped something.",
    "Something fell from them.",
    "There's something left behind.",
    "They left something on the ground.",
    "Something slipped on the ground."
  ]);
}

function getRestBadlyText() {
  return chooseFrom([
    "Slept poorly, waking up groggy.",
    "Tossed and turned, barely rested.",
    "Woke up early, not fully rested.",
    "Slept barely enough to recover.",
    "Dreamed badly, woken up tired."]);
}

function getSleepNearLimitLog() {
  return chooseFrom([
    "The cold creeps in as you sleep.",
    "Something stirs ahead, do not hesitatate.",
    "She grows impatient, do not waste time. "
  ]);
}

function getSleepOverLimitLog() {
  return chooseFrom([
    "The world decays a little while you sleep.",
    "She slips further away with every sleep.",
    "The darkness deepens, do not linger."
  ]);
}

function getWalkCritText() {
  return chooseFrom(["Walked away in a good mood.", "Left whistling under their breath.", "Strolled off without a care.", "Walked away grinning to themselves.", "Continued with a spring in their step."]);
}

function getShopMessage(){
  var random_quotes = [
    "Well met, what's it gonna be this time?",
    "Oh, its you again. Take your pick carefully.",
    "Back so soon? I guess you need a better gear.",
    "You again? I guess you failed your quest then.",
    "Out of lives again? Out of Drachmae soon too.",
    "You really know how to keep me in business.",
    "Failure suits you. My wares as well.",
    "Back again? My prices stayed the same.",
    "Another try, another tab to pay.",
    "You fall, I profit. Circle of life.",
    "The afterlife is free, my shop isn't.",
    "You died. I survived. Let's trade.",
    "Welcome back, my purse missed you already.",
    "Still trying? Admirable... and profitable.",
    "You again? Fate loves wasting time.",
    "If effort was currency, you'd be rich.",
    "No discount, no mercy, no refunds.",
    "Your enemies hit hard. My prices hit harder.",
    "You failed again. At least you're consistent.",
    "You fall, they laugh, I charge full price.",
    "Careful now. Dying gets expensive.",
    "Try not to waste this investment too.",
    "You keep dying. I keep stocking.",
    "Another attempt? Hope your wallet holds up.",
    "Progress is slow. My patience is slower.",
    "You lost everything… except spending habits.",
    "Back from the void? At least not empty handed.",
    "The grave is patient, I am not.",
    "You look worse. My inventory looks better.",
    "Failure is a habit and so is buying.",
    "You can't cheat death... or my prices.",
    "Another reincarnation, same old desperation.",
    "At this rate, you'll haunt my shop forever."]
    .filter(item => !usedShopMessages.includes(item));

  if (playerShopped) random_quotes = [
    "Sure sure, I got plenty more in stock.",
    "Seems like you have more to spend.",
    "There's no discount for returning customers.",
    "Not done yet? Still got plenty more.",
    "Ah, a spender. I totally approve.",
    "Coins still rattling? I've got more for you.",
    "Plenty of stock, pity about your skill.",
    "Keep buying, maybe luck will notice you.",
    "You live, you die, you shop. Cycle continues.",
    "Still have coin? I can surely fix that.",
    "Gear heavier, purse lighter. Everything balanced.",
    "Nothing like fresh regret in shiny packaging.",
    "You buy it, I profit. Fair trade.",
    "More trinkets, same doomed story.",
    "You can't buy talent, but you're trying.",
    "Still breathing and still paying. Good.",
    "Spend now, regret later. Or not?",
    "Don't worry, I won't mind when you're broke.",
    "Stock's full, your fate is not.",
    "Oh look, you found more currency to waste.",
    "You must really believe this will help.",
    "I admire your optimism. It's delicious.",
    "Another shiny thing to die with.",
    "You buy, they kill, I restock.",
    "If preparation mattered, you'd be unstoppable.",
    "I'll happily delay your next failure.",
    "A wise investment… probably.",
    "Good choice. Not good enough, but good.",
    "Your purse bleeds, my shelves smile.",
    "One step closer to being stylishly deceased.",
    "Keep this up and I'll name a shelf after you.",
    "Still have coin? Then we're not done."]
    .filter(item => !usedShopMessages.includes(item));

  if (random_quotes.length==0) random_quotes.push("Ugh, hate to see you here all the time.")
  var message = random_quotes[Math.floor(Math.random() * random_quotes.length)]+"<br>";
  usedShopMessages+=message;

  return message
}

function getRecallPassText() {
  return chooseFrom([
    "It comes back slowly, sharp and real -1 💔",
    "Something surfaced, it hurts to hold -1 💔",
    "Familiar and painful, both at once -1 💔",
    "A memory, didn't want to feel it -1 💔",
    "She was there for you, remember? -1 💔"
  ]);
}

function getRecallCritPassText() {
  return chooseFrom([
    "There was someone special, just for you.",
    "You and her, bound together, forever.",
    "All slowly comes back to you.",
    "She was special, almost shed a tear.",
    "Feels like a part of you is missing."
  ]);
}

function getRecallFailText() {
  return chooseFrom([
    "Couldn't remember why this is familiar.",
    "You felt something, but couldn't reach it.",
    "Familiar shape, but no memory attached.",
    "The feeling slipped before it formed.",
    "Somewhere deep inside, you should know."
  ]);
}

function getRecallCritFailText() {
  return chooseFrom([
    "Familiar shape with nothing attached.",
    "Perhaps this was meant for someone else?",
    "There's a price for forgetting love.",
    "You refused your own memories.",
    "Whatever you once felt is now gone."
  ]);
}

function getEncounterUsedMessage() {
  var pool = [
    "Seems like that was it for now.",
    "Nothing more to do here for now.",
    "That's it, you've done what you can."
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getRivalDialogue() {
  var pool = [
    "You should have stayed dead.",
    "My corpse remembers you.",
    "I died so you wouldn't have to.",
    "We were never that different."
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getWhisperingStonesLog() {
  var pool = [
    "Names in the stone. Others have stood here before.",
    "Someone else's grief, carved into the threshold.",
    "The dead remember their choices. These are not yours.",
    "Other worlds bled through here. Their marks remain.",
    "You are not the first. The wall remembers."
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

var _RIVAL_LAST_WORDS = {
  win_speak:   ["Said her name once. She remembered.", "Called to her. She heard."],
  win_free:    ["Freed her once. Not this time.", "The curse broke. Once."],
  win_kill:    ["Killed her before. This time, different.", "Drew blood once. Old habit."],
  win_embrace: ["Chose the dark before.", "Walked into it willingly. Once."],
  win_pray:    ["The gods heard them once.", "Prayed hard enough. Once."],
  win_walk:    ["Walked away before. No more.", "Turned their back once."],
  win_guard:   ["Stood guard once. Now they fall.", "Chose to stay before."],
  win_sleep:   ["Lay down before. This time for good.", "Found rest once. Briefly."],
  win_curse:   ["The pact followed them here.", "Made a deal once. It remembers."],
  death:       ["Died before reaching her. Died again.", "Never made it. Not then, not now.", "Fell short before. No closer now."],
  rival_death: ["A rival ended them before. Again.", "Cut down once. Cut down again."],
  win:         ["Finished it once. The ending is lost.", "Reached the end before. Which end?"]
};

function getRivalLastWord(endType) {
  var pool = _RIVAL_LAST_WORDS[endType] || ["No echo. They left nothing behind."];
  return pool[Math.floor(Math.random() * pool.length)];
}
