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
                          own background baked in (Frido, KFC).
                          Renders it as a rounded brand tile
                          instead of floating it on the panel.
     logoZoom  optional — crops padding out of a boxed logo,
                          e.g. 1.9 for a mark with a wide margin
     brand     optional — { ink, wash }
                          ink  = the brand colour, used for the
                                 rule across the top of the card
                                 and the progress bar. Pick one
                                 dark enough to read at 3px.
                          wash = the same colour at 6–18% behind
                                 the logo. Keep it faint — the
                                 card should read as part of the
                                 directory, not as an ad.
     offer     optional — { tag, text }. Omit it and the card
                          simply ends after the store name.
                          Nothing here uses it right now.

   Logo aspect ratios vary a lot (ASICS is 3:1, Frido is 1:1), so
   the panel sizes each logo by height and lets the width fall
   where it may. Don't box them into a square.
   ============================================================ */

const FEATURED = [
  {
    store: 'FRIDO',
    category: 'Home & Lifestyle',
    floors: ['con'],
    logo: 'assets/brands/frido.jpg',
    logoBox: true,
    logoZoom: 1.95,
    brand: { ink: '#C99700', wash: 'rgba(255, 205, 0, 0.17)' }
  },
  {
    store: 'H&M',
    category: 'Apparel',
    floors: ['gf', '1f'],
    logo: 'assets/brands/hm.png',
    brand: { ink: '#E50A1E', wash: 'rgba(229, 10, 30, 0.07)' }
  },
  {
    store: 'ASICS',
    category: 'Sportswear',
    floors: ['1f'],
    logo: 'assets/brands/asics.png',
    brand: { ink: '#0B3B7C', wash: 'rgba(11, 59, 124, 0.07)' }
  },
  {
    store: 'LIFESTYLE',
    category: 'Apparel',
    floors: ['gf', '1f', '2f'],
    logo: 'assets/brands/lifestyle.png',
    brand: { ink: '#E5257F', wash: 'rgba(229, 37, 127, 0.07)' }
  },
  {
    store: 'KFC',
    category: 'Food Court',
    floors: ['3f'],
    logo: 'assets/brands/kfc.png',
    logoBox: true,
    brand: { ink: '#C8102E', wash: 'rgba(200, 16, 46, 0.07)' }
  }
];

/* How long each card holds before the next one, in ms.
   This is also how long the progress bar takes to fill. */
const FEATURED_DWELL = 6000;
