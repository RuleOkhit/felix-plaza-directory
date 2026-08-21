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
│   ├── spotlight.css     Spotlight banners, track + progress bars
│   ├── browse.css        floor segmented control + category trigger
│   ├── sheet.css         category bottom sheet
│   ├── store-list.css    grouped store cards
│   └── footer.css        footer + scroll-to-top
├── js/
│   ├── data.js           ← the directory. 94 stores, 20 sections
│   ├── featured.js       ← which stores are in the Spotlight
│   ├── spotlight.js      Spotlight rendering + rotation
│   ├── directory.js      list, filters, search, category sheet
│   └── app.js            boot, sticky offsets, header, scroll-to-top
└── assets/
    ├── logo.png          drop your logo here (header + footer)
    └── brands/           optional per-store logos for the Spotlight
```

## The two files you'll actually edit

**`js/data.js`** — the directory, and the source of truth for it. Edit it
directly; there is no generator. Nothing else in the project hard-codes a store
name.

**`js/featured.js`** — which stores appear in Store Spotlight. Each entry is one
banner.

```js
{
  store: 'VIVO',                       // must match a name in data.js exactly
  category: 'Mobile & Electronics',    // small-caps kicker
  floors: ['con'],                     // first one names the floor pill
  headline: 'Smartphones & more',      // THE MESSAGE — the line that leads
  logo: 'assets/brands/vivo.png',
  brand: { bg: '#D3E6F7', ink: '#0070B8' }
}
```

A typo in `store` logs a console warning rather than failing silently.

### The banner

Modelled on the app-store style promo banners in `ideas/`: a wide card with a
kicker, a big two-line message, the brand named underneath, and a pill where
those banners put their CTA — here it names the floor. The logo sits right,
where those banners put product photography.

`brand.bg` is the banner background and `dark: true` flips text, pill and badge
to their light variants in one go (Punjab Grill is the only dark one — its logo
is a pale gold that needs a dark ground).

**Keep the backgrounds tinted enough to read against the cream page.** They were
too pale on the first pass and the peeking neighbours were invisible against
`--bg`. Neighbouring banners also shouldn't share a hue, wrap included.

### Headlines

`headline` is the message slot. What ships is plain factual description of what
each store sells — safe to publish as-is, but **not campaign copy**. Swap in real
seasonal messaging when a retailer supplies it; that is what the slot is for.

Keep them to roughly 22 characters. The headline clamps to two lines and clips
beyond that — at 17.5px in a 56%-wide column, longer lines get cut.

### The carousel

Full-bleed track. Slide width is 74% of the stage and the track is offset so the
active slide is centred, which leaves both neighbours peeking at the screen
edges. Geometry lives in `measure()`; `baseX(i)` is the resting position for
slide *i*, and `step` (slide + gap) is one card's travel.

Inactive cards sit at `scale(0.94)` and lift to `scale(1)` as they become active,
on the same easing as the track so the two read as a single movement.

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

Per-store logos go in `assets/brands/` and sit on the right of the banner. PNG or
SVG; check a new one has a genuinely transparent background before trusting it —
an opaque white one shows as a block on the banner. Wide wordmarks end up limited
by the art column's width rather than `logoHeight`, which is expected.

An SVG exported with only a `viewBox` has no intrinsic size, so `max-height`
never resolves and it renders 0×0 — hence the explicit height rule for
`img[src$=".svg"]`.

## Cache busting

Asset links carry `?v=N`. Bump it when you change a CSS or JS file:

```bash
node -e "const f=require('fs');let h=f.readFileSync('index.html','utf8');f.writeFileSync('index.html',h.replace(/\?v=\d+/g,'?v='+(Date.now()%100000)))"
```
