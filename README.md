# Felix Plaza — Store Directory

Rebuilt from scratch. Open `index.html` directly in a browser — no build step,
no server, no dependencies beyond the Inter webfont.

```
felix-directory/
├── index.html            page shell only — all content is rendered from js/
├── css/
│   ├── tokens.css        colours, radii, shadow, sticky offsets
│   ├── base.css          reset, page shell, floor tags, buttons
│   ├── ticker.css        "Opening Soon" strip
│   ├── header.css        brand bar (scrolls) + search bar (sticky)
│   ├── spotlight.css     Store Spotlight card, track + progress bars
│   ├── browse.css        floor segmented control + category trigger
│   ├── sheet.css         category bottom sheet
│   ├── store-list.css    grouped store cards
│   └── footer.css        footer + scroll-to-top
├── js/
│   ├── data.js           ← the directory. 83 stores, 19 sections
│   ├── featured.js       ← which stores are in the Spotlight
│   ├── spotlight.js      Spotlight rendering + rotation
│   ├── directory.js      list, filters, search, category sheet
│   └── app.js            boot, sticky offsets, header, scroll-to-top
└── assets/
    ├── logo.png          drop your logo here (header + footer)
    └── brands/           optional per-store logos for the Spotlight
```

## The two files you'll actually edit

**`js/data.js`** — the directory. It was generated straight from the previous
build's markup, so every store name, floor tag and category title is
byte-identical to what was there before. Nothing else in the project hard-codes
a store name.

**`js/featured.js`** — which stores appear in Store Spotlight. Each entry is one
featured store, one card. They rotate, one on screen at a time.

```js
{
  store: 'H&M',              // must match a name in data.js exactly
  category: 'Apparel',
  floors: ['gf', '1f'],      // con | gf | 1f | 2f | 3f
  logo: 'assets/brands/hm.png',
  brand: { ink: '#E50A1E', wash: 'rgba(229, 10, 30, 0.07)' }
}
```

A typo in `store` logs a console warning rather than failing silently.

### Brand colour, used twice and only twice

`brand.ink` draws the 3px rule across the top of the card and fills the progress
bar while that card is up. `brand.wash` is the same colour at 6–18% behind the
logo. That's the whole budget — the floor tag stays in the directory's own floor
colours, so five cards from five brands still read as one family rather than as
five adverts. Keep the wash faint; it's the thing that stops a card tipping over
into looking like a banner.

### Logos

Aspect ratios run from 1:1 (Frido) to 3:1 (ASICS), so the panel sizes every logo
by **height** and lets the width fall where it may. Don't force them into a
square — that's what made the old plate fail.

Two kinds of source file:

- **Transparent** (H&M, ASICS, Lifestyle) — float on the wash, capped at 42px tall.
- **Boxed** (Frido, KFC ship with their own background baked in) — set
  `logoBox: true` and they render as a rounded brand tile instead, so a
  hard-edged rectangle never sits on the wash. `logoZoom: 1.95` crops the wide
  margin out of the Frido file.

Logos appear on Spotlight cards only. The directory list stays text-and-tag.

### Optional offer

An entry can carry `offer: { tag, text }` and the card grows a one-line strip
beneath the store name. Nothing uses it right now — all five cards are just
logo, name, category and floor.

## Why the header is two elements

`.brandbar` scrolls away like normal content; `.searchbar` sticks at the top and
**never changes height**. They used to be one sticky header that folded its brand
row away on scroll, and that was the cause of the jumpiness in that whole area:
the browse bar sticks directly beneath it, so its sticky offset had to chase a
moving number every frame, and anything mid-transition got clipped.

With a constant sticky height, `--header-h` is a fixed number measured once (and
on resize), the browse bar parks at exactly 62px, and nothing below can shift.
The only thing scroll changes now is a shadow on `.searchbar`, which costs no
layout. **Don't reintroduce a height animation on either sticky element.**

## Gestures on the Spotlight

A drag has to travel 10px *and* be clearly more horizontal than vertical
(`ax > ay * 1.4`, about 35° off the axis) before the deck takes it. Until then
the browser keeps the gesture and the page scrolls normally, so a downward swipe
that starts over a card never turns the card. Once a gesture is judged vertical
it's released for good and not re-examined.

The deck also doesn't pause on `pointerdown` — only once a drag proves itself
horizontal — so a tap or a scroll never interrupts the rotation. `pointercancel`
(the browser taking the gesture for a scroll) snaps back without turning a page.

## The progress bars

The bars beside the section title are the rotation timer made visible. The
active bar fills left to right over `FEATURED_DWELL` (`js/featured.js`), and the
deck advances the instant it's full — the interface says what it's about to do
instead of surprising you.

Holding the card, hovering it, scrolling it off screen or backgrounding the tab
all freeze the fill exactly where it is; letting go resumes from there rather
than restarting. Tapping a bar jumps straight to that card. With reduced motion
enabled there's no autoplay, so the active bar just reads as full.

## Search

Search deliberately **ignores the floor and category filters** — typing a name
means "find this store", not "find it if it happens to be where I was already
looking". While a query is active, `body.is-searching` folds the Spotlight and
the filter bar away so results sit directly under the search field. Clearing
the query restores everything.

## Logo

`assets/logo.png` — the Felix Plaza wordmark, used in the header lockup (44px
tall, beside a rule and "Store Directory") and centred in the footer at 62px.
It's a two-line wordmark, so it isn't boxed in a plate and there's no "Felix
Plaza" set in type next to it — the mark says that already.

Per-store logos go in `assets/brands/*.png` as transparent PNGs and fill the
Spotlight logo plate; without one the plate falls back to a monogram. A missing
file leaves clean empty space, never a broken-image glyph.

## Cache busting

Asset links carry `?v=N`. Bump it when you change a CSS or JS file:

```bash
node -e "const f=require('fs');let h=f.readFileSync('index.html','utf8');f.writeFileSync('index.html',h.replace(/\?v=\d+/g,'?v='+(Date.now()%100000)))"
```
