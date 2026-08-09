/* ============================================================
   STORE SPOTLIGHT — content
   ------------------------------------------------------------
   THIS IS THE FILE YOU EDIT TO CHANGE WHAT'S FEATURED.
   Nothing else needs touching.

   One entry = one featured store = one card.

   Fields
     store     required — must match a name in js/data.js exactly
     category  required — shown under the store name
     floors    required — array of: con | gf | 1f | 2f | 3f
     logo      required — path under assets/brands/
     logoBox   optional — true when the logo file ships with its
                          own background baked in (e.g. Frido).
                          Renders it as a rounded brand tile
                          instead of floating it on the panel.
     logoZoom  optional — crops padding out of a boxed logo
     brand     optional — { ink, wash }
                          ink  = the 3px rule across the top of
                                 the card and the progress bar
                          wash = the same colour at 5–18% behind
                                 the logo. Keep it faint.
     offer     optional — { tag, text }. Omit it and the card
                          simply ends after the store name.

   Logo aspect ratios vary a lot (Babyshop is 4.5:1, Frido is 1:1),
   so the panel sizes every logo by height and lets the width fall
   where it may. Don't force them into a square.

   ── Order matters ───────────────────────────────────────────
   Consecutive cards shouldn't share a hue, or the rotation stops
   feeling like it's moving — and that includes the wrap from the
   last card back to the first.

   Vivo and Samsung are both blue, so they sit apart rather than
   next to each other. Current run:

     gold → charcoal → blue → green → red → blue → black
          → purple → (wraps back to gold)
   ============================================================ */

const FEATURED = [
  {
    store: 'FRIDO',
    category: 'Home & Lifestyle',
    floors: ['con'],
    logo: 'assets/brands/frido.jpg',
    /* Ships as a yellow square with a wide margin, so it becomes a
       brand tile and the zoom crops the padding off the wordmark. */
    logoBox: true,
    logoZoom: 1.95,
    brand: { ink: '#C99700', wash: 'rgba(255, 205, 0, 0.17)' }
  },
  {
    store: 'TISSOT',
    category: 'Watches',
    floors: ['gf'],
    logo: 'assets/brands/tissot.png',
    /* The wordmark is black; the Swiss red lives inside the mark
       itself, so the card stays charcoal and lets it show. */
    brand: { ink: '#14141A', wash: 'rgba(20, 20, 26, 0.055)' }
  },
  {
    store: 'VIVO',
    category: 'Mobile & Electronics',
    floors: ['con'],
    logo: 'assets/brands/vivo.png',
    /* Sampled off the artwork rather than guessed. */
    brand: { ink: '#0070B8', wash: 'rgba(0, 112, 184, 0.075)' }
  },
  {
    store: 'BABYSHOP',
    category: "Kid's Fashion",
    floors: ['2f'],
    logo: 'assets/brands/babyshop.png',
    /* Wordmark is black with green/blue/pink/yellow/orange dots.
       Green is the first of them and the least used elsewhere. */
    brand: { ink: '#6CB33F', wash: 'rgba(108, 179, 63, 0.11)' }
  },
  {
    store: 'H&M',
    category: 'Apparel',
    floors: ['gf', '1f'],
    logo: 'assets/brands/hm.png',
    brand: { ink: '#E50A1E', wash: 'rgba(229, 10, 30, 0.07)' }
  },
  {
    store: 'SAMSUNG',
    category: 'Mobile & Electronics',
    floors: ['1f'],
    logo: 'assets/brands/samsung.png',
    /* Deeper than Vivo's blue, and two cards away from it. */
    brand: { ink: '#0060A8', wash: 'rgba(0, 96, 168, 0.07)' }
  },
  {
    store: 'ADIDAS',
    category: 'Sportswear',
    floors: ['1f'],
    logo: 'assets/brands/adidas.png',
    /* Brand black — the mark is monochrome by design. */
    brand: { ink: '#000000', wash: 'rgba(0, 0, 0, 0.06)' }
  },
  {
    store: 'GEETANJALI SALON',
    category: 'Salon',
    floors: ['1f'],
    logo: 'assets/brands/geetanjali.png',
    /* Monochrome mark — no brand colour to borrow, so the card
       uses the directory's own accent rather than inventing one.
       Sits last, where purple separates Adidas' black from
       Frido's gold on the wrap. */
    brand: { ink: '#752de9', wash: 'rgba(117, 45, 233, 0.07)' }
  }
];

/* How long each card holds before the next one, in ms.
   This is also how long the progress bar takes to fill. */
const FEATURED_DWELL = 4500;
