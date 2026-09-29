import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Watch,
  FilterState,
  CartItem,
  Currency,
  Order,
  CustomerDetails,
  PaymentMethodConfig,
  SentEmailNotification,
  UserAccount,
} from '../types/watch';
import {
  INITIAL_SHOW_WATCHES,
  CURRENCY_CONFIGS,
  PROMO_CODES,
  DEFAULT_CATEGORIES,
  DEFAULT_PAYMENT_METHODS,
} from '../data/watches';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Watches & Catalog
  watches: Watch[];
  filteredWatches: Watch[];
  addProduct: (watch: Omit<Watch, 'id'>) => Watch;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updated: Partial<Watch>) => void;

  // Categories
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;

  // Payment Methods / Modes
  paymentMethods: PaymentMethodConfig[];
  addPaymentMethod: (pm: Omit<PaymentMethodConfig, 'id'>) => void;
  updatePaymentMethod: (id: string, updated: Partial<PaymentMethodConfig>) => void;
  deletePaymentMethod: (id: string) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotalPKR: number;
  cartDiscountPKR: number;
  cartTotalPKR: number;
  freeShippingThresholdPKR: number;
  freeShippingProgress: number;
  addToCart: (watch: Watch, qty?: number, giftBox?: boolean) => void;
  updateCartQuantity: (watchId: string, deltaOrExact: number, isExact?: boolean) => void;
  toggleGiftBox: (watchId: string) => void;
  removeFromCart: (watchId: string) => void;
  clearCart: () => void;

  // Wishlist & Compare
  wishlist: string[];
  compareList: string[];
  toggleWishlist: (watchId: string) => void;
  isInWishlist: (watchId: string) => boolean;
  toggleCompare: (watchId: string) => void;
  isInCompare: (watchId: string) => boolean;
  removeFromCompare: (watchId: string) => void;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountPKR: number) => string;

  // Filters
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;

  // Modals & Panels
  selectedWatch: Watch | null;
  setSelectedWatch: (watch: Watch | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  openAddProductModal: () => void;
  isOrderConfirmedOpen: boolean;
  setIsOrderConfirmedOpen: (open: boolean) => void;

  // User Authentication & Account
  currentUser: UserAccount | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  login: (identifier: string, password: string) => { success: boolean; message: string; role?: 'admin' | 'customer' };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  // Promos
  appliedPromo: string;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  // Orders & Admin Management
  adminEmail: string;
  orders: Order[];
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  completeOrder: (customer: CustomerDetails, paymentMethodId: string) => Order;
  confirmOrderAdmin: (orderId: string) => void;
  sendAIAgentOrderEmail: (orderId: string, recipientEmail: string, subject: string, body: string) => void;
  markOrderDispatched: (orderId: string) => void;
  cancelOrderAdmin: (orderId: string) => void;
  deleteOrderAdmin: (orderId: string) => void;

  // Email notifications log
  sentEmails: SentEmailNotification[];

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialFilters: FilterState = {
  collection: 'All',
  dialColor: 'All',
  strapMaterial: 'All',
  movement: 'All',
  waterResistance: 'All',
  priceRange: [10000, 40000],
  inStockOnly: false,
  sortBy: 'featured',
  searchQuery: '',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('mi_currency');
      return (saved as Currency) || 'PKR';
    } catch {
      return 'PKR';
    }
  });

  // Watches Catalog (initialized with only 2 show listings)
  const [watches, setWatches] = useState<Watch[]>(() => {
    try {
      const saved = localStorage.getItem('mi_watches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SHOW_WATCHES;
  });

  // Categories
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mi_categories');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CATEGORIES;
  });

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    try {
      const saved = localStorage.getItem('mi_payment_methods');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PAYMENT_METHODS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mi_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [{ watch: INITIAL_SHOW_WATCHES[0], quantity: 1, includeGiftBox: true }];
  });

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<FilterState>(initialFilters);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = useState(false);

  // User Accounts & Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('mi_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mi_registered_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'usr-admin-mustafa',
        name: 'Mustafa Iqbal',
        email: 'iqbalmustafa2007@gmail.com',
        phone: '03001234567',
        role: 'admin',
        password: '223300',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('mi_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('mi_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_registered_users', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }
  }, [registeredUsers]);

  const login = (identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/[^0-9]/g, '');

    // Check Master Admin Credentials
    if (
      (cleanId === 'iqbalmustafa2007@gmail.com' || cleanPhone === '03001234567' || cleanId === 'admin') &&
      pass === '223300'
    ) {
      const adminUser: UserAccount = {
        id: 'usr-admin-mustafa',
        name: 'Mustafa Iqbal',
        email: 'iqbalmustafa2007@gmail.com',
        phone: '03001234567',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      setCurrentUser(adminUser);
      try {
        sessionStorage.setItem('mi_admin_authenticated', 'true');
      } catch {
        // ignore
      }
      setIsAuthModalOpen(false);
      setIsAdminOpen(true);
      showToast('Welcome Mustafa Iqbal! Store Administrator Portal unlocked.', 'success');
      return { success: true, role: 'admin' as const, message: 'Welcome back, Mustafa Iqbal!' };
    }

    // Check in Registered Users
    const found = registeredUsers.find((u) => {
      const uEmail = u.email?.trim().toLowerCase();
      const uPhone = u.phone?.replace(/[^0-9]/g, '');
      const matchIdentifier = (uEmail && uEmail === cleanId) || (uPhone && cleanPhone && uPhone === cleanPhone);
      return matchIdentifier && u.password === pass;
    });

    if (found) {
      const userObj: UserAccount = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: found.role || 'customer',
        createdAt: found.createdAt || new Date().toISOString(),
      };
      setCurrentUser(userObj);
      setIsAuthModalOpen(false);

      if (userObj.role === 'admin') {
        try {
          sessionStorage.setItem('mi_admin_authenticated', 'true');
        } catch {
          // ignore
        }
        setIsAdminOpen(true);
        showToast('Administrator session activated.', 'success');
      } else {
        showToast(`Welcome back, ${userObj.name}!`, 'success');
      }
      return { success: true, role: userObj.role, message: `Welcome, ${userObj.name}!` };
    }

    return {
      success: false,
      message: 'Invalid email, phone number, or password. Please verify your credentials.',
    };
  };

  const register = (name: string, email: string, phone: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!name.trim() || !cleanEmail || !cleanPhone || !pass) {
      return { success: false, message: 'Please fill in all registration fields.' };
    }

    // Check duplicate
    const exists = registeredUsers.some(
      (u) => u.email?.toLowerCase() === cleanEmail || (cleanPhone && u.phone === cleanPhone)
    );
    if (exists && cleanEmail !== 'iqbalmustafa2007@gmail.com') {
      return { success: false, message: 'An account with this email or phone number already exists.' };
    }

    const isAdmin = cleanEmail === 'iqbalmustafa2007@gmail.com';
    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: pass,
      role: (isAdmin ? 'admin' : 'customer') as 'admin' | 'customer',
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    const userAccount: UserAccount = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    setCurrentUser(userAccount);
    setIsAuthModalOpen(false);

    if (isAdmin) {
      try {
        sessionStorage.setItem('mi_admin_authenticated', 'true');
      } catch {
        // ignore
      }
      setIsAdminOpen(true);
      showToast('Welcome, Mustafa Iqbal! Administrator account registered.', 'success');
    } else {
      showToast(`Account created successfully! Welcome, ${userAccount.name}.`, 'success');
    }

    return { success: true, message: 'Account successfully registered!' };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('mi_admin_authenticated');
    } catch {
      // ignore
    }
    showToast('You have been logged out.', 'info');
  };

  const openAddProductModal = () => {
    setIsAdminOpen(true);
    setIsAddProductModalOpen(true);
  };

  const [appliedPromo, setAppliedPromo] = useState('MUSTAFA10');

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mi_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial order in admin panel so user can immediately test "Confirm Order"
    return [
      {
        id: 'MI-10492-PK',
        trackingNumber: 'TRAK-892104',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        customer: {
          email: 'customer@example.com',
          firstName: 'Kamran',
          lastName: 'Akhtar',
          phone: '03001234567',
          accountNumber: '03001234567',
          streetAddress: 'House 14, Street 9, DHA',
          city: 'Lahore',
          deliveryNotes: 'Please ring bell upon arrival.',
        },
        items: [{ watch: INITIAL_SHOW_WATCHES[0], quantity: 1, includeGiftBox: true }],
        subtotalPKR: 18500,
        discountPKR: 1850,
        shippingPKR: 0,
        totalPKR: 16650,
        currency: 'PKR',
        currencyRate: 1,
        paymentMethodId: 'easypaisa',
        paymentMethodName: 'EasyPaisa',
        paymentStatus: 'Awaiting Admin Confirmation',
        deliveryStatus: 'Pending Admin Confirmation',
        confirmationEmailSent: false,
        appliedPromo: 'MUSTAFA10',
      },
    ];
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Sent Emails Log
  const [sentEmails, setSentEmails] = useState<SentEmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem('mi_sent_emails');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [toast, setToast] = useState<ToastState | null>(null);

  // Local storage persistence
  useEffect(() => {
    try {
      localStorage.setItem('mi_watches', JSON.stringify(watches));
    } catch (e) {
      console.error(e);
    }
  }, [watches]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_payment_methods', JSON.stringify(paymentMethods));
    } catch (e) {
      console.error(e);
    }
  }, [paymentMethods]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_sent_emails', JSON.stringify(sentEmails));
    } catch (e) {
      console.error(e);
    }
  }, [sentEmails]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_currency', currency);
    } catch (e) {
      console.error(e);
    }
  }, [currency]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const formatPrice = (amountPKR: number): string => {
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.PKR;
    return config.format(amountPKR);
  };

  // Catalog Add / Delete / Edit
  const addProduct = (newWatchData: Omit<Watch, 'id'>): Watch => {
    const randomId = 'mi-watch-' + Date.now();
    const createdWatch: Watch = {
      ...newWatchData,
      id: randomId,
    };
    setWatches((prev) => [createdWatch, ...prev]);
    showToast(`Added "${createdWatch.name}" to store catalog!`, 'success');
    return createdWatch;
  };

  const deleteProduct = (id: string) => {
    setWatches((prev) => prev.filter((w) => w.id !== id));
    setCart((prev) => prev.filter((item) => item.watch.id !== id));
    showToast('Product removed from store', 'info');
  };

  const updateProduct = (id: string, updated: Partial<Watch>) => {
    setWatches((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
    showToast('Product updated successfully', 'success');
  };

  // Categories Add / Delete
  const addCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast('Category already exists', 'error');
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    showToast(`Category "${trimmed}" added!`, 'success');
  };

  const deleteCategory = (category: string) => {
    setCategories((prev) => prev.filter((c) => c !== category));
    showToast(`Category "${category}" removed`, 'info');
  };

  // Payment Methods Add / Update / Delete
  const addPaymentMethod = (pm: Omit<PaymentMethodConfig, 'id'>) => {
    const id = 'pm-' + Date.now();
    const newPm: PaymentMethodConfig = { ...pm, id };
    setPaymentMethods((prev) => [...prev, newPm]);
    showToast(`Payment method "${newPm.name}" added!`, 'success');
  };

  const updatePaymentMethod = (id: string, updated: Partial<PaymentMethodConfig>) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => (pm.id === id ? { ...pm, ...updated } : pm))
    );
    showToast('Payment method updated', 'success');
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    showToast('Payment method removed', 'info');
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilterState(initialFilters);
    showToast('Filters reset to default', 'info');
  };

  // Filtered Watches calculation
  const filteredWatches = useMemo(() => {
    return watches.filter((watch) => {
      if (filterState.collection !== 'All' && watch.collection !== filterState.collection) {
        return false;
      }
      if (filterState.dialColor !== 'All' && watch.dialColor !== filterState.dialColor) {
        return false;
      }
      if (filterState.strapMaterial !== 'All' && watch.strapMaterial !== filterState.strapMaterial) {
        return false;
      }
      if (filterState.movement !== 'All' && watch.movement !== filterState.movement) {
        return false;
      }
      if (filterState.waterResistance !== 'All' && watch.waterResistance !== filterState.waterResistance) {
        return false;
      }
      if (
        watch.pricePKR < filterState.priceRange[0] ||
        watch.pricePKR > filterState.priceRange[1]
      ) {
        return false;
      }
      if (filterState.inStockOnly && !watch.inStock) {
        return false;
      }
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const matchesName = watch.name.toLowerCase().includes(q);
        const matchesTagline = watch.tagline.toLowerCase().includes(q);
        const matchesSku = watch.sku.toLowerCase().includes(q);
        const matchesCollection = watch.collection.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesSku && !matchesCollection) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.pricePKR - b.pricePKR;
      if (filterState.sortBy === 'price-desc') return b.pricePKR - a.pricePKR;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [watches, filterState]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotalPKR = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + item.watch.pricePKR * item.quantity;
    }, 0);
  }, [cart]);

  const freeShippingThresholdPKR = 15000;
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotalPKR / freeShippingThresholdPKR) * 100)
  );

  const cartDiscountPKR = useMemo(() => {
    if (!appliedPromo) return 0;
    const promo = PROMO_CODES[appliedPromo.toUpperCase()];
    if (!promo) return 0;
    if (promo.discountPercent) {
      return Math.round((cartSubtotalPKR * promo.discountPercent) / 100);
    }
    if (promo.fixedDiscountPKR) {
      return Math.min(cartSubtotalPKR, promo.fixedDiscountPKR);
    }
    return 0;
  }, [cartSubtotalPKR, appliedPromo]);

  const cartTotalPKR = Math.max(0, cartSubtotalPKR - cartDiscountPKR);

  // Cart Actions
  const addToCart = (watch: Watch, qty = 1, giftBox = true) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.watch.id === watch.id);
      if (existing) {
        return prev.map((item) =>
          item.watch.id === watch.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { watch, quantity: qty, includeGiftBox: giftBox }];
    });
    showToast(`Added ${watch.name} to bag`, 'success');
  };

  const updateCartQuantity = (watchId: string, deltaOrExact: number, isExact = false) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.watch.id !== watchId) return item;
          const nextQty = isExact ? deltaOrExact : item.quantity + deltaOrExact;
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const toggleGiftBox = (watchId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.watch.id === watchId
          ? { ...item, includeGiftBox: !item.includeGiftBox }
          : item
      )
    );
  };

  const removeFromCart = (watchId: string) => {
    setCart((prev) => prev.filter((item) => item.watch.id !== watchId));
    showToast('Removed item from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Promo
  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (PROMO_CODES[clean]) {
      setAppliedPromo(clean);
      showToast(`Promo "${clean}" applied!`, 'success');
      return { success: true, message: PROMO_CODES[clean].label };
    }
    showToast('Invalid promo code. Try "MUSTAFA10"', 'error');
    return { success: false, message: 'Invalid code' };
  };

  const removePromo = () => {
    setAppliedPromo('');
    showToast('Promo removed', 'info');
  };

  // Wishlist & Compare
  const toggleWishlist = (watchId: string) => {
    setWishlist((prev) => {
      if (prev.includes(watchId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== watchId);
      } else {
        showToast('Added to wishlist', 'success');
        return [...prev, watchId];
      }
    });
  };

  const isInWishlist = (watchId: string) => wishlist.includes(watchId);

  const toggleCompare = (watchId: string) => {
    setCompareList((prev) => {
      if (prev.includes(watchId)) return prev.filter((id) => id !== watchId);
      if (prev.length >= 3) {
        showToast('Max 3 watches can be compared', 'info');
        return prev;
      }
      showToast('Added to comparison', 'success');
      return [...prev, watchId];
    });
  };

  const isInCompare = (watchId: string) => compareList.includes(watchId);
  const removeFromCompare = (watchId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== watchId));
  };

  // User Checkout Order Creation
  const completeOrder = (customer: CustomerDetails, paymentMethodId: string): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MI-${randomSuffix}-PK`;
    const trackingNumber = `TRAK-${Date.now().toString().slice(-6)}`;
    const currConfig = CURRENCY_CONFIGS[currency];

    const selectedPm = paymentMethods.find((p) => p.id === paymentMethodId);
    const pmName = selectedPm ? selectedPm.name : 'Direct Payment';

    const newOrder: Order = {
      id: orderId,
      trackingNumber,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotalPKR: cartSubtotalPKR,
      discountPKR: cartDiscountPKR,
      shippingPKR: cartSubtotalPKR >= freeShippingThresholdPKR ? 0 : 450,
      totalPKR: cartTotalPKR + (cartSubtotalPKR >= freeShippingThresholdPKR ? 0 : 450),
      currency,
      currencyRate: currConfig.rateFromPKR,
      paymentMethodId,
      paymentMethodName: pmName,
      paymentStatus: 'Awaiting Admin Confirmation',
      deliveryStatus: 'Pending Admin Confirmation',
      confirmationEmailSent: false,
      appliedPromo: appliedPromo || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderConfirmedOpen(true);
    showToast(`Order ${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const adminEmail = 'iqbalmustafa2007@gmail.com';

  // Admin Order Actions: Confirm Order & Trigger Email to Customer
  const confirmOrderAdmin = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const emailSubject = `Order ${order.id} Confirmed! — Mustafa Iqbal Watches`;
    const emailBody = `Dear ${order.customer.firstName} ${order.customer.lastName},\n\nWe are pleased to inform you that your payment and order for ${order.items.length} timepiece(s) have been verified and CONFIRMED by Mustafa Iqbal Horology.\n\nFrom Store Administrator: ${adminEmail}\nOrder Number: ${order.id}\nTracking ID: ${order.trackingNumber}\nPayment Mode: ${order.paymentMethodName}\nSender Account / Number: ${order.customer.accountNumber}\nTotal Paid / Payable: Rs. ${order.totalPKR.toLocaleString()}\n\nYour luxury timepiece has entered quality inspection and will be dispatched to ${order.customer.streetAddress || ''}, ${order.customer.city || ''} via express insured courier.\n\nThank you for choosing Mustafa Iqbal.\n\nWarm regards,\nMustafa Iqbal (${adminEmail})`;

    const newEmail: SentEmailNotification = {
      id: 'email-' + Date.now(),
      fromEmail: adminEmail,
      toEmail: order.customer.email,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      orderId: order.id,
      subject: emailSubject,
      body: emailBody,
      sentAt: new Date().toISOString(),
      channel: 'email',
    };

    const newWhatsApp: SentEmailNotification = {
      id: 'wa-' + Date.now(),
      fromEmail: adminEmail,
      toEmail: order.customer.phone,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      orderId: order.id,
      subject: `WhatsApp Payment Confirmation to ${order.customer.phone}`,
      body: `Assalam o Alaikum ${order.customer.firstName}!\n\nYour payment and order #${order.id} have been verified & confirmed by Mustafa Iqbal Watches (${adminEmail}).\nTotal: Rs. ${order.totalPKR.toLocaleString()}\nSender Account: ${order.customer.accountNumber}\nTracking ID: ${order.trackingNumber}\n\nYour parcel is packed and scheduled for insured express courier dispatch. Thank you for your trust in Mustafa Iqbal!`,
      sentAt: new Date().toISOString(),
      channel: 'whatsapp',
    };

    setSentEmails((prev) => [newWhatsApp, newEmail, ...prev]);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: 'Payment Verified',
              deliveryStatus: 'Confirmed',
              confirmationEmailSent: true,
              whatsappSent: true,
              confirmedAt: new Date().toISOString(),
            }
          : o
      )
    );

    showToast(
      `Order ${orderId} confirmed! Email notification dispatched from ${adminEmail} to ${order.customer.email}`,
      'success'
    );
  };

  const sendAIAgentOrderEmail = (
    orderId: string,
    recipientEmail: string,
    subject: string,
    body: string
  ) => {
    const order = orders.find((o) => o.id === orderId);
    const targetEmail = recipientEmail.trim() || order?.customer.email || 'customer@example.com';
    const customerName = order ? `${order.customer.firstName} ${order.customer.lastName}` : 'Valued Customer';

    const newEmailRecord: SentEmailNotification = {
      id: 'email-ai-' + Date.now(),
      fromEmail: adminEmail,
      toEmail: targetEmail,
      customerName,
      orderId,
      subject,
      body,
      sentAt: new Date().toISOString(),
      channel: 'email',
    };

    setSentEmails((prev) => [newEmailRecord, ...prev]);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            customer: {
              ...o.customer,
              email: targetEmail,
            },
            paymentStatus: 'Payment Verified',
            deliveryStatus: 'Confirmed',
            confirmationEmailSent: true,
            confirmedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    showToast(`AI Confirmation Email dispatched from ${adminEmail} to ${targetEmail}!`, 'success');
  };

  const markOrderDispatched = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, deliveryStatus: 'Dispatched' } : o
      )
    );
    showToast(`Order ${orderId} marked as Dispatched via courier`, 'info');
  };

  const cancelOrderAdmin = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, deliveryStatus: 'Cancelled', paymentStatus: 'Refunded' }
          : o
      )
    );
    showToast(`Order ${orderId} has been cancelled`, 'info');
  };

  const deleteOrderAdmin = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order ${orderId} deleted from records`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        watches,
        filteredWatches,
        addProduct,
        deleteProduct,
        updateProduct,
        categories,
        addCategory,
        deleteCategory,
        paymentMethods,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        cart,
        cartCount,
        cartSubtotalPKR,
        cartDiscountPKR,
        cartTotalPKR,
        freeShippingThresholdPKR,
        freeShippingProgress,
        addToCart,
        updateCartQuantity,
        toggleGiftBox,
        removeFromCart,
        clearCart,
        wishlist,
        compareList,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        currency,
        setCurrency,
        formatPrice,
        filterState,
        setFilterState,
        updateFilter,
        resetFilters,
        selectedWatch,
        setSelectedWatch,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCompareOpen,
        setIsCompareOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        openAddProductModal,
        isOrderConfirmedOpen,
        setIsOrderConfirmedOpen,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        login,
        register,
        logout,
        appliedPromo,
        applyPromo,
        removePromo,
        adminEmail,
        orders,
        lastOrder,
        setLastOrder,
        completeOrder,
        confirmOrderAdmin,
        sendAIAgentOrderEmail,
        markOrderDispatched,
        cancelOrderAdmin,
        deleteOrderAdmin,
        sentEmails,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
