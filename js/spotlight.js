/* ============================================================
   STORE SPOTLIGHT — behaviour
   ------------------------------------------------------------
   A horizontal track: cards follow your finger while you drag,
   rubber-band at the ends, settle with one eased snap.

   The bars beside the section title are the timer made visible.
   The active bar fills left to right over FEATURED_DWELL, and
   the moment it's full the deck advances — so the interface
   tells you what it's about to do instead of surprising you.
   Holding the card freezes the fill exactly where it is; letting
   go resumes from there rather than starting over.
   ============================================================ */

window.Spotlight = (function () {
  'use strict';

  var stage, track, barWrap, slides = [], bars = [];
  var idx = 0, dir = 1, width = 0;
  var timer = null, startedAt = 0, remain = 0, sized = false;
  var held = false, offScreen = false, tabHidden = false, suspended = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Card ───────────────────────────────────── */
  function cardHTML(item) {
    var tags = (item.floors || []).map(function (f) {
      var meta = FLOORS.filter(function (x) { return x.key === f; })[0];
      return '<span class="floor-tag fl-' + f + '">' + esc(meta ? meta.short : f) + '</span>';
    }).join('');

    var mono = item.mono || item.store.charAt(0);
    var img = item.logo
      ? '<img src="' + esc(item.logo) + '" alt="" onerror="this.classList.add(\'is-missing\')">'
      : '';

    return '<article class="spot-card">' +
      '<div class="spot-body">' +
        '<p class="spot-eyebrow">Featured store</p>' +
        '<div class="spot-store">' +
          '<span class="spot-logo">' + img + '<span class="spot-mono">' + esc(mono) + '</span></span>' +
          '<span class="spot-id">' +
            '<span class="spot-name">' + esc(item.store) + '</span>' +
            '<span class="spot-cat">' + esc(item.category) + '</span>' +
          '</span>' +
          '<span class="floor-tags">' + tags + '</span>' +
        '</div>' +
        (item.note ? '<p class="spot-note">' + esc(item.note) + '</p>' : '') +
      '</div>' +
    '</article>';
  }

  /* ── Geometry ───────────────────────────────── */
  function measure() { width = stage.clientWidth; }

  function sizeStage() {
    if (!slides.length) return;
    var h = Math.ceil(slides[idx].getBoundingClientRect().height);
    if (!sized) stage.style.transition = 'none';
    stage.style.height = h + 'px';
    if (!sized) { void stage.offsetHeight; stage.style.transition = ''; sized = true; }
  }

  function place(px, animate) {
    track.style.transition = animate ? '' : 'none';
    track.style.transform = 'translate3d(' + px + 'px,0,0)';
    if (!animate) { void track.offsetWidth; track.style.transition = ''; }
  }

  /* ── Progress bars ──────────────────────────── */
  function fillOf(n) { return bars[n] && bars[n].firstElementChild; }

  /* Only the inactive bars are cleared here. The active bar's fill
     belongs to runFill/freezeFill alone — zeroing it on every
     settle() made a snap-back drag flash the bar empty and refill. */
  function resetBars() {
    bars.forEach(function (b, n) {
      b.classList.toggle('is-on', n === idx);
      b.setAttribute('aria-current', n === idx ? 'true' : 'false');
      var f = b.firstElementChild;
      if (!f) return;
      if (n !== idx) {
        f.style.transition = 'none';
        f.style.transform = 'scaleX(0)';
      } else if (neverPlays()) {
        /* When autoplay will never run, an empty track that never
           fills reads as broken — show the active bar complete.
           Note this asks `neverPlays`, not `canPlay`: a merely
           paused deck must keep its frozen fill, not jump to full. */
        f.style.transition = 'none';
        f.style.transform = 'scaleX(1)';
      }
    });
  }

  /* Where the bar is drawn right now, 0–1, mid-animation or not */
  function currentScale(f) {
    var m = getComputedStyle(f).transform;
    if (!m || m === 'none') return 0;
    var n = m.match(/matrix\(\s*([-\d.]+)/);
    return n ? Math.max(0, Math.min(1, parseFloat(n[1]))) : 0;
  }

  function runFill() {
    var f = fillOf(idx);
    if (!f) return;
    /* Start from whichever is further along: the time left, or where
       the bar is already drawn. Resuming must never rewind it — and
       pause() clamps `remain` upward near the very end of a dwell. */
    var from = Math.max(currentScale(f), 1 - remain / FEATURED_DWELL);
    f.style.transition = 'none';
    f.style.transform = 'scaleX(' + from + ')';
    void f.offsetWidth;
    f.style.transition = 'transform ' + remain + 'ms linear';
    f.style.transform = 'scaleX(1)';
  }

  function freezeFill() {
    var f = fillOf(idx);
    if (!f) return;
    /* Read first: clearing the transition cancels it, and the
       computed value snaps to the target the moment you do. */
    var at = currentScale(f);
    f.style.transition = 'none';
    f.style.transform = 'scaleX(' + at + ')';
  }

  /* ── Timing ─────────────────────────────────────
     `neverPlays` is a standing fact about this page;
     `canPlay` also accounts for the temporary reasons
     the deck might be holding still right now.      */
  function neverPlays() { return reduce || FEATURED.length < 2; }
  function canPlay() {
    return !neverPlays() && !held && !suspended && !offScreen && !tabHidden;
  }
  function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }

  function play() {
    clearTimer();
    if (!canPlay()) return;
    if (remain <= 0) remain = FEATURED_DWELL;
    runFill();
    startedAt = Date.now();
    timer = setTimeout(function () {
      remain = FEATURED_DWELL;
      if (idx + dir > FEATURED.length - 1) dir = -1;
      else if (idx + dir < 0) dir = 1;
      goTo(idx + dir);
    }, remain);
  }

  /* Pause keeps the unspent time so resuming picks up mid-bar */
  function pause() {
    if (timer) {
      remain = Math.max(400, remain - (Date.now() - startedAt));
      clearTimer();
    }
    freezeFill();
  }

  /* ── Moving between cards ───────────────────── */
  function settle() {
    place(-idx * width, true);
    sizeStage();
    slides.forEach(function (s, n) { s.classList.toggle('is-on', n === idx); });
    barWrap.className = 'spot-bars fl-' + (FEATURED[idx].floors || ['1f'])[0];
    resetBars();
  }

  /* Called with the same index after a drag that didn't travel far
     enough to turn — the track snaps back and the timer resumes
     from wherever the bar was frozen. */
  function goTo(n) {
    n = Math.max(0, Math.min(FEATURED.length - 1, n));
    if (n !== idx) { idx = n; remain = FEATURED_DWELL; }
    settle();
    play();
  }

  /* ── Drag ───────────────────────────────────── */
  function bindDrag() {
    var startX = 0, startY = 0, dx = 0;
    var lastX = 0, lastT = 0, velocity = 0;
    var active = false, decided = false, horizontal = false;

    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      active = true; decided = false; horizontal = false;
      startX = lastX = e.clientX; startY = e.clientY;
      dx = 0; velocity = 0; lastT = e.timeStamp;
      held = true; pause();
    });

    window.addEventListener('pointermove', function (e) {
      if (!active) return;

      /* A mostly-vertical gesture belongs to the page scroll */
      if (!decided) {
        var ax = Math.abs(e.clientX - startX), ay = Math.abs(e.clientY - startY);
        if (ax < 5 && ay < 5) return;
        decided = true;
        horizontal = ax > ay;
        if (!horizontal) { active = false; held = false; play(); return; }
      }

      dx = e.clientX - startX;
      var dt = e.timeStamp - lastT;
      if (dt > 0) velocity = (e.clientX - lastX) / dt;   // px per ms
      lastX = e.clientX; lastT = e.timeStamp;

      var over = (idx === 0 && dx > 0) || (idx === FEATURED.length - 1 && dx < 0);
      place(-idx * width + (over ? dx * 0.32 : dx), false);
    }, { passive: true });

    function release() {
      if (!active) return;
      active = false; held = false;
      if (!horizontal) { play(); return; }

      /* Flick beats distance — a short fast swipe should still turn */
      var flick = Math.abs(velocity) > 0.45 && Math.abs(dx) > 12;
      var far   = Math.abs(dx) > width * 0.22;
      var step  = (flick || far) ? (dx < 0 ? 1 : -1) : 0;

      if (step) dir = step;          // keep autoplay going the way you swiped
      goTo(idx + step);
    }
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { dir = 1;  goTo(idx + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { dir = -1; goTo(idx - 1); e.preventDefault(); }
    });

    stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { held = true; pause(); } });
    stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { held = false; play(); } });
  }

  /* ── Boot ───────────────────────────────────── */
  function init() {
    stage   = document.getElementById('spot-stage');
    track   = document.getElementById('spot-track');
    barWrap = document.getElementById('spot-bars');
    if (!stage || !track || !barWrap) return;

    if (!FEATURED.length) {
      track.innerHTML = '<p class="spot-empty">No featured stores configured.</p>';
      stage.style.height = 'auto';
      return;
    }

    /* Dev guard: a typo in featured.js should be loud, not silent. */
    var known = {};
    SECTIONS.forEach(function (s) { s.stores.forEach(function (st) { known[st.name] = true; }); });
    FEATURED.forEach(function (f) {
      if (!known[f.store]) console.warn('[spotlight] "' + f.store + '" is not in the directory data.');
    });

    track.innerHTML = FEATURED.map(function (item) {
      return '<div class="spot-slide fl-' + (item.floors || ['1f'])[0] + '">' + cardHTML(item) + '</div>';
    }).join('');
    slides = Array.prototype.slice.call(track.querySelectorAll('.spot-slide'));

    barWrap.innerHTML = FEATURED.map(function (item, n) {
      return '<button class="spot-bar" data-i="' + n + '" aria-label="Show ' + esc(item.store) + '">' +
        '<span class="spot-bar-fill"></span></button>';
    }).join('');
    bars = Array.prototype.slice.call(barWrap.querySelectorAll('.spot-bar'));
    barWrap.addEventListener('click', function (e) {
      var b = e.target.closest('.spot-bar');
      if (!b) return;
      var n = +b.dataset.i;
      if (n !== idx) dir = n > idx ? 1 : -1;
      goTo(n);
    });

    measure();
    place(0, false);
    remain = FEATURED_DWELL;
    settle();
    bindDrag();

    function refit() { measure(); place(-idx * width, false); sizeStage(); }
    window.addEventListener('resize', refit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        offScreen = !entries[0].isIntersecting;
        offScreen ? pause() : play();
      }, { threshold: 0.2 }).observe(stage);
    }
    document.addEventListener('visibilitychange', function () {
      tabHidden = document.hidden;
      tabHidden ? pause() : play();
    });

    play();
  }

  /* Called when the section folds away for search */
  function setPaused(v) {
    suspended = v;
    if (v) { pause(); return; }
    /* Coming back from search the card has been gone a while —
       start its bar over rather than resuming a stale fill. */
    remain = FEATURED_DWELL;
    var f = fillOf(idx);
    if (f) { f.style.transition = 'none'; f.style.transform = 'scaleX(0)'; }
    resetBars();
    play();
  }

  function resize() { measure(); place(-idx * width, false); sizeStage(); }

  return { init: init, resize: resize, setPaused: setPaused };
})();
