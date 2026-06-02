var LootChoiceManager = (function() {
  var _active = false;
  var _onPick = null;

  // Convert a CSV row array to an item snapshot (same shape as buildItemSnapshot())
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
    return RarityManager.getTierForItemNet(RarityManager.calcNet(data), data);
  }

  function _highestTier(items) {
    var order = ['Legendary', 'Rare', 'Uncommon', 'Common', 'Cursed'];
    var vals   = { Legendary: 5, Rare: 4, Uncommon: 3, Common: 2, Cursed: 1 };
    var best   = 'Common';
    items.forEach(function(item) {
      var t = _snapTier(item);
      if ((vals[t] || 0) > (vals[best] || 0)) best = t;
    });
    return best;
  }

  function show(items, context, onPick) {
    if (_active) return;
    _active = true;
    _onPick = onPick;

    var overlay = document.getElementById('loot_choice_overlay');
    var logEl   = document.getElementById('loot_choice_log');
    if (!overlay || !logEl) { _active = false; if (onPick) onPick(items[0]); return; }

    logEl.textContent = getLootChoiceLog(context, _highestTier(items));
    overlay.style.display = 'flex';

    for (var i = 0; i < 3; i++) {
      var card = document.getElementById('loot_card_' + i);
      if (!card) continue;
      card.innerHTML = InventoryManager.renderItemCard(items[i]);
      card.style.backgroundColor = RarityManager.getBg(_snapTier(items[i])) || '';
      card.style.opacity = '0';
      card.style.animation = 'none';
      card.onclick = null;
      card.classList.remove('loot-card-fading', 'loot-card-chosen');
      (function(idx, snap) {
        setTimeout(function() {
          var el = document.getElementById('loot_card_' + idx);
          if (!el) return;
          el.style.animation = 'lootCardReveal 0.28s ease forwards';
          el.onclick = function() { _pick(snap); };
        }, 80 + idx * 300);
      })(i, items[i]);
    }
  }

  function _pick(chosen) {
    if (!_active) return;
    _active = false;

    var overlay = document.getElementById('loot_choice_overlay');
    if (overlay) overlay.style.display = 'none';

    for (var i = 0; i < 3; i++) {
      var card = document.getElementById('loot_card_' + i);
      if (card) card.onclick = null;
    }

    var cb = _onPick;
    _onPick = null;
    if (cb) cb(chosen);
  }

  return { show: show, snapFromRow: snapFromRow };
})();
