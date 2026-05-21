// keyboard.js — arrow grid navigation, Enter/Escape for dialogs, Space/Enter action bar hold

(function () {

  // ── Game action grid ─────────────────────────────────────────────────────────
  var _GRID = [
    ['button_attack', 'button_roll',  'button_block'],
    ['button_grab',   'button_sleep', 'button_speak'],
    ['button_cast',   'button_pray',  'button_curse'],
  ];
  var _GRID_IDS = _GRID.reduce(function (s, r) {
    r.forEach(function (id) { s[id] = true; });
    return s;
  }, {});

  // Entry point per arrow direction when nothing is focused: land at the grid edge in that direction
  var _GRID_ENTRY = {
    ArrowUp:    [0, 1],  // top-center    = button_roll
    ArrowDown:  [2, 1],  // bottom-center = button_pray
    ArrowLeft:  [1, 0],  // middle-left   = button_grab
    ArrowRight: [1, 2],  // middle-right  = button_speak
  };

  function _gridPos(id) {
    for (var r = 0; r < _GRID.length; r++) {
      var c = _GRID[r].indexOf(id);
      if (c !== -1) return [r, c];
    }
    return null;
  }

  function _gridEnabled(id) {
    var el = document.getElementById(id);
    return el && !el.disabled && el.offsetParent !== null;
  }

  function _gridMove(id, dr, dc) {
    var pos = _gridPos(id);
    if (!pos) return;
    var r = pos[0], c = pos[1];
    for (var i = 0; i < 9; i++) {
      r = (r + dr + 3) % 3;
      c = (c + dc + 3) % 3;
      if (_gridEnabled(_GRID[r][c])) { document.getElementById(_GRID[r][c]).focus(); return; }
      if (r === pos[0] && c === pos[1]) break;
    }
  }

  function _gridEnter(key) {
    var entry = _GRID_ENTRY[key];
    if (_gridEnabled(_GRID[entry[0]][entry[1]])) {
      document.getElementById(_GRID[entry[0]][entry[1]]).focus();
      return;
    }
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        if (_gridEnabled(_GRID[r][c])) { document.getElementById(_GRID[r][c]).focus(); return; }
      }
    }
  }

  // ── Menu linear navigation ────────────────────────────────────────────────────
  function _menuButtons() {
    var menuEl = document.getElementById('id_menu');
    if (!menuEl) return [];
    // Find the currently visible screen
    var screens = menuEl.querySelectorAll('[id$="_screen"]');
    var screen = null;
    for (var i = 0; i < screens.length; i++) {
      if (screens[i].style.display !== 'none') { screen = screens[i]; break; }
    }
    var root = screen || menuEl;
    // Include buttons, focusable segment divs, and text inputs
    var all = root.querySelectorAll('button, [tabindex="0"], input, textarea');
    return Array.prototype.filter.call(all, function (el) {
      return el.offsetParent !== null && !el.disabled; // excludes hidden/disabled elements
    });
  }

  function _menuNav(key) {
    var btns = _menuButtons();
    if (!btns.length) return;
    var idx   = Array.prototype.indexOf.call(btns, document.activeElement);
    var goFwd = key === 'ArrowDown' || key === 'ArrowRight';
    var target;
    if (idx === -1) {
      target = btns[goFwd ? 0 : btns.length - 1];
    } else {
      target = btns[(idx + (goFwd ? 1 : -1) + btns.length) % btns.length];
    }
    target.focus();
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') target.select();
    target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function _overlayUp(id) {
    var el = document.getElementById(id);
    return el && el.style.display !== 'none';
  }

  function _click(id) {
    var el = document.getElementById(id);
    if (el) el.click();
  }

  function _overlayNav(overlayId, key) {
    var active = document.activeElement;
    var el = document.getElementById(overlayId);
    if (!el) return;
    var items = Array.prototype.filter.call(el.querySelectorAll('button, input, textarea'), function (b) {
      return b.offsetParent !== null && !b.disabled;
    });
    if (!items.length) return;
    var idx = Array.prototype.indexOf.call(items, active);
    var goFwd = key === 'ArrowDown';
    var target = idx === -1 ? items[goFwd ? 0 : items.length - 1]
                            : items[(idx + (goFwd ? 1 : -1) + items.length) % items.length];
    target.focus();
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') target.select();
  }

  // ── Keydown ───────────────────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    var key = e.key;
    var id  = document.activeElement ? document.activeElement.id : '';

    // Overlays — highest priority
    if (_overlayUp('swap_overlay')) {
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        var _swapOl = document.getElementById('swap_overlay');
        var _swapAe = document.activeElement;
        if (_swapAe && _swapAe.tagName === 'BUTTON' && _swapOl && _swapOl.contains(_swapAe)) { _swapAe.click(); } else { _click('swap_confirm'); }
      }
      if (key === 'Escape')                         { e.preventDefault(); _click('swap_cancel');  }
      if (key === 'ArrowUp' || key === 'ArrowDown') { e.preventDefault(); _overlayNav('swap_overlay', key); }
      return;
    }
    if (_overlayUp('nickname_overlay')) {
      if (key === 'Enter' || (key === ' ' && document.activeElement && document.activeElement.tagName === 'BUTTON')) {
        e.preventDefault();
        var _nickOl = document.getElementById('nickname_overlay');
        var _nickAe = document.activeElement;
        if (_nickAe && _nickAe.tagName === 'BUTTON' && _nickOl && _nickOl.contains(_nickAe)) { _nickAe.click(); } else { _click('nickname_confirm'); }
      }
      if (key === 'Escape')                         { e.preventDefault(); _click('nickname_skip');    }
      if (key === 'ArrowUp' || key === 'ArrowDown') { e.preventDefault(); _overlayNav('nickname_overlay', key); }
      return;
    }
    if (_overlayUp('companion_name_overlay')) {
      if (key === 'Enter' || (key === ' ' && document.activeElement && document.activeElement.tagName === 'BUTTON')) {
        e.preventDefault();
        var _compOl = document.getElementById('companion_name_overlay');
        var _compAe = document.activeElement;
        if (_compAe && _compAe.tagName === 'BUTTON' && _compOl && _compOl.contains(_compAe)) { _compAe.click(); } else { _click('companion_name_confirm'); }
      }
      if (key === 'Escape')                         { e.preventDefault(); _click('companion_name_skip');    }
      if (key === 'ArrowUp' || key === 'ArrowDown') { e.preventDefault(); _overlayNav('companion_name_overlay', key); }
      return;
    }

    // Escape during active action bar → cancel
    if (key === 'Escape' && _GRID_IDS[id]) {
      ActionBar.cancelActionBar();
      e.preventDefault();
      return;
    }

    // Escape → toggle main menu
    if (key === 'Escape') {
      var curtainEl = document.getElementById('id_fullscreen_curtain');
      if (curtainEl && curtainEl.style.display !== 'none') return; // transition in progress
      var gameEl = document.getElementById('id_game');
      var menuEl = document.getElementById('id_menu');
      if (gameEl && gameEl.style.display !== 'none') {
        // In game — open menu
        e.preventDefault();
        _click('button_menu');
      } else if (menuEl && menuEl.style.display !== 'none') {
        // In menu — back or resume
        e.preventDefault();
        var backBtn = menuEl.querySelector('[id$="_back"]:not([style*="display: none"]):not([style*="display:none"])');
        if (backBtn && backBtn.offsetParent !== null) {
          backBtn.click();
        } else {
          var cont = document.getElementById('menu_continue');
          if (cont && cont.offsetParent !== null) _click('menu_continue');
        }
      }
      return;
    }

    // Enter / Space on focusable divs (tabindex="0") — treat like a click
    if ((key === 'Enter' || key === ' ') && document.activeElement && document.activeElement.getAttribute('tabindex') === '0') {
      e.preventDefault();
      document.activeElement.click();
      return;
    }

    // Arrow keys — always prevent scroll; let inputs handle left/right cursor movement
    var isArrow = key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown';
    var tag = document.activeElement && document.activeElement.tagName;
    if ((key === 'ArrowLeft' || key === 'ArrowRight') && (tag === 'INPUT' || tag === 'TEXTAREA')) return;
    if (isArrow) {
      e.preventDefault();
      var gameEl = document.getElementById('id_game');
      if (gameEl && gameEl.style.display !== 'none') {
        if (_GRID_IDS[id]) {
          if (key === 'ArrowLeft')  _gridMove(id,  0, -1);
          if (key === 'ArrowRight') _gridMove(id,  0,  1);
          if (key === 'ArrowUp')    _gridMove(id, -1,  0);
          if (key === 'ArrowDown')  _gridMove(id,  1,  0);
        } else {
          _gridEnter(key);
        }
      } else {
        _menuNav(key);
      }
      return;
    }

    // Space / Enter on action button → start action bar (pointerdown)
    if ((key === ' ' || key === 'Enter') && _GRID_IDS[id]) {
      e.preventDefault();
      document.activeElement.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isPrimary: true })
      );
    }
    // Space / Enter on hold-to-confirm buttons → start hold (pointerdown on element)
    if ((key === ' ' || key === 'Enter') && id === 'menu_settings_purge_1') {
      e.preventDefault();
      document.activeElement.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isPrimary: true })
      );
    }
  });

  // ── Keyup ─────────────────────────────────────────────────────────────────────
  document.addEventListener('keyup', function (e) {
    var key = e.key;
    var id  = document.activeElement ? document.activeElement.id : '';

    // Space / Enter on action button → resolve action bar (pointerup)
    if ((key === ' ' || key === 'Enter') && _GRID_IDS[id]) {
      e.preventDefault();
      document.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, cancelable: true, isPrimary: true })
      );
    }
    // Space / Enter on hold-to-confirm buttons → cancel/complete hold (pointerup on element)
    if ((key === ' ' || key === 'Enter') && id === 'menu_settings_purge_1') {
      e.preventDefault();
      document.activeElement.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, cancelable: true, isPrimary: true })
      );
    }
  });

})();
