/* ============================================================
   APP — boot, sticky offset, scroll-to-top
   ============================================================ */

(function () {
  'use strict';

  var searchbar = document.getElementById('searchbar');
  var brandbar  = document.querySelector('.brandbar');
  var toTop     = document.getElementById('to-top');

  /* The browse bar sticks directly under the search bar. Because the
     search bar's height is now constant, this is a fixed number that
     only changes on resize — no per-frame chasing, and nothing below
     it can shift while you scroll. */
  function syncOffset() {
    document.documentElement.style.setProperty(
      '--header-h', searchbar.getBoundingClientRect().height + 'px');
  }

  var stuck = null;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    /* Shadow only — no layout involved, so this can't cause a jump */
    var next = y > (brandbar ? brandbar.offsetHeight - 8 : 24);
    if (next !== stuck) {
      searchbar.classList.toggle('is-stuck', next);
      stuck = next;
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
    img.addEventListener('error', function () { img.classList.add('is-missing'); syncOffset(); });
    img.addEventListener('load', syncOffset);
  });

  Spotlight.init();
  Directory.init();

  syncOffset();
  window.addEventListener('resize', function () { syncOffset(); Spotlight.resize(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncOffset);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
