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
│   ├── header.css        logo space, brand, persistent search
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
  note: 'One short line about the store goes here.',
  logo: 'assets/brands/hm.png'
}
```

`note` and `logo` are optional. A typo in `store` logs a console warning rather
than failing silently. The `note` lines shipped here are placeholder copy —
swap them for something real before this goes in front of shoppers.

Each card takes its floor's colour: the rule across the top, the logo plate
tint, the floor tag and the progress bar all move together.

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
