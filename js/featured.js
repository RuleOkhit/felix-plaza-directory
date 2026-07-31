/* ============================================================
   STORE SPOTLIGHT — content
   ------------------------------------------------------------
   THIS IS THE FILE YOU EDIT TO CHANGE WHAT'S FEATURED.
   Nothing else needs touching.

   One entry = one featured store = one card. They rotate, one on
   screen at a time, each in its own floor's colour.

   Fields
     store     required — must match a name in js/data.js exactly
     category  required — shown under the store name
     floors    required — array of: con | gf | 1f | 2f | 3f
     note      optional — one short line under the divider
     logo      optional — transparent PNG at assets/brands/…
                          falls back to a monogram plate
     mono      optional — override the monogram letter

   The note lines below are placeholder copy — swap them for
   something real before this goes in front of shoppers.
   ============================================================ */

const FEATURED = [
  {
    store: 'FRIDO',
    category: 'Home & Lifestyle',
    floors: ['con'],
    logo: 'assets/brands/frido.png',
    note: 'One short line about the store goes here.'
  },
  {
    store: 'H&M',
    category: 'Apparel',
    floors: ['gf', '1f'],
    logo: 'assets/brands/hm.png',
    note: 'One short line about the store goes here.'
  },
  {
    store: 'ASICS',
    category: 'Sportswear',
    floors: ['1f'],
    logo: 'assets/brands/asics.png',
    note: 'One short line about the store goes here.'
  },
  {
    store: 'BIBA',
    category: 'Ethnic Wear',
    floors: ['2f'],
    logo: 'assets/brands/biba.png',
    note: 'One short line about the store goes here.'
  },
  {
    store: 'KFC',
    category: 'Food Court',
    floors: ['3f'],
    logo: 'assets/brands/kfc.png',
    note: 'One short line about the store goes here.'
  }
];

/* How long each card holds before the next one, in ms.
   This is also how long the progress bar takes to fill. */
const FEATURED_DWELL = 6000;
