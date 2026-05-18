// Action Bar Minigame
// showActionBar(config, onResolve) — shows bar, starts ping-pong cursor, resolves on pointerup
// hideActionBar()                  — cancel immediately (e.g. on removeClickListeners)
// getAttemptValue()                — current cursor position 0–100

var ActionBar = (function () {

  // ── UI Labels ───────────────────────────────────────────────────────────
  var LABEL_SUCCESS     = 'Success';
  var LABEL_FAIL        = 'Failed';
  var LABEL_CRIT_SUCESS = 'CRITICAL!';
  var LABEL_CRIT_FAIL   = 'FAILED!';
  var LABEL_CANCEL      = 'Canceled';
  // ──────────────────────────────────────────────────────────────────────────

  // ── Timing (ms) ───────────────────────────────────────────────────────────
  var T_BAR_SHOW       =  120;  // bar fade-in when action bar opens
  var T_CURSOR_SNAP    =   70;  // cursor glide to resting position on release
  var T_RESULT_FADE_IN =  300;  // result overlay fade-in (longer = smoother reveal)
  var T_RESULT_HOLD    =  800;  // how long the result stays fully visible
  var T_BAR_FADEOUT    =  220;  // bar + result fade-out together after hold
  var T_CANCEL_FADE    =  150;  // fade-out on cancel (no result shown)
  var T_CANCEL_HOLD    =  800;  // how long "Canceled" result stays visible
  var T_TAP_CANCEL     =  180;  // min hold time before release counts (tap-to-cancel guard)
  // ──────────────────────────────────────────────────────────────────────────

  var _config    = null;
  var _raf       = null;
  var _value     = 0;      // 0–100
  var _dir       = 1;      // 1 = right, -1 = left
  var _lastTs    = null;
  var _startTs   = 0;      // timestamp when bar opened (for tap-cancel guard)
  var _running   = false;
  var _onResolve = null;
  var _sourceEl  = null;   // button that triggered the bar (for out-of-bounds cancel)
  var _isOutside = false;  // pointer currently outside the source button
  var _hasCrits  = false;  // whether crit zones are active this bar
  var _csMin     = -1;     // crit success zone min
  var _csMax     = -1;     // crit success zone max
  var _cfw       = 0;      // crit fail edge width (each side)

  var _elBar, _elTrack, _elCursor, _elCancel, _elResult;
  var _lastZone = 0; // 0=fail, 1=success, 2=crit

  function _init() {
    _elBar    = document.getElementById('id_action_bar');
    _elTrack  = document.getElementById('id_action_bar_track');
    _elCursor = document.getElementById('id_action_bar_cursor');
    _elCancel = document.getElementById('id_action_bar_cancel');
    _elResult = document.getElementById('id_action_bar_result');
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
    _startTs   = Date.now();
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
    } else if (config.dangerZones && config.dangerZones.length > 0) {
      var _sorted = config.dangerZones.slice().sort(function(a, b) { return a.min - b.min; });
      var _parts = [_failFill + ' 0%, ' + _failFill + ' ' + sm + '%'];
      var _prev = sm;
      for (var _di = 0; _di < _sorted.length; _di++) {
        var _dz = _sorted[_di];
        if (_dz.min > _prev) _parts.push(_successFill + ' ' + _prev + '%, ' + _successFill + ' ' + _dz.min + '%');
        _parts.push(_failFill + ' ' + _dz.min + '%, ' + _failFill + ' ' + _dz.max + '%');
        _prev = _dz.max;
      }
      if (_prev < sx) _parts.push(_successFill + ' ' + _prev + '%, ' + _successFill + ' ' + sx + '%');
      _parts.push(_failFill + ' ' + sx + '%, ' + _failFill + ' 100%');
      bg = 'linear-gradient(to right, ' + _parts.join(', ') + ')';
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
      _elBar.style.transition = 'opacity ' + T_BAR_SHOW + 'ms';
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
      var _dzTick = _config.dangerZones || [];
      for (var _dti = 0; _dti < _dzTick.length; _dti++) {
        if (_value >= _dzTick[_dti].min && _value <= _dzTick[_dti].max) { curZone = 0; break; }
      }
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
    if (_isOutside || Date.now() - _startTs < T_TAP_CANCEL) { _cancel(); } else { _resolve(); }
  }

  function _onPointerUp(e) {
    document.removeEventListener('pointermove',   _onPointerMove);
    document.removeEventListener('pointercancel', _onPointerCancel);
    if (!_running) return;
    if (_isOutside || Date.now() - _startTs < T_TAP_CANCEL) { _cancel(); return; }
    _resolve();
  }

  function _resolve() {
    _running = false;
    cancelAnimationFrame(_raf);
    if (_elCancel) _elCancel.classList.remove('visible');

    var val = _value;
    var _inDanger = false;
    var _dzList = _config.dangerZones || [];
    for (var _dri = 0; _dri < _dzList.length; _dri++) {
      if (val >= _dzList[_dri].min && val <= _dzList[_dri].max) { _inDanger = true; break; }
    }
    var isSuccess = val >= _config.successMin && val <= _config.successMax && !_inDanger;

    var critResult = null;
    if (_hasCrits) {
      if (isSuccess && val >= _csMin && val <= _csMax) {
        critResult = 'success';
      } else if (!isSuccess && (val <= _cfw || val >= (100 - _cfw))) {
        critResult = 'fail';
      }
    }

    vibrateButtonPress();

    _elCursor.style.transition = 'left ' + T_CURSOR_SNAP + 'ms ease-out';
    _elCursor.classList.add('action-bar-snap');

    var flashClass = isSuccess
      ? (critResult === 'success' ? 'action-bar-flash-crit-success' : 'action-bar-flash-success')
      : (critResult === 'fail'    ? 'action-bar-flash-crit-fail'    : 'action-bar-flash-fail');
    _elTrack.classList.add(flashClass);

    if (_elResult) {
      var resultClass, resultText;
      if (critResult === 'success') {
        resultClass = 'result-crit-pass'; resultText = LABEL_CRIT_SUCESS;
      } else if (critResult === 'fail') {
        resultClass = 'result-crit-fail'; resultText = LABEL_CRIT_FAIL;
      } else if (isSuccess) {
        resultClass = 'result-pass'; resultText = LABEL_SUCCESS;
      } else {
        resultClass = 'result-fail'; resultText = LABEL_FAIL;
      }
      _elResult.textContent = resultText;
      _elResult.classList.add(resultClass);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          _elResult.style.transition = 'opacity ' + T_RESULT_FADE_IN + 'ms ease';
          _elResult.style.opacity = '1';
        });
      });
    }

    setTimeout(function () {
      _elTrack.classList.remove('action-bar-flash-success', 'action-bar-flash-fail',
                                 'action-bar-flash-crit-success', 'action-bar-flash-crit-fail');
      if (_elResult) {
        _elResult.style.transition = 'opacity ' + T_BAR_FADEOUT + 'ms';
        _elResult.style.opacity = '0';
      }
      _elBar.style.transition = 'opacity ' + T_BAR_FADEOUT + 'ms';
      _elBar.style.opacity    = '0';
      setTimeout(function () {
        _elBar.style.display = 'none';
        _elCursor.classList.remove('action-bar-snap');
        _clearResult();
        if (_onResolve) _onResolve(isSuccess, val, critResult);
      }, T_BAR_FADEOUT);
    }, T_RESULT_HOLD);
  }

  function _cleanupListeners() {
    document.removeEventListener('pointermove',   _onPointerMove);
    document.removeEventListener('pointerup',     _onPointerUp);
    document.removeEventListener('pointercancel', _onPointerCancel);
    document.removeEventListener('touchmove',     _onTouchMove);
    document.removeEventListener('touchend',      _onTouchEnd);
  }

  function _clearResult() {
    if (!_elResult) return;
    _elResult.style.opacity = '';
    _elResult.className = '';
    _elResult.textContent = '';
  }

  function _cancel() {
    _running = false;
    cancelAnimationFrame(_raf);
    _cleanupListeners();
    if (_elCancel) _elCancel.classList.remove('visible');

    if (_elResult) {
      _elResult.textContent = LABEL_CANCEL;
      _elResult.classList.add('result-cancel');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          _elResult.style.transition = 'opacity ' + T_RESULT_FADE_IN + 'ms ease';
          _elResult.style.opacity = '1';
        });
      });
    }

    setTimeout(function () {
      if (_elResult) {
        _elResult.style.transition = 'opacity ' + T_BAR_FADEOUT + 'ms';
        _elResult.style.opacity = '0';
      }
      if (_elBar) {
        _elBar.style.transition = 'opacity ' + T_BAR_FADEOUT + 'ms';
        _elBar.style.opacity    = '0';
      }
      setTimeout(function () {
        if (_elBar) _elBar.style.display = 'none';
        _clearResult();
      }, T_BAR_FADEOUT);
    }, T_CANCEL_HOLD);
  }

  function hideActionBar() {
    _running = false;
    cancelAnimationFrame(_raf);
    _cleanupListeners();
    _clearResult();
    if (_elCancel) _elCancel.classList.remove('visible');
    if (_elBar) { _elBar.style.opacity = '0'; _elBar.style.display = 'none'; }
  }

  function cancelActionBar() { if (_running) _cancel(); }

  function getAttemptValue() { return _value; }

  return { showActionBar: showActionBar, hideActionBar: hideActionBar, cancelActionBar: cancelActionBar, getAttemptValue: getAttemptValue };
})();
