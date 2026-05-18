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

  function _gridMove(id, dr, dc) {
    var pos = _gridPos(id);
    if (!pos) return;
    var el = document.getElementById(_GRID[(pos[0] + dr + 3) % 3][(pos[1] + dc + 3) % 3]);
    if (el) el.focus();
  }

  function _gridEnter(key) {
    var entry = _GRID_ENTRY[key];
    var el = document.getElementById(_GRID[entry[0]][entry[1]]);
    if (el) el.focus();
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
    // Include both <button> elements and focusable segment divs (tabindex="0")
    var all = root.querySelectorAll('button, [tabindex="0"]');
    return Array.prototype.filter.call(all, function (el) {
      return el.offsetParent !== null; // excludes hidden elements
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

  // ── Keydown ───────────────────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    var key = e.key;
    var id  = document.activeElement ? document.activeElement.id : '';

    // Overlays — highest priority
    if (_overlayUp('swap_overlay')) {
      if (key === 'Enter')  { e.preventDefault(); _click('swap_confirm'); }
      if (key === 'Escape') { e.preventDefault(); _click('swap_cancel');  }
      return;
    }
    if (_overlayUp('nickname_overlay')) {
      if (key === 'Enter')  { e.preventDefault(); _click('nickname_confirm'); }
      if (key === 'Escape') { e.preventDefault(); _click('nickname_skip');    }
      return;
    }
    if (_overlayUp('companion_name_overlay')) {
      if (key === 'Enter')  { e.preventDefault(); _click('companion_name_confirm'); }
      if (key === 'Escape') { e.preventDefault(); _click('companion_name_skip');    }
      return;
    }

    // Enter / Space on focusable divs (tabindex="0") — treat like a click
    if ((key === 'Enter' || key === ' ') && document.activeElement && document.activeElement.getAttribute('tabindex') === '0') {
      e.preventDefault();
      document.activeElement.click();
      return;
    }

    // Arrow keys — always prevent scroll, but let inputs handle their own cursor
    var isArrow = key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown';
    var tag = document.activeElement && document.activeElement.tagName;
    if (isArrow && (tag === 'INPUT' || tag === 'TEXTAREA')) return;
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
  });

})();
