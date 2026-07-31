/* ============================================================
   APP — boot, sticky offsets, header behaviour, scroll-to-top
   ============================================================ */

(function () {
  'use strict';

  var header = document.getElementById('header');
  var toTop  = document.getElementById('to-top');

  /* The browse bar sticks under the header, and the header changes
     height when the brand row folds — so the offset can't be a
     constant. Measured on a rAF loop across the fold transition. */
  var syncing = 0;
  function syncOffsets() {
    document.documentElement.style.setProperty(
      '--header-h', header.getBoundingClientRect().height + 'px');
  }
  function syncWhileAnimating(ms) {
    var until = performance.now() + ms;
    if (syncing) cancelAnimationFrame(syncing);
    (function step() {
      syncOffsets();
      syncing = performance.now() < until ? requestAnimationFrame(step) : 0;
    })();
  }

  var folded = null;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    var next = y > 24;
    if (next !== folded) {
      header.classList.toggle('is-scrolled', next);
      folded = next;
      syncWhileAnimating(340);
    }
    toTop.classList.toggle('is-on', y > 420);
  }

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* A missing logo leaves clean empty space rather than a broken
     image glyph. Drop assets/logo.png in and it appears. */
  document.querySelectorAll('.brand-logo, .footer-logo').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) img.classList.add('is-missing');
    img.addEventListener('error', function () { img.classList.add('is-missing'); });
    img.addEventListener('load', syncOffsets);
  });

  Spotlight.init();
  Directory.init();

  syncOffsets();
  window.addEventListener('resize', function () { syncOffsets(); Spotlight.resize(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
