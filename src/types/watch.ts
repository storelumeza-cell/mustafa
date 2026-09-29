export type DialColor = 'Emerald' | 'Blue' | 'Black' | 'Gold' | 'Silver' | 'White' | 'Rose Gold' | 'Red' | string;

export type StrapMaterial = 'Stainless Steel' | 'Genuine Leather' | 'Ceramic' | 'Silicone' | 'Mesh' | string;

export type MovementType = 'Japanese Quartz' | 'Automatic Skeleton' | 'Multi-function Quartz' | string;

export type WaterResistance = '3 ATM' | '5 ATM' | '10 ATM' | string;

export interface WatchReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  location: string;
}

export interface Watch {
  id: string;
  name: string;
  tagline: string;
  sku: string;
  collection: string; // Dynamic Category
  pricePKR: number; // Selling price after discount
  originalPricePKR?: number; // Real / MSRP original price
  discountPercent?: number; // Discount % (e.g. 20%)
  rating: number;
  reviewCount: number;
  primaryImage: string;
  secondaryImage?: string;
  galleryImages: string[];
  dialColor: DialColor;
  availableColors?: string[]; // Multiple color options
  strapMaterial: StrapMaterial;
  movement: MovementType;
  caseDiameter: string;
  caseThickness: string;
  bandWidth: string;
  glassType: string;
  waterResistance: WaterResistance;
  weight: string;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  badgeText?: string;
  description: string;
  features: string[];
  warrantyYears: number;
  packageIncludes: string[];
  reviews: WatchReview[];
}

export type Currency = 'PKR' | 'USD' | 'AED' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rateFromPKR: number;
  format: (amount: number) => string;
}

export interface FilterState {
  collection: string;
  dialColor: string;
  strapMaterial: string;
  movement: string;
  waterResistance: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}

export interface CartItem {
  watch: Watch;
  quantity: number;
  includeGiftBox: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  accountTitle: string;
  accountNumber: string;
  instructions: string;
  type: 'bank' | 'mobile_wallet' | 'cod' | 'card';
  enabled: boolean;
}

export interface CustomerDetails {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  accountNumber: string; // The account / sender reference number user pays from
  streetAddress?: string;
  city?: string;
  deliveryNotes?: string;
}

export interface SentEmailNotification {
  id: string;
  fromEmail: string;
  toEmail: string;
  customerName: string;
  orderId: string;
  subject: string;
  body: string;
  sentAt: string;
  channel?: 'email' | 'whatsapp';
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotalPKR: number;
  discountPKR: number;
  shippingPKR: number;
  totalPKR: number;
  currency: Currency;
  currencyRate: number;
  paymentMethodId: string;
  paymentMethodName: string;
  paymentStatus: 'Awaiting Admin Confirmation' | 'Payment Verified' | 'Refunded';
  deliveryStatus: 'Pending Admin Confirmation' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  confirmationEmailSent: boolean;
  whatsappSent?: boolean;
  confirmedAt?: string;
  appliedPromo?: string;
}
