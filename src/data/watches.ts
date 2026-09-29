import { Watch, Currency, CurrencyConfig, PaymentMethodConfig } from '../types/watch';

import emeraldWatchImg from '../assets/images/watch_chronograph_emerald_1790659175957.jpg';
import skeletonWatchImg from '../assets/images/watch_automatic_skeleton_black_1790659188661.jpg';
import leatherBlueWatchImg from '../assets/images/watch_classic_leather_blue_1790659200054.jpg';
import diverSteelWatchImg from '../assets/images/watch_diver_steel_silver_1790659211469.jpg';
import heroWatchImg from '../assets/images/hero_sveston_luxury_watch_1790659162569.jpg';

export const HERO_IMAGE = heroWatchImg;

export const PRESET_WATCH_IMAGES = [
  { id: 'emerald', name: 'Emerald Chronograph', image: emeraldWatchImg },
  { id: 'skeleton', name: 'Phantom Skeleton Black', image: skeletonWatchImg },
  { id: 'blue_leather', name: 'Royal Blue Leather', image: leatherBlueWatchImg },
  { id: 'diver_steel', name: 'Submariner Diver Steel', image: diverSteelWatchImg },
  { id: 'flagship_hero', name: 'Flagship Slate Chronograph', image: heroWatchImg },
];

export const DEFAULT_CONTACT_PHONE = '03001234567'; // Clean 10-digit random number for show

export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: 'Rs.',
    rateFromPKR: 1,
    format: (amt: number) => `Rs. ${Math.round(amt).toLocaleString()}`,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateFromPKR: 0.0036,
    format: (amt: number) => `$${(amt * 0.0036).toFixed(2)}`,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    rateFromPKR: 0.0132,
    format: (amt: number) => `AED ${(amt * 0.0132).toFixed(0)}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateFromPKR: 0.0028,
    format: (amt: number) => `£${(amt * 0.0028).toFixed(2)}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateFromPKR: 0.0033,
    format: (amt: number) => `€${(amt * 0.0033).toFixed(2)}`,
  },
};

export const PROMO_CODES: Record<string, { discountPercent?: number; fixedDiscountPKR?: number; label: string }> = {
  MUSTAFA10: { discountPercent: 10, label: '10% Mustafa Iqbal Privilege Discount' },
  WELCOME15: { discountPercent: 15, label: '15% Welcome VIP Discount' },
};

export const DEFAULT_CATEGORIES: string[] = [
  'Chronographs',
  'Automatics',
  'Heritage Dress',
  'Divers',
  'Minimalist',
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    accountTitle: 'Mustafa Iqbal',
    accountNumber: '03001234567',
    instructions: 'Send payment via EasyPaisa to title "Mustafa Iqbal" at 03001234567. Enter your sender account number below to confirm.',
    type: 'mobile_wallet',
    enabled: true,
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    accountTitle: 'Mustafa Iqbal',
    accountNumber: '03001234567',
    instructions: 'Transfer to JazzCash account "Mustafa Iqbal" at 03001234567. Enter your JazzCash sender account number below to confirm.',
    type: 'mobile_wallet',
    enabled: true,
  },
  {
    id: 'bank_transfer',
    name: 'Direct Bank Transfer (Meezan / HBL)',
    accountTitle: 'Mustafa Iqbal',
    accountNumber: '0300123456789012',
    instructions: 'Transfer to Meezan Bank / HBL. Account Title: Mustafa Iqbal, Account: 0300123456789012. Enter your bank account/reference number below.',
    type: 'bank',
    enabled: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    accountTitle: 'Mustafa Iqbal Courier Desk',
    accountNumber: '03001234567',
    instructions: 'Pay cash to the courier representative when the parcel arrives at your doorstep. Enter your contact verification number below.',
    type: 'cod',
    enabled: true,
  },
];

