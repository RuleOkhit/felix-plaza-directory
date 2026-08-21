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
     creative  optional — path to supplied banner artwork. Switches
               the card to a photo-led layout: image fills the card,
               copy sits on a scrim, logo becomes a corner mark.
               Pair with `dark: true`.
     creativeFocus  object-position for that image, e.g. '50% 6%'.
               Use it to keep the subject in frame and to steer the
               crop away from anything that would be sliced in half.

   ── About the headlines ─────────────────────────────────────
   The lines below are plain descriptions of what each store
   sells — factual, and safe to publish as-is. They are NOT
   campaign copy. Swap them for real seasonal messaging
   ("Anti-frizz care starts here", "Monsoon edit is in") as and
   when the retailer supplies it; that is what this slot is for.

   ── About the order ─────────────────────────────────────────
   Neighbouring banners shouldn't share a background hue, and
   that includes the wrap from the last card back to the first.
   Current run: dark, stone, sky, mint, blush, butter, steel,
   sand, lilac.
   ============================================================ */

const FEATURED = [
  {
    store: 'PUNJAB GRILL',
    category: 'Restaurants',
    floors: ['2f'],
    /* The brand's own supplied creative. Being square, it can't go
       in the 46% art column without being mangled, so `creative`
       switches the card to a photo-led layout: the image fills the
       card, the copy sits on a scrim over its quiet left side, and
       the logo drops to a corner mark.

       creativeFocus crops it. The artwork's lower band carries a
       yellow "61st outlet" roundel and a dish caption, both of
       which a landscape crop would slice in half. Measured off the
       artwork: the roundel starts at y=824 of 1216 (0.678) and the
       visible band is 0.676 of the height, so the window has to
       start at the very top to clear it. That keeps the dish and
       the dark space the copy sits on, and drops the roundel --
       whose message is set as the headline instead. Nothing is
       squeezed and nothing is left half-showing. */
    creative: 'assets/creatives/punjab-grill.jpg',
    creativeFocus: '50% 0%',
    headline: 'Our 61st outlet in India',
    logo: 'assets/brands/punjab-grill.svg',
    dark: true,
    brand: { bg: '#17120C', ink: '#C9A227' }
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
const FEATURED_DWELL = 3600;
