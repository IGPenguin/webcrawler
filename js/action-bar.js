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

  var _elBar, _elTrack, _elCursor;

  function _init() {
    _elBar    = document.getElementById('id_action_bar');
    _elTrack  = document.getElementById('id_action_bar_track');
    _elCursor = document.getElementById('id_action_bar_cursor');
  }

  function showActionBar(config, onResolve) {
    if (!_elBar) _init();
    if (_running) return;          // already active — ignore double press

    _config    = config;
    _onResolve = onResolve;
    _value     = 0;
    _dir       = 1;
    _running   = true;
    _lastTs    = null;

    // Gradient: fail | success zone | fail
    _elTrack.style.background =
      'linear-gradient(to right,'
      + ' #621010 0%,          #621010 '  + config.successMin + '%,'
      + ' #1a6b2e '                        + config.successMin + '%, #1a6b2e ' + config.successMax + '%,'
      + ' #621010 '                        + config.successMax + '%, #621010 100%)';

    _elCursor.style.transition = 'none';
    _elCursor.style.left = '0%';
    _elCursor.classList.remove('action-bar-snap');
    _elTrack.classList.remove('action-bar-flash-success', 'action-bar-flash-fail');

    _elBar.style.opacity = '0';
    _elBar.style.display = 'block';
    requestAnimationFrame(function () {
      _elBar.style.transition = 'opacity 0.12s';
      _elBar.style.opacity    = '1';
    });

    document.addEventListener('pointerup',     _onPointerUp, { once: true });
    document.addEventListener('pointercancel', _onPointerUp, { once: true });

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
    _raf = requestAnimationFrame(_tick);
  }

  function _onPointerUp() {
    document.removeEventListener('pointercancel', _onPointerUp);
    if (!_running) return;
    _running = false;
    cancelAnimationFrame(_raf);

    var val       = _value;
    var isSuccess = val >= _config.successMin && val <= _config.successMax;

    vibrateButtonPress();

    // Snap cursor in place
    _elCursor.style.transition = 'left 0.07s ease-out';
    _elCursor.classList.add('action-bar-snap');

    // Flash track border
    _elTrack.classList.add(isSuccess ? 'action-bar-flash-success' : 'action-bar-flash-fail');

    setTimeout(function () {
      _elTrack.classList.remove('action-bar-flash-success', 'action-bar-flash-fail');
      _elBar.style.transition = 'opacity 0.22s';
      _elBar.style.opacity    = '0';
      setTimeout(function () {
        _elBar.style.display = 'none';
        _elCursor.classList.remove('action-bar-snap');
        if (_onResolve) _onResolve(isSuccess, val);
      }, 220);
    }, 300);
  }

  function hideActionBar() {
    _running = false;
    cancelAnimationFrame(_raf);
    document.removeEventListener('pointerup',     _onPointerUp);
    document.removeEventListener('pointercancel', _onPointerUp);
    if (_elBar) { _elBar.style.opacity = '0'; _elBar.style.display = 'none'; }
  }

  function getAttemptValue() { return _value; }

  return { showActionBar: showActionBar, hideActionBar: hideActionBar, getAttemptValue: getAttemptValue };
})();
