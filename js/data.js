/* ============================================================
   FELIX PLAZA — DIRECTORY DATA
   ------------------------------------------------------------
   THIS FILE IS THE SOURCE OF TRUTH for the directory.
   Edit it directly. There is no generator and no upstream
   markup to regenerate from — the old static site this was
   originally scraped out of is retired, and several stores
   below never existed in it.

   To add a store, drop it into the right section in
   alphabetical order:

       { name: 'STORE NAME', floors: ['1f'] },

   `floors` takes one or more of con | gf | 1f | 2f | 3f and
   must match a key in FLOORS. Section order here is the order
   they render in. Anything featured in js/featured.js must
   match a `name` below exactly, or it logs a console warning.

   Stores: 88   Sections: 19
   ============================================================ */

/* Floors, in the order they appear in the building. */
const FLOORS = [
  { key: 'con', short: 'CC', name: 'Concourse'    },
  { key: 'gf',  short: 'GF', name: 'Ground Floor' },
  { key: '1f',  short: '1F', name: 'First Floor'  },
  { key: '2f',  short: '2F', name: 'Second Floor' },
  { key: '3f',  short: '3F', name: 'Third Floor'  }
];

/* Category filters — label + line icon, reused by the browse sheet. */
const CATEGORIES = [
  { key: 'all', label: 'All', icon: null },
  { key: 'apparel', label: 'Apparel', icon: '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46l-2 5.5L5 10v12h14V10l3.38-1.04-2-5.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' },
  { key: 'ethnic', label: 'Ethnic', icon: '<path d="M9 3l3 2 3-2 2 4-2 2v11H7V9L5 7l4-4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' },
  { key: 'footwear', label: 'Footwear', icon: '<path d="M2 15c0-2 1.5-3.5 4-4l3-1.5V6a2 2 0 0 1 4 0v3.5l5 1c2 .5 4 2 4 4v1H2v-1z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' },
  { key: 'sportswear', label: 'Sportswear', icon: '<circle cx="12" cy="5" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 14l3-6h6l1 4-4 1v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22l-2-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'food', label: 'Food Court', icon: '<path d="M3 2v7c0 2.2 1.8 4 4 4v9M14 2v20M20 2c0 3-2 5-2 5v13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { key: 'cafe', label: 'Café', icon: '<path d="M5 3h11v9a4 4 0 0 1-8 0V3M2 21h16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 5h2a2 2 0 0 1 0 4h-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'jewellery', label: 'Jewellery', icon: '<path d="M6 3h12l3 6-9 12L3 9l3-6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M3 9h18M8 3l-2 6M16 3l2 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'watches', label: 'Watches', icon: '<circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M12 8.5v4l2.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 2h6M9 22h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'eyewear', label: 'Eyewear', icon: '<circle cx="6.5" cy="13.5" r="4" stroke="currentColor" stroke-width="1.4"/><circle cx="17.5" cy="13.5" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 12.5h3M2 12l1.7-3M22 12l-1.7-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'beauty', label: 'Beauty', icon: '<path d="M12 2c2.5 4 5 7 5 11a5 5 0 1 1-10 0c0-4 2.5-7 5-11z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' },
  { key: 'salon', label: 'Salon', icon: '<path d="M6 3c0 5 4 7 4 11a2 2 0 0 1-4 0M18 3c0 5-4 7-4 11a2 2 0 0 0 4 0M6 21h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'kids', label: 'Kids', icon: '<circle cx="12" cy="6" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'home', label: 'Home', icon: '<path d="M4 11.5L12 4l8 7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v10h12V10" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' },
  { key: 'bags', label: 'Bags', icon: '<rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
  { key: 'mobile', label: 'Mobile', icon: '<rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="17.5" r="1" fill="currentColor"/>' },
  { key: 'books', label: 'Books', icon: '<path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 1 0-4h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' },
  { key: 'entertainment', label: 'Entertainment', icon: '<path d="M5 3l14 9-14 9V3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' },
  { key: 'lingerie', label: 'Lingerie', icon: '<path d="M12 6c-2 0-4 1.5-5 3.5C6 11.5 5 13 5 15a7 7 0 0 0 14 0c0-2-1-3.5-2-5.5C16 7.5 14 6 12 6z" stroke="currentColor" stroke-width="1.4"/>' }
];

/* The directory itself. Sections render in this order. */
const SECTIONS = [
  {
    cat: 'apparel', title: 'Apparel',
    stores: [
      { name: 'ARROW', floors: ['1f'] },
      { name: 'BLACKBERRYS', floors: ['1f'] },
      { name: 'BONKERS CORNER', floors: ['1f'] },
      { name: 'CALVIN KLEIN', floors: ['gf'] },
      { name: 'GO COLORS', floors: ['2f'] },
      { name: 'H&M', floors: ['gf', '1f'] },
      { name: 'LEVI\'S', floors: ['gf'] },
      { name: 'LIFESTYLE', floors: ['gf', '1f', '2f'] },
      { name: 'LOUIS PHILIPPE', floors: ['1f'] },
      { name: 'MADAME', floors: ['1f'] },
      { name: 'MARKS & SPENCER', floors: ['gf'] },
      { name: 'MAX', floors: ['1f'] },
      { name: 'PEPE JEANS', floors: ['1f'] },
      { name: 'R&B', floors: ['1f'] },
      { name: 'RARE RABBIT', floors: ['gf'] },
      { name: 'RAREISM', floors: ['gf'] },
      { name: 'SNITCH', floors: ['1f'] },
      { name: 'STYLE UNION', floors: ['con'] },
      { name: 'THE BEAR HOUSE', floors: ['1f'] },
      { name: 'TOMMY HILFIGER', floors: ['gf'] },
      { name: 'U.S. POLO ASSN.', floors: ['1f'] },
      { name: 'VAN HEUSEN', floors: ['1f'] },
      { name: 'WESTSIDE', floors: ['gf'] },
      { name: 'ZUDIO', floors: ['1f'] }
    ]
  },
  {
    cat: 'ethnic', title: 'Ethnic Wear',
    stores: [
      { name: 'BARARA ETHNIC', floors: ['2f'] },
      { name: 'BIBA', floors: ['2f'] },
      { name: 'LIBAS', floors: ['2f'] },
      { name: 'MEENA BAZAAR', floors: ['2f'] },
      { name: 'SABHYATA', floors: ['2f'] },
      { name: 'TASVA', floors: ['2f'] }
    ]
  },
  {
    cat: 'footwear', title: 'Footwear',
    stores: [
      { name: 'ALDO', floors: ['gf'] },
      { name: 'BIRKENSTOCK', floors: ['gf'] },
      { name: 'CROCS', floors: ['1f'] },
      { name: 'INC.5', floors: ['1f'] },
      { name: 'MOCHI', floors: ['1f'] }
    ]
  },
  {
    cat: 'sportswear', title: 'Sportswear',
    stores: [
      { name: 'ADIDAS', floors: ['1f'] },
      { name: 'ASICS', floors: ['1f'] },
      { name: 'PUMA', floors: ['1f'] },
      { name: 'SKECHERS', floors: ['1f'] }
    ]
  },
  {
    cat: 'food', title: 'Food Court',
    stores: [
      { name: 'AMRITSARI EXPRESS', floors: ['3f'] },
      { name: 'BURGER KING', floors: ['3f'] },
      { name: 'CAFÉ CHENNAI', floors: ['3f'] },
      { name: 'GIANI ICE CREAM', floors: ['3f'] },
      { name: 'HALDIRAM\'S', floors: ['3f'] },
      { name: 'KEVENTERS', floors: ['3f'] },
      { name: 'KFC', floors: ['3f'] },
      { name: 'TACO BELL', floors: ['3f'] },
      { name: 'THE INDIAN STORIES', floors: ['3f'] },
      { name: 'TONIQ', floors: ['3f'] },
      { name: 'WOW! CHINA', floors: ['3f'] },
      { name: 'WOW! KULFI', floors: ['3f'] },
      { name: 'WOW! MOMO', floors: ['3f'] }
    ]
  },
  {
    cat: 'cafe', title: 'Café',
    stores: [
      { name: 'BLUE TOKAI', floors: ['gf'] },
      { name: 'CHAAYOS', floors: ['1f'] },
      { name: 'THIRD WAVE COFFEE', floors: ['1f'] }
    ]
  },
  {
    cat: 'jewellery', title: 'Jewellery',
    stores: [
      { name: 'BLUESTONE', floors: ['gf'] },
      { name: 'CARATLANE', floors: ['gf'] },
      { name: 'ETHERA', floors: ['gf'] },
      { name: 'GIVA', floors: ['gf'] },
      { name: 'LIMELIGHT', floors: ['gf'] },
      { name: 'PALMONAS', floors: ['gf'] }
    ]
  },
  {
    cat: 'watches', title: 'Watches',
    stores: [
      { name: 'HELIOS', floors: ['gf'] },
      { name: 'TISSOT', floors: ['gf'] },
      { name: 'TISSOT MBO', floors: ['gf'] }
    ]
  },
  {
    cat: 'eyewear', title: 'Eyewear',
    stores: [
      { name: 'RUNWAY', floors: ['gf'] }
    ]
  },
  {
    cat: 'beauty', title: 'Beauty & Skincare',
    stores: [
      { name: 'BATH & BODY WORKS', floors: ['gf'] },
      { name: 'FOREST ESSENTIALS', floors: ['gf'] },
      { name: 'NYKAA LUXE', floors: ['gf'] },
      { name: 'SKINBAE', floors: ['gf'] }
    ]
  },
  {
    cat: 'salon', title: 'Salon',
    stores: [
      { name: 'GEETANJALI SALON', floors: ['1f'] }
    ]
  },
  {
    cat: 'kids', title: 'Kid\'s Fashion',
    stores: [
      { name: 'BABYSHOP', floors: ['2f'] }
    ]
  },
  {
    cat: 'kids', title: 'Kid\'s Footwear',
    stores: [
      { name: 'ARETTO', floors: ['2f'] }
    ]
  },
  {
    cat: 'home', title: 'Home & Lifestyle',
    stores: [
      { name: 'FRIDO', floors: ['con'] },
      { name: 'HAPPYNEST', floors: ['con'] },
      { name: 'MARKET99', floors: ['3f'] },
      { name: 'MINISO', floors: ['1f'] },
      { name: 'MR. D.I.Y.', floors: ['con'] },
      { name: 'THE SLEEP COMPANY', floors: ['con'] },
      { name: 'WAKEFIT', floors: ['con'] }
    ]
  },
  {
    cat: 'bags', title: 'Bags & Accessories',
    stores: [
      { name: 'AMERICAN TOURISTER', floors: ['con'] },
      { name: 'HIDESIGN', floors: ['gf'] },
      { name: 'SAFARI', floors: ['con'] },
      { name: 'SAMSONITE', floors: ['1f'] }
    ]
  },
  {
    cat: 'mobile', title: 'Mobile & Electronics',
    stores: [
      { name: 'SAMSUNG', floors: ['1f'] },
      { name: 'VIVO', floors: ['con'] }
    ]
  },
  {
    cat: 'books', title: 'Books & Stationary',
    stores: [
      { name: 'OM BOOK SHOP', floors: ['2f'] }
    ]
  },
  {
    cat: 'entertainment', title: 'Entertainment',
    stores: [
      { name: 'FUNCITY', floors: ['3f'] }
    ]
  },
  {
    cat: 'lingerie', title: 'Lingerie',
    stores: [
      { name: 'NYKD BY NYKAA', floors: ['2f'] }
    ]
  }
];
