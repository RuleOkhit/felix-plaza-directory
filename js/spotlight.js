/* ============================================================
   STORE SPOTLIGHT — behaviour
   ------------------------------------------------------------
   A horizontal track of brand cards.

   Gesture handling is deliberately conservative: a drag has to
   travel 10px AND be clearly more horizontal than vertical
   before the deck takes it. Until then the browser keeps the
   gesture and the page scrolls normally — so a downward swipe
   that starts over a card never turns the card.

   The bars beside the section title are the timer made visible.
   The active bar fills over FEATURED_DWELL and the deck advances
   the instant it's full. Holding freezes the fill where it is.
   ============================================================ */

window.Spotlight = (function () {
  'use strict';

  /* A gesture must travel this far before we commit to reading it
     as horizontal or vertical, and horizontal has to win by this
     margin (1.4 ≈ within 35° of the horizontal axis). */
  var DECIDE_PX = 10;
  var H_BIAS = 1.4;

  /* Banner geometry. The slide is a fraction of the stage so the
     neighbours show at both edges; the track is then offset to put
     the active slide dead centre. */
  var SLIDE_RATIO = 0.74;
  var GAP = 12;

  var stage, track, barWrap, slides = [], bars = [];
  var idx = 0, dir = 1;
  var stageW = 0, slideW = 0, step = 0, originX = 0;
  var timer = null, startedAt = 0, remain = 0, sized = false;
  var held = false, offScreen = false, tabHidden = false, suspended = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* Colours land in a style attribute, so only let real ones through */
  function safeColor(v, fallback) {
    return (typeof v === 'string' && /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(v.trim()))
      ? v.trim() : fallback;
  }

  /* ── Card ───────────────────────────────────── */
  function cardHTML(item) {
    var brand = item.brand || {};
    var bg = safeColor(brand.bg, safeColor(brand.wash, 'var(--surface)'));

    var floor = (item.floors || [])[0];
    var meta = FLOORS.filter(function (x) { return x.key === floor; })[0];
    var floorName = meta ? meta.name : '';

    var zoom = (typeof item.logoZoom === 'number' && item.logoZoom > 0)
      ? Math.min(4, item.logoZoom) : 1;
    var lh = (typeof item.logoHeight === 'number' && item.logoHeight > 0)
      ? ';--logo-h:' + Math.min(72, item.logoHeight) + 'px' : '';

    var img = '<img src="' + esc(item.logo) + '" alt="' + esc(item.store) + '">';
    var logo = item.logoBox
      ? '<span class="spot-logo spot-logo--box" style="--zoom:' + zoom + lh + '">' + img + '</span>'
      : '<span class="spot-logo"' + (lh ? ' style="' + lh.slice(1) + '"' : '') + '>' + img + '</span>';

    /* Kicker = category, headline = the message, sub = the store.
       Same shape as the reference banners, which name the brand in
       the supporting line and let the message lead. Without a
       headline the store name leads instead and the sub drops. */
    var headline = item.headline || item.store;
    var sub = item.headline ? item.store : '';

    return '<article class="spot-card' + (item.dark ? ' is-dark' : '') +
        '" style="--bg:' + bg + '">' +
      '<div class="spot-copy">' +
        '<p class="spot-kicker">' + esc(item.category) + '</p>' +
        '<h3 class="spot-headline">' + esc(headline) + '</h3>' +
        (sub ? '<p class="spot-sub">' + esc(sub) + '</p>' : '') +
        '<span class="spot-pill">' +
          '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg>' +
          esc(floorName) +
        '</span>' +
      '</div>' +
      '<div class="spot-art">' + logo + '</div>' +
      '<span class="spot-badge">Featured</span>' +
    '</article>';
  }

  /* ── Geometry ───────────────────────────────────
     originX centres the active slide; step is how far
     the track travels per card.                      */
  function measure() {
    stageW = stage.clientWidth;
    slideW = Math.round(stageW * SLIDE_RATIO);
    step = slideW + GAP;
    originX = Math.round((stageW - slideW) / 2);
    track.style.setProperty('--slide-w', slideW + 'px');
    track.style.setProperty('--gap', GAP + 'px');
  }
  function baseX(i) { return originX - i * step; }

  function sizeStage() {
    if (!slides.length) return;
    var h = Math.ceil(slides[idx].getBoundingClientRect().height);
    if (!h) return;
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

  function currentScale(f) {
    var m = getComputedStyle(f).transform;
    if (!m || m === 'none') return 0;
    var n = m.match(/matrix\(\s*([-\d.]+)/);
    return n ? Math.max(0, Math.min(1, parseFloat(n[1]))) : 0;
  }

  /* Only inactive bars are cleared here — the active bar's fill
     belongs to runFill/freezeFill alone, or a snap-back drag
     would flash it empty and refill. */
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
        /* Nothing will ever fill it, so an empty track reads as
           broken — show the active bar complete instead. Asks
           `neverPlays`, not `canPlay`: a merely paused deck must
           keep its frozen fill rather than jump to full. */
        f.style.transition = 'none';
        f.style.transform = 'scaleX(1)';
      }
    });
  }

  function runFill() {
    var f = fillOf(idx);
    if (!f) return;
    /* Start from whichever is further along: the time left, or where
       the bar is already drawn. Resuming must never rewind it. */
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

  /* ── Timing ─────────────────────────────────── */
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

  function pause() {
    if (timer) {
      remain = Math.max(400, remain - (Date.now() - startedAt));
      clearTimer();
    }
    freezeFill();
  }

  /* ── Moving between cards ───────────────────── */
  function settle() {
    place(baseX(idx), true);
    sizeStage();
    slides.forEach(function (s, n) { s.classList.toggle('is-on', n === idx); });
    var brand = (FEATURED[idx] || {}).brand || {};
    barWrap.style.setProperty('--brand', safeColor(brand.ink, 'var(--accent)'));
    resetBars();
  }

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
    var tracking = false, decided = false, horizontal = false;

    stage.addEventListener('pointerdown', function (e) {
      if (e.isPrimary === false) return;                       // ignore pinch
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true; decided = false; horizontal = false;
      startX = lastX = e.clientX; startY = e.clientY;
      dx = 0; velocity = 0; lastT = e.timeStamp;
      /* Deliberately does NOT pause here. A tap or a vertical
         scroll shouldn't interrupt the rotation — we only take
         over once the gesture proves itself horizontal. */
    });

    window.addEventListener('pointermove', function (e) {
      if (!tracking) return;

      var ax = Math.abs(e.clientX - startX);
      var ay = Math.abs(e.clientY - startY);

      if (!decided) {
        if (Math.max(ax, ay) < DECIDE_PX) return;   // too early to tell
        decided = true;
        horizontal = ax > ay * H_BIAS;
        if (!horizontal) {
          tracking = false;   // it's a scroll — hand it back, don't look again
          return;
        }
        held = true; pause();
      }

      dx = e.clientX - startX;
      var dt = e.timeStamp - lastT;
      if (dt > 0) velocity = (e.clientX - lastX) / dt;   // px per ms
      lastX = e.clientX; lastT = e.timeStamp;

      var over = (idx === 0 && dx > 0) || (idx === FEATURED.length - 1 && dx < 0);
      place(baseX(idx) + (over ? dx * 0.32 : dx), false);
    }, { passive: true });

    function finish(cancelled) {
      if (!tracking) { decided = false; horizontal = false; return; }
      tracking = false;
      if (!horizontal) { decided = false; return; }   // never took over

      held = false;
      if (cancelled) {
        place(baseX(idx), true);                      // browser took the gesture
        play();
      } else {
        /* Flick beats distance — a short fast swipe should still turn */
        var flick = Math.abs(velocity) > 0.45 && Math.abs(dx) > 12;
        var far   = Math.abs(dx) > step * 0.22;
        var step  = (flick || far) ? (dx < 0 ? 1 : -1) : 0;
        if (step) dir = step;
        goTo(idx + step);
      }
      decided = false; horizontal = false;
    }
    window.addEventListener('pointerup', function () { finish(false); });
    window.addEventListener('pointercancel', function () { finish(true); });

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
      return '<div class="spot-slide">' + cardHTML(item) + '</div>';
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
    place(baseX(0), false);
    remain = FEATURED_DWELL;
    settle();
    bindDrag();

    function refit() { measure(); place(baseX(idx), false); sizeStage(); }
    window.addEventListener('resize', refit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
    /* Logos decode after first paint and change the card height */
    track.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', refit);
      img.addEventListener('error', function () { img.classList.add('is-missing'); refit(); });
    });

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

  function resize() { measure(); place(baseX(idx), false); sizeStage(); }

  return { init: init, resize: resize, setPaused: setPaused };
})();