// Exactly two show watches as requested: "remove all watches only two listing should have for shiw then i will add for myself"
export const INITIAL_SHOW_WATCHES: Watch[] = [
  {
    id: 'mi-chronograph-emerald',
    name: 'Mustafa Iqbal Royal Chronograph',
    tagline: 'Sunburst Emerald Dial with Tachymeter Bezel',
    sku: 'MI-901-EMR',
    collection: 'Chronographs',
    pricePKR: 18500,
    originalPricePKR: 26000,
    rating: 4.95,
    reviewCount: 42,
    primaryImage: emeraldWatchImg,
    secondaryImage: heroWatchImg,
    galleryImages: [emeraldWatchImg, heroWatchImg],
    dialColor: 'Emerald',
    strapMaterial: 'Stainless Steel',
    movement: 'Japanese Quartz',
    caseDiameter: '42mm',
    caseThickness: '11.5mm',
    bandWidth: '22mm',
    glassType: 'Sapphire Crystal Glass',
    waterResistance: '5 ATM',
    weight: '144g',
    inStock: true,
    isNew: true,
    isBestSeller: true,
    badgeText: 'Flagship Edition',
    description: 'Masterfully crafted by Mustafa Iqbal. Built with a rich sunburst emerald dial, multi-functional precision chronograph sub-registers, solid 316L surgical stainless steel link bracelet, and scratch-resistant sapphire crystal.',
    features: [
      'Original Japanese Quartz precision chronograph caliber',
      'Anti-reflective scratch-resistant sapphire crystal glass',
      'Solid 316L surgical stainless steel casing & link strap',
      'Luminescent hands & applied indices',
      'Water resistant to 50 meters (5 ATM)',
    ],
    warrantyYears: 1,
    packageIncludes: [
      'Official Mustafa Iqbal Luxury Leatherette Presentation Box',
      'Serialized 1-Year Official International Warranty Card',
      'Certificate of Authenticity with Hologram Seal',
      'Microfiber Polishing Cloth',
      'Strap Adjustment Pin Tool',
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Shahid Mehmood',
        rating: 5,
        date: 'March 2026',
        comment: 'Outstanding quality and finishing. The dial gleams wonderfully in sunlight. Delivery was swift.',
        verified: true,
        location: 'Lahore, PK',
      },
    ],
  },
  {
    id: 'mi-skeleton-automatic-black',
    name: 'Mustafa Iqbal Phantom Skeleton Automatic',
    tagline: '24-Jewel Self-Winding Kinetic Tourbillon',
    sku: 'MI-808-SKL',
    collection: 'Automatics',
    pricePKR: 29500,
    originalPricePKR: 39000,
    rating: 4.98,
    reviewCount: 36,
    primaryImage: skeletonWatchImg,
    secondaryImage: heroWatchImg,
    galleryImages: [skeletonWatchImg, heroWatchImg],
    dialColor: 'Black',
    strapMaterial: 'Ceramic',
    movement: 'Automatic Skeleton',
    caseDiameter: '43mm',
    caseThickness: '13mm',
    bandWidth: '22mm',
    glassType: 'Sapphire Crystal Glass',
    waterResistance: '5 ATM',
    weight: '158g',
    inStock: true,
    isNew: true,
    isBestSeller: false,
    badgeText: 'Mechanical Tourbillon',
    description: 'An open-heart horological showpiece. Reveals the rhythmic heartbeat of a 24-jewel automatic movement with golden gear trains, exhibition sapphire glass front and back, and high-tech ceramic links.',
    features: [
      'Kinetic self-winding mechanical automatic movement (no battery required)',
      'Dual exhibition front and sapphire crystal caseback',
      'High-tech scratch-resistant ceramic inserts',
      'Engineered open-work dial with gold gear trains',
    ],
    warrantyYears: 2,
    packageIncludes: [
      'Mustafa Iqbal Horology Carbon Edition Box',
      '2-Year Mechanical Movement International Warranty',
      'Horologist Inspection Certificate',
      'Microfiber Polishing Cloth',
    ],
    reviews: [
      {
        id: 'rev-2',
        author: 'Danish Ali',
        rating: 5,
        date: 'March 2026',
        comment: 'Pure luxury feel. The mechanical sweeping motion is smooth and the ceramic bracelet is top quality.',
        verified: true,
        location: 'Islamabad, PK',
      },
    ],
  },
];
