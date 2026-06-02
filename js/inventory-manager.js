var InventoryManager = (function() {

  function _doSwap(slot, oldData, newSnap, capturedFishing) {
    playerLootString = String(playerLootString).replace(oldData.emoji, "");
    if (!playerLootString.length) playerLootString = [""];
    playerInventory = playerInventory.filter(function(i) { return i.slot !== slot; });
    playerLck    -= oldData.lck;
    playerInt    -= oldData.int;
    playerMgkMax -= oldData.mgk; playerMgk -= oldData.mgk; if (playerMgk < 0) playerMgk = 0;
    playerStaMax -= oldData.sta; playerSta -= oldData.sta; if (playerSta < 0) playerSta = 0;
    playerAtk    -= oldData.atk;
    playerDef    -= oldData.def; if (playerDef < 0) playerDef = 0;
    playerHpMax  -= oldData.hp;
    playerHp     -= oldData.hp;
    if (playerHp > playerHpMax) playerHp = playerHpMax;
    if (playerHp < 1) playerHp = 1;
    logPlayerAction(actionString, "Replaced " + oldData.emoji + " <b>" + oldData.name + "</b>");
    playerLootString += newSnap.emoji;
    displayPlayerGainedEffect();
    setPlayerSlot(slot, newSnap);
    playerInventory.push(newSnap);
    AchievementManager.checkGrabAchievement(newSnap);
    isFishing = false;
    if (playerHp == 0) { redraw(); return; }
    var _savedRested = capturedFishing ? playerRested : false;
    playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg);
    if (capturedFishing) playerRested = _savedRested;
  }

  function _snapTier(data) {
    var noteTag = RarityManager.getTierFromNote(data.note || '');
    if (noteTag) return noteTag;
    if ((data.note || '').includes('Artifact')) return 'Legendary';
    return RarityManager.getTierForItemNet(RarityManager.calcNet(data), data);
  }

  function _itemRowHtml(data) {
    var nameColor = RarityManager.getColor(_snapTier(data));
    var descLine = '';
    if (data.desc) {
      var parts = String(data.desc).split(/<br\s*\/?>/i);
      descLine = parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }
    return '<div style="display:flex;align-items:center;gap:6px;padding:14px 0px 4px 8px;">'
      + '<div style="display:flex;align-items:center;justify-content:center;flex-shrink:0;width:42px;align-self:center;">'
        + '<span style="font-size:28px;line-height:1;">' + data.emoji + '</span>'
      + '</div>'
      + '<div style="flex:1;min-width:0;text-align:left;">'
        + '<div style="font-size:15px;font-weight:600;color:' + nameColor + ';-webkit-text-stroke:2px #000;paint-order:stroke fill;">' + (data.name || '?') + '</div>'
        + (descLine ? '<div style="font-size:14px;color:#fff;opacity:1;line-height:1.4;margin-top:2px;">' + descLine + '</div>' : '')
      + '</div>'
      + '</div>';
  }

  function showSwapDialog(oldData, newData, onConfirm, onCancel) {
    var overlay    = document.getElementById('swap_overlay');
    var curEl      = document.getElementById('swap_current_row');
    var newEl      = document.getElementById('swap_new_row');
    var diffEl     = document.getElementById('swap_diff_row');
    var confirmBtn = document.getElementById('swap_confirm');
    var cancelBtn  = document.getElementById('swap_cancel');

    var statPairs = [
      [newData.atk - oldData.atk, '⚔️'],
      [newData.mgk - oldData.mgk, '🔵'],
      [newData.hp  - oldData.hp,  '❤️'],
      [newData.sta - oldData.sta, '🟢'],
      [newData.lck - oldData.lck, '🍀'],
      [newData.int - oldData.int, '🧠'],
      [newData.def - oldData.def, '🔰']
    ];
    var diffParts = [];
    statPairs.forEach(function(p) {
      if (p[0] === 0) return;
      var color = p[0] > 0 ? '#4caf50' : '#f44336';
      diffParts.push('<span style="color:' + color + ';">' + (p[0] > 0 ? '+' : '') + p[0] + ' ' + p[1] + '</span>');
    });

    curEl.innerHTML = _itemRowHtml(oldData);
    curEl.style.backgroundColor = RarityManager.getBg(_snapTier(oldData)) || '';
    newEl.innerHTML = _itemRowHtml(newData);
    newEl.style.backgroundColor = RarityManager.getBg(_snapTier(newData)) || '';
    var diffBody = diffParts.length ? diffParts.join('&ensp;') : '<span style="color:#888;">No stats change.</span>';
    diffEl.innerHTML = '<span style="color:#fff;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Stat changes:&ensp;</span>' + diffBody;

    overlay.style.display = 'flex';

    function _confirm() {
      overlay.style.display = 'none';
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      if (onConfirm) onConfirm();
    }
    function _cancel() {
      overlay.style.display = 'none';
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      if (onCancel) onCancel();
    }
    confirmBtn.onclick = _confirm;
    cancelBtn.onclick = _cancel;
  }

  function tryEquip(slot, oldData, newSnap, capturedFishing) {
    showSwapDialog(oldData, newSnap, function() {
      _doSwap(slot, oldData, newSnap, capturedFishing);
    }, null);
  }

  return { tryEquip: tryEquip, showSwapDialog: showSwapDialog, renderItemCard: _itemRowHtml };
})();
