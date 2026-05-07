// Action Bar Minigame
// showActionBar(config, onResolve) — shows bar, starts ping-pong cursor, resolves on pointerup
// hideActionBar()                  — cancel immediately (e.g. on removeClickListeners)
// getAttemptValue()                — current cursor position 0–100

var ActionBar = (function () {
  var _config    = null;
  var _raf       = null;
  var _value     = 0;      // 0–100
  var _dir       = 1;      // 1 = right, -1 = left
  var _lastTs    = null;
  var _running   = false;
  var _onResolve = null;
  var _sourceEl  = null;   // button that triggered the bar (for out-of-bounds cancel)
  var _isOutside = false;  // pointer currently outside the source button
  var _hasCrits  = false;  // whether crit zones are active this bar
  var _csMin     = -1;     // crit success zone min
  var _csMax     = -1;     // crit success zone max
  var _cfw       = 0;      // crit fail edge width (each side)

  var _elBar, _elTrack, _elCursor, _elCancel;
  var _lastZone = 0; // 0=fail, 1=success, 2=crit

  function _init() {
    _elBar    = document.getElementById('id_action_bar');
    _elTrack  = document.getElementById('id_action_bar_track');
    _elCursor = document.getElementById('id_action_bar_cursor');
    _elCancel = document.getElementById('id_action_bar_cancel');
  }

  function showActionBar(config, onResolve, sourceEl) {
    if (!_elBar) _init();
    if (_running) return;          // already active — ignore double press

    _config    = config;
    _onResolve = onResolve;
    _sourceEl  = sourceEl || null;
    _isOutside = false;
    _value     = 0;
    _dir       = 1;
    _running   = true;
    _lastTs    = null;
    _lastZone  = 0;

    // Determine crit zones
    _csMin    = (config.critSuccessMin !== undefined) ? config.critSuccessMin : -1;
    _csMax    = (config.critSuccessMax !== undefined) ? config.critSuccessMax : -1;
    _cfw      = (config.critFailW      !== undefined) ? config.critFailW      : 0;
    _hasCrits = _csMin >= 0 && _csMax > _csMin && _cfw > 0
                && config.successMin > _cfw && config.successMax < (100 - _cfw);

    // Build gradient: [crit-fail] fail | success [crit-success] success | fail [crit-fail]
    var sm = config.successMin, sx = config.successMax;
    var _successFill = (config.barStyle === 'dark') ? '#621010' : '#1a6b2e';
    var _failFill    = (config.barStyle === 'dark') ? '#200808' : '#621010';
    var bg;
    if (_hasCrits) {
      var cfL = _cfw, cfR = 100 - _cfw;
      bg = 'linear-gradient(to right,'
        + ' #200808 0%, #200808 ' + cfL + '%,'
        + ' ' + _failFill + ' ' + cfL + '%, ' + _failFill + ' ' + sm + '%,'
        + ' ' + _successFill + ' ' + sm + '%, ' + _successFill + ' ' + _csMin + '%,'
        + ' #b89000 ' + _csMin + '%, #b89000 ' + _csMax + '%,'
        + ' ' + _successFill + ' ' + _csMax + '%, ' + _successFill + ' ' + sx + '%,'
        + ' ' + _failFill + ' ' + sx + '%, ' + _failFill + ' ' + cfR + '%,'
        + ' #200808 ' + cfR + '%, #200808 100%)';
    } else {
      bg = 'linear-gradient(to right,'
        + ' ' + _failFill + ' 0%, ' + _failFill + ' ' + sm + '%,'
        + ' ' + _successFill + ' ' + sm + '%, ' + _successFill + ' ' + sx + '%,'
        + ' ' + _failFill + ' ' + sx + '%, ' + _failFill + ' 100%)';
    }
    _elTrack.style.background = bg;

    _elCursor.style.transition = 'none';
    _elCursor.style.left = '0%';
    _elCursor.classList.remove('action-bar-snap');
    _elTrack.classList.remove('action-bar-flash-success', 'action-bar-flash-fail',
                               'action-bar-flash-crit-success', 'action-bar-flash-crit-fail');

    _elBar.style.opacity = '0';
    _elBar.style.display = 'block';
    requestAnimationFrame(function () {
      _elBar.style.transition = 'opacity 0.12s';
      _elBar.style.opacity    = '1';
    });

    document.addEventListener('pointermove',   _onPointerMove);
    document.addEventListener('pointerup',     _onPointerUp,     { once: true });
    document.addEventListener('pointercancel', _onPointerCancel, { once: true });

    _raf = requestAnimationFrame(_tick);
  }

  function _tick(ts) {
    if (!_running) return;
    if (_lastTs === null) _lastTs = ts;
    var dt = (ts - _lastTs) / 1000;
    _lastTs = ts;

    _value += _dir * _config.speed * dt;
    if (_value >= 100) { _value = 100; _dir = -1; }
    if (_value <= 0)   { _value = 0;   _dir =  1; }

    _elCursor.style.left = _value.toFixed(1) + '%';

    // Zone transition haptics
    var curZone = 0; // 0=fail, 1=success, 2=crit
    if (_value >= _config.successMin && _value <= _config.successMax) {
      curZone = 1;
      if (_hasCrits && _value >= _csMin && _value <= _csMax) curZone = 2;
    }

    if (curZone !== _lastZone) {
      _lastZone = curZone;
      if (typeof vibrateTick === 'function') vibrateTick();
    }

    _raf = requestAnimationFrame(_tick);
  }

  function _checkBounds(x, y) {
    if (!_sourceEl) return false;
    var rect = _sourceEl.getBoundingClientRect();
    return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
  }

  function _setOutside(outside) {
    if (outside === _isOutside) return;
    _isOutside = outside;
    _elCancel.classList.toggle('visible', _isOutside);
  }

  // Normal pointer path (no scroll interference)
  function _onPointerMove(e) {
    if (!_running || !_sourceEl) return;
    _setOutside(_checkBounds(e.clientX, e.clientY));
  }

  // Browser took over the touch (scroll) — pointer events die, switch to touch events
  function _onPointerCancel() {
    document.removeEventListener('pointermove', _onPointerMove);
    document.removeEventListener('pointerup',   _onPointerUp);
    _setOutside(true);
    document.addEventListener('touchmove', _onTouchMove);
    document.addEventListener('touchend',  _onTouchEnd, { once: true });
  }

  // Track finger position during scroll to allow returning to button
  function _onTouchMove(e) {
    if (!_running || !_sourceEl) return;
    var t = e.changedTouches[0];
    if (t) _setOutside(_checkBounds(t.clientX, t.clientY));
  }

  // Finger lifted after scroll — resolve or cancel based on final position
  function _onTouchEnd(e) {
    document.removeEventListener('touchmove', _onTouchMove);
    if (!_running) return;
    var t = e.changedTouches[0];
    if (t) _setOutside(_checkBounds(t.clientX, t.clientY));
    if (_isOutside) { _cancel(); } else { _resolve(); }
  }

  function _onPointerUp(e) {
    document.removeEventListener('pointermove',   _onPointerMove);
    document.removeEventListener('pointercancel', _onPointerCancel);
    if (!_running) return;
    if (_isOutside) { _cancel(); return; }
    _resolve();
  }

  function _resolve() {
    _running = false;
    cancelAnimationFrame(_raf);
    if (_elCancel) _elCancel.classList.remove('visible');

    var val       = _value;
    var isSuccess = val >= _config.successMin && val <= _config.successMax;

    var critResult = null;
    if (_hasCrits) {
      if (isSuccess && val >= _csMin && val <= _csMax) {
        critResult = 'success';
      } else if (!isSuccess && (val <= _cfw || val >= (100 - _cfw))) {
        critResult = 'fail';
      }
    }

    vibrateButtonPress();

    _elCursor.style.transition = 'left 0.07s ease-out';
    _elCursor.classList.add('action-bar-snap');

    var flashClass = isSuccess
      ? (critResult === 'success' ? 'action-bar-flash-crit-success' : 'action-bar-flash-success')
      : (critResult === 'fail'    ? 'action-bar-flash-crit-fail'    : 'action-bar-flash-fail');
    _elTrack.classList.add(flashClass);

    setTimeout(function () {
      _elTrack.classList.remove('action-bar-flash-success', 'action-bar-flash-fail',
                                 'action-bar-flash-crit-success', 'action-bar-flash-crit-fail');
      _elBar.style.transition = 'opacity 0.22s';
      _elBar.style.opacity    = '0';
      setTimeout(function () {
        _elBar.style.display = 'none';
        _elCursor.classList.remove('action-bar-snap');
        if (_onResolve) _onResolve(isSuccess, val, critResult);
      }, 220);
    }, 300);
  }

  function _cleanupListeners() {
    document.removeEventListener('pointermove',   _onPointerMove);
    document.removeEventListener('pointerup',     _onPointerUp);
    document.removeEventListener('pointercancel', _onPointerCancel);
    document.removeEventListener('touchmove',     _onTouchMove);
    document.removeEventListener('touchend',      _onTouchEnd);
  }

  function _cancel() {
    _running = false;
    cancelAnimationFrame(_raf);
    _cleanupListeners();
    if (_elCancel) _elCancel.classList.remove('visible');
    if (_elBar) {
      _elBar.style.transition = 'opacity 0.15s';
      _elBar.style.opacity    = '0';
      setTimeout(function () { _elBar.style.display = 'none'; }, 150);
    }
  }

  function hideActionBar() {
    _running = false;
    cancelAnimationFrame(_raf);
    _cleanupListeners();
    if (_elCancel) _elCancel.classList.remove('visible');
    if (_elBar) { _elBar.style.opacity = '0'; _elBar.style.display = 'none'; }
  }

  function getAttemptValue() { return _value; }

  return { showActionBar: showActionBar, hideActionBar: hideActionBar, getAttemptValue: getAttemptValue };
})();
