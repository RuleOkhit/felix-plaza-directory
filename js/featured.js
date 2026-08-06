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
                          own background baked in (e.g. KFC).
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

   Logo aspect ratios vary a lot (Babyshop is 4.5:1, KFC is 1.2:1),
   so the panel sizes every logo by height and lets the width fall
   where it may. Don't force them into a square.

   Colour ordering: consecutive cards shouldn't share a hue, or
   the rotation stops feeling like it's moving. Current run is
   red → green → purple → charcoal → red.
   ============================================================ */

const FEATURED = [
  {
    store: 'KFC',
    category: 'Food Court',
    floors: ['3f'],
    logo: 'assets/brands/kfc.png',
    logoBox: true,
    brand: { ink: '#C8102E', wash: 'rgba(200, 16, 46, 0.07)' }
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
    store: 'GEETANJALI SALON',
    category: 'Salon',
    floors: ['1f'],
    logo: 'assets/brands/geetanjali.png',
    /* Monochrome mark — no brand colour to borrow, so the card
       uses the directory's own accent rather than inventing one. */
    brand: { ink: '#752de9', wash: 'rgba(117, 45, 233, 0.07)' }
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
    store: 'H&M',
    category: 'Apparel',
    floors: ['gf', '1f'],
    logo: 'assets/brands/hm.png',
    brand: { ink: '#E50A1E', wash: 'rgba(229, 10, 30, 0.07)' }
  }
];

/* How long each card holds before the next one, in ms.
   This is also how long the progress bar takes to fill. */
const FEATURED_DWELL = 4500;
