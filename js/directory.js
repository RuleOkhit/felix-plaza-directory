/* ============================================================
   DIRECTORY
   Owns the store list, the floor / category filters, the search
   and the category sheet. Renders from SECTIONS in js/data.js.

   Two things worth knowing:
   • Search deliberately ignores the floor and category filters.
     Typing a name means "find this store", not "find this store
     if it happens to be where I was already looking".
   • Filter changes cross-fade and animate the container height,
     so the page never snaps to a new length underneath you.
   ============================================================ */

window.Directory = (function () {
  'use strict';

  var state = { floor: 'all', cat: 'all', query: '' };

  var elList, elTrigger, elTriggerLabel, elSheet, elSheetGrid,
      elSearch, elClear, elSeg, elInd;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var swapToken = 0;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function floorShort(key) {
    var m = FLOORS.filter(function (f) { return f.key === key; })[0];
    return m ? m.short : key.toUpperCase();
  }
  function catLabel(key) {
    var m = CATEGORIES.filter(function (c) { return c.key === key; })[0];
    return m ? m.label : key;
  }

  /* ── What's visible right now ───────────────── */
  function results() {
    var searching = !!state.query;
    var out = [];
    SECTIONS.forEach(function (section) {
      if (!searching && state.cat !== 'all' && section.cat !== state.cat) return;
      var stores = section.stores.filter(function (s) {
        if (searching) return s.name.toLowerCase().indexOf(state.query) !== -1;
        return state.floor === 'all' || s.floors.indexOf(state.floor) !== -1;
      });
      if (stores.length) out.push({ title: section.title, stores: stores });
    });
    return out;
  }

  /* ── Markup ─────────────────────────────────── */
  function tagsHTML(store) {
    return '<span class="floor-tags">' + store.floors.map(function (f) {
      return '<span class="floor-tag fl-' + f + '">' + esc(floorShort(f)) + '</span>';
    }).join('') + '</span>';
  }

  function rowHTML(store, meta) {
    return '<li class="store-row">' +
      '<span class="store-name">' + esc(store.name) +
        (meta ? '<span class="store-meta">' + esc(meta) + '</span>' : '') +
      '</span>' + tagsHTML(store) + '</li>';
  }

  function listHTML() {
    var groups = results();
    var total = groups.reduce(function (a, g) { return a + g.stores.length; }, 0);
    if (!total) return emptyHTML();

    if (state.query) {
      /* Flat results — grouping is noise once you've searched */
      var rows = [];
      groups.forEach(function (g) {
        g.stores.forEach(function (s) { rows.push(rowHTML(s, g.title)); });
      });
      return '<section class="group">' +
          '<div class="group-head"><h3 class="group-title">Results</h3></div>' +
          '<ul class="group-card">' + rows.join('') + '</ul>' +
        '</section>';
    }

    return groups.map(function (g) {
      return '<section class="group">' +
        '<div class="group-head"><h3 class="group-title">' + esc(g.title) + '</h3></div>' +
        '<ul class="group-card">' +
          g.stores.map(function (s) { return rowHTML(s); }).join('') +
        '</ul>' +
      '</section>';
    }).join('');
  }

  function emptyHTML() {
    var what = state.query
      ? 'Nothing matches “' + esc(state.query) + '”.'
      : 'No ' + (state.cat === 'all' ? 'stores' : esc(catLabel(state.cat).toLowerCase()) + ' stores') +
        ' on this floor.';
    return '<div class="empty">' +
      '<div class="empty-icon">' +
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
      '</div>' +
      '<p class="empty-title">Nothing here</p>' +
      '<p class="empty-text">' + what + '</p>' +
      '<button class="btn" data-action="reset">Show all stores</button>' +
    '</div>';
  }

  /* ── Painting ───────────────────────────────── */

  /* Search types straight in — any delay reads as lag. */
  function paintNow() {
    elList.innerHTML = listHTML();
  }

  /* Filter changes get the full transition: fade out, swap,
     animate the container between the two heights, settle in. */
  function paintSmooth() {
    if (reduce) { paintNow(); return; }
    var mine = ++swapToken;
    var h0 = elList.getBoundingClientRect().height;

    elList.classList.add('is-out');

    setTimeout(function () {
      if (mine !== swapToken) return;

      elList.innerHTML = listHTML();
      elList.classList.add('is-sizing');
      elList.style.height = h0 + 'px';
      void elList.offsetHeight;

      var h1 = elList.scrollHeight;
      elList.style.height = h1 + 'px';
      elList.classList.remove('is-out');
      elList.classList.add('is-anim');

      setTimeout(function () {
        if (mine !== swapToken) return;
        elList.classList.remove('is-sizing', 'is-anim');
        elList.style.height = '';
      }, 470);
    }, 150);
  }

  /* ── Filter setters ─────────────────────────── */
  function moveIndicator(btn) {
    if (!elInd || !btn) return;
    elInd.style.width = btn.offsetWidth + 'px';
    elInd.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    elInd.style.backgroundColor = btn.dataset.floor === 'all'
      ? 'var(--ink)'
      : 'var(--f-' + btn.dataset.floor + '-on)';
  }

  function setFloor(floor, animate) {
    state.floor = floor;
    var active = null;
    elSeg.querySelectorAll('.seg-btn').forEach(function (b) {
      var on = (b.dataset.floor || 'all') === floor;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) active = b;
    });
    moveIndicator(active);
    animate === false ? paintNow() : paintSmooth();
  }

  function setCat(cat) {
    state.cat = cat;
    elTriggerLabel.textContent = cat === 'all' ? 'All categories' : catLabel(cat);
    elTrigger.classList.toggle('is-set', cat !== 'all');
    paintSmooth();
  }

  /* ── Search ─────────────────────────────────── */
  function setQuery(raw) {
    var was = !!state.query;
    state.query = raw.trim().toLowerCase();
    var now = !!state.query;

    elClear.classList.toggle('is-on', raw.length > 0);

    if (was !== now) {
      /* Entering or leaving search mode: everything else folds away
         so the results sit directly under the search field. */
      document.body.classList.toggle('is-searching', now);
      Spotlight.setPaused(now);
      if (now && window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    paintNow();
  }

  function reset() {
    elSearch.value = '';
    state.query = '';
    elClear.classList.remove('is-on');
    document.body.classList.remove('is-searching');
    Spotlight.setPaused(false);

    state.cat = 'all';
    elTriggerLabel.textContent = 'All categories';
    elTrigger.classList.remove('is-set');

    setFloor('all');
  }

  /* ── Category sheet ─────────────────────────── */
  function hasAny(cat) {
    var n = 0;
    SECTIONS.forEach(function (section) {
      if (cat !== 'all' && section.cat !== cat) return;
      n += section.stores.filter(function (s) {
        return state.floor === 'all' || s.floors.indexOf(state.floor) !== -1;
      }).length;
    });
    return n > 0;
  }

  var GRID_ICON = '<svg class="sheet-item-icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/></svg>';

  function paintSheet() {
    elSheetGrid.innerHTML = CATEGORIES.map(function (c) {
      var icon = c.icon
        ? '<svg class="sheet-item-icon" viewBox="0 0 24 24" fill="none">' + c.icon + '</svg>'
        : GRID_ICON;
      return '<button class="sheet-item' + (c.key === 'all' ? ' sheet-item--wide' : '') +
          (c.key === state.cat ? ' is-on' : '') + (hasAny(c.key) ? '' : ' is-empty') +
          '" data-cat="' + esc(c.key) + '">' +
          icon +
          '<span class="sheet-item-label">' + esc(c.key === 'all' ? 'All categories' : c.label) + '</span>' +
        '</button>';
    }).join('');
  }

  function openSheet() {
    paintSheet();
    elSheet.classList.add('is-open');
    elTrigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeSheet() {
    elSheet.classList.remove('is-open');
    elTrigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ── Boot ───────────────────────────────────── */
  function init() {
    elList         = document.getElementById('directory');
    elTrigger      = document.getElementById('cat-trigger');
    elTriggerLabel = document.getElementById('cat-trigger-label');
    elSheet        = document.getElementById('sheet');
    elSheetGrid    = document.getElementById('sheet-grid');
    elSearch       = document.getElementById('search-input');
    elClear        = document.getElementById('search-clear');
    elSeg          = document.getElementById('seg');
    elInd          = document.getElementById('seg-ind');

    elSeg.addEventListener('click', function (e) {
      var b = e.target.closest('.seg-btn');
      if (b && (b.dataset.floor || 'all') !== state.floor) setFloor(b.dataset.floor || 'all');
    });

    elTrigger.addEventListener('click', function () {
      elSheet.classList.contains('is-open') ? closeSheet() : openSheet();
    });
    elSheet.addEventListener('click', function (e) {
      if (e.target.closest('.sheet-scrim') || e.target.closest('.sheet-close')) { closeSheet(); return; }
      var item = e.target.closest('.sheet-item');
      if (item) {
        closeSheet();
        if (item.dataset.cat !== state.cat) setCat(item.dataset.cat);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (elSheet.classList.contains('is-open')) closeSheet();
        else if (state.query) { elSearch.value = ''; setQuery(''); }
      }
    });

    elSearch.addEventListener('input', function () { setQuery(this.value); });
    elClear.addEventListener('click', function () {
      elSearch.value = ''; setQuery(''); elSearch.focus();
    });

    elList.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="reset"]')) reset();
    });

    /* First paint — place the segment indicator without sliding it
       in from zero, then let it animate from here on. */
    setFloor('all', false);
    requestAnimationFrame(function () { elSeg.classList.add('is-ready'); });

    elList.classList.add('is-anim');
    setTimeout(function () { elList.classList.remove('is-anim'); }, 700);

    window.addEventListener('resize', function () {
      moveIndicator(elSeg.querySelector('.seg-btn.is-on'));
    });
  }

  return { init: init, reset: reset };
})();
