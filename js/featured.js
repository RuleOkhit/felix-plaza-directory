/* ============================================================
   STORE SPOTLIGHT — content
   ------------------------------------------------------------
   THIS IS THE FILE YOU EDIT TO CHANGE WHAT'S FEATURED.
   Nothing else needs touching.

   One entry = one banner.

   Fields
     store     required — must match a name in js/data.js exactly
     category  required — the small caps kicker above the message
     floors    required — array of: con | gf | 1f | 2f | 3f
                          the first one names the floor pill
     logo      required — path under assets/brands/
     headline  optional — THE MESSAGE. This is the line that leads
                          the banner. Leave it out and the store
                          name leads instead.
     brand.bg  the banner background. Keep them soft and muted —
               the banner should sit inside the directory, not
               shout over it.
     brand.ink the progress-bar colour for this card.
     dark      set true when bg is dark; flips the text, pill and
               badge to their light variants in one go.
     logoBox   true when the logo file ships with its own
               background baked in (Frido). Renders a brand tile.
     logoZoom  crops padding out of a boxed logo.
     logoHeight px cap for this logo, default 58, max 72. Wide
               wordmarks end up limited by the art column's width
               rather than this, which is expected.

   ── About the headlines ─────────────────────────────────────
   The lines below are plain descriptions of what each store
   sells — factual, and safe to publish as-is. They are NOT
   campaign copy. Swap them for real seasonal messaging
   ("Anti-frizz care starts here", "Monsoon edit is in") as and
   when the retailer supplies it; that is what this slot is for.

   ── About the order ─────────────────────────────────────────
   Neighbouring banners shouldn't share a background hue, and
   that includes the wrap from the last card back to the first.
   Current run: butter, stone, sky, mint, blush, dark, steel,
   sand, lilac.
   ============================================================ */

const FEATURED = [
  {
    store: 'FRIDO',
    category: 'Home & Lifestyle',
    floors: ['con'],
    headline: 'Everyday home comfort',
    logo: 'assets/brands/frido.jpg',
    /* Ships as a yellow square with a wide margin, so it becomes a
       brand tile and the zoom crops the padding off the wordmark. */
    logoBox: true,
    logoZoom: 1.95,
    logoHeight: 62,
    brand: { bg: '#FBEBC0', ink: '#C99700' }
  },
  {
    store: 'TISSOT',
    category: 'Watches',
    floors: ['gf'],
    headline: 'Swiss watchmaking',
    logo: 'assets/brands/tissot.png',
    brand: { bg: '#E2DED5', ink: '#14141A' }
  },
  {
    store: 'VIVO',
    category: 'Mobile & Electronics',
    floors: ['con'],
    headline: 'Smartphones & more',
    logo: 'assets/brands/vivo.png',
    brand: { bg: '#D3E6F7', ink: '#0070B8' }
  },
  {
    store: 'BABYSHOP',
    category: "Kid's Fashion",
    floors: ['2f'],
    headline: 'Kidswear and baby care',
    logo: 'assets/brands/babyshop.png',
    brand: { bg: '#DDEFD2', ink: '#6CB33F' }
  },
  {
    store: 'FUNCITY',
    category: 'Entertainment',
    floors: ['3f'],
    headline: 'Games, rides & arcade',
    /* Cropped to the mark — the supplied file's wordmark was white
       and would have vanished on a light banner. */
    logo: 'assets/brands/funcity.png',
    logoHeight: 66,
    brand: { bg: '#F8DCEE', ink: '#BD4699' }
  },
  {
    store: 'PUNJAB GRILL',
    category: 'Restaurants',
    floors: ['2f'],
    headline: 'North Indian dining',
    /* SVG, used uncropped exactly as supplied. All 35 of its paths
       are a pale gold, so this banner runs dark and lets the mark
       sit straight on the background — no plate needed. */
    logo: 'assets/brands/punjab-grill.svg',
    logoHeight: 46,
    dark: true,
    brand: { bg: '#17120C', ink: '#C9A227' }
  },
  {
    store: 'SAMSUNG',
    category: 'Mobile & Electronics',
    floors: ['1f'],
    headline: 'Phones and wearables',
    logo: 'assets/brands/samsung.png',
    brand: { bg: '#D8E6F3', ink: '#0060A8' }
  },
  {
    store: 'ADIDAS',
    category: 'Sportswear',
    floors: ['1f'],
    headline: 'Sportswear & footwear',
    logo: 'assets/brands/adidas.png',
    brand: { bg: '#E5E1DA', ink: '#000000' }
  },
  {
    store: 'GEETANJALI SALON',
    category: 'Salon',
    floors: ['1f'],
    headline: 'Hair, skin and beauty',
    logo: 'assets/brands/geetanjali.png',
    brand: { bg: '#E7DCFA', ink: '#752de9' }
  }
];

/* How long each banner holds before the next one, in ms.
   This is also how long the progress bar takes to fill. */
const FEATURED_DWELL = 4500;
