import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Mail,
  Package,
  Plus,
  Trash2,
  CreditCard,
  Layers,
  Phone,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Tag,
  Eye,
  Check,
  Upload,
  Image as ImageIcon,
  Palette,
  Percent,
  Edit3,
  Star,
  DollarSign,
  AlertCircle,
  Lock,
  EyeOff,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Watch, DialColor, StrapMaterial, MovementType, WaterResistance } from '../types/watch';
import { HERO_IMAGE, PRESET_WATCH_IMAGES } from '../data/watches';

const PRESET_COLORS = [
  { name: 'Emerald', hex: '#0f5132', label: 'Emerald Green' },
  { name: 'Blue', hex: '#1e3a8a', label: 'Midnight Blue' },
  { name: 'Black', hex: '#171717', label: 'Obsidian Black' },
  { name: 'Gold', hex: '#d97706', label: 'Champagne Gold' },
  { name: 'Rose Gold', hex: '#e07a5f', label: 'Rose Gold' },
  { name: 'Silver', hex: '#9ca3af', label: 'Silver Pearl' },
  { name: 'White', hex: '#f8fafc', label: 'Pure White' },
  { name: 'Red', hex: '#b91c1c', label: 'Crimson Red' },
];

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    orders,
    confirmOrderAdmin,
    markOrderDispatched,
    cancelOrderAdmin,
    deleteOrderAdmin,
    sentEmails,
    watches,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    deleteCategory,
    paymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    formatPrice,
    currentUser,
    login,
    logout,
    adminEmail,
    sendAIAgentOrderEmail,
  } = useStore();

  // Authentication State for Mustafa Iqbal
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      if (currentUser?.role === 'admin') return true;
      return sessionStorage.getItem('mi_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      setIsAdminAuthenticated(true);
    }
  }, [currentUser]);

  // AI Agent Email State
  const [aiEmailOrder, setAiEmailOrder] = useState<Order | null>(null);
  const [aiRecipientEmail, setAiRecipientEmail] = useState('');
  const [aiEmailSubject, setAiEmailSubject] = useState('');
  const [aiEmailBody, setAiEmailBody] = useState('');
  const [aiTone, setAiTone] = useState<'luxury' | 'courier' | 'concise'>('luxury');
  const [authEmail, setAuthEmail] = useState('iqbalmustafa2007@gmail.com');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'payments' | 'emails'>('orders');

  // Add / Edit Product Form State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Sync external request to open Add Product modal
  useEffect(() => {
    if (isAddProductModalOpen) {
      setActiveTab('products');
      setIsAddProductOpen(true);
      setEditingProductId(null);
    }
  }, [isAddProductModalOpen]);

  const [productName, setProductName] = useState('');
  const [productTagline, setProductTagline] = useState('');
  const [productCollection, setProductCollection] = useState(categories[0] || 'Chronographs');
  const [productBadge, setProductBadge] = useState('New Arrival');

  // Real Price & Discount calculation state
  const [realPrice, setRealPrice] = useState<number>(28000);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [sellingPrice, setSellingPrice] = useState<number>(21000);

  // Product Images state (supports multiple uploaded or chosen images)
  const [productImages, setProductImages] = useState<string[]>([PRESET_WATCH_IMAGES[0].image]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');

  // Colour Options state
  const [selectedDialColor, setSelectedDialColor] = useState<string>('Emerald');
  const [customColorName, setCustomColorName] = useState<string>('');
  const [customColorHex, setCustomColorHex] = useState<string>('#4f46e5');
  const [availableColors, setAvailableColors] = useState<string[]>(['Emerald', 'Black']);

  // Technical Specs
  const [productStrap, setProductStrap] = useState<StrapMaterial>('Stainless Steel');
  const [productMovement, setProductMovement] = useState<MovementType>('Japanese Quartz');
  const [productCase, setProductCase] = useState<string>('42mm');
  const [productWater, setProductWater] = useState<WaterResistance>('5 ATM');
  const [productDesc, setProductDesc] = useState<string>(
    'Masterpiece luxury men\'s timepiece crafted with 316L surgical stainless steel, Japanese precision movement, and anti-reflective sapphire crystal glass.'
  );

  // Add Category State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Add Payment Method State
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [newPmName, setNewPmName] = useState('');
  const [newPmTitle, setNewPmTitle] = useState('Mustafa Iqbal');
  const [newPmNumber, setNewPmNumber] = useState('03001234567');
  const [newPmInstructions, setNewPmInstructions] = useState('Send payment to account title and enter your sender account number upon checkout.');
  const [newPmType, setNewPmType] = useState<'mobile_wallet' | 'bank' | 'cod' | 'card'>('mobile_wallet');

  if (!isAdminOpen) return null;

  // Real Price & Discount Handlers (Two-way automatic calculation)
  const handleRealPriceChange = (val: number) => {
    const validReal = Math.max(0, val);
    setRealPrice(validReal);
    if (discountPercent > 0) {
      const calculated = Math.round(validReal - (validReal * discountPercent) / 100);
      setSellingPrice(calculated);
    } else {
      setSellingPrice(validReal);
    }
  };

  const handleDiscountPercentChange = (pct: number) => {
    const clamped = Math.min(95, Math.max(0, pct));
    setDiscountPercent(clamped);
    if (realPrice > 0) {
      const calculated = Math.round(realPrice - (realPrice * clamped) / 100);
      setSellingPrice(calculated);
    }
  };

  const handleSellingPriceChange = (saleVal: number) => {
    const validSale = Math.max(0, saleVal);
    setSellingPrice(validSale);
    if (realPrice > 0 && validSale < realPrice) {
      const pct = Math.round(((realPrice - validSale) / realPrice) * 100);
      setDiscountPercent(pct);
    } else {
      setDiscountPercent(0);
    }
  };

  const applyPresetDiscount = (pct: number) => {
    handleDiscountPercentChange(pct);
  };

  // Image Upload & Selection Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setProductImages((prev) => [...prev, resultStr]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setProductImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleSelectPresetImage = (imgSrc: string) => {
    if (!productImages.includes(imgSrc)) {
      setProductImages((prev) => [...prev, imgSrc]);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (productImages.length <= 1) return;
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex >= index && primaryImageIndex > 0) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  // Color selection handlers
  const handleToggleAvailableColor = (colorName: string) => {
    setAvailableColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const name = customColorName.trim();
    if (!availableColors.includes(name)) {
      setAvailableColors((prev) => [...prev, name]);
    }
    setSelectedDialColor(name);
    setCustomColorName('');
  };

  // Form Reset / Open Edit
  const handleOpenAddForm = () => {
    setEditingProductId(null);
    setProductName('');
    setProductTagline('');
    setProductCollection(categories[0] || 'Chronographs');
    setProductBadge('New Arrival');
    setRealPrice(28000);
    setDiscountPercent(25);
    setSellingPrice(21000);
    setProductImages([PRESET_WATCH_IMAGES[0].image]);
    setPrimaryImageIndex(0);
    setSelectedDialColor('Emerald');
    setAvailableColors(['Emerald', 'Black']);
    setProductStrap('Stainless Steel');
    setProductMovement('Japanese Quartz');
    setProductCase('42mm');
    setProductWater('5 ATM');
    setIsAddProductOpen(true);
  };

  const handleEditProduct = (watch: Watch) => {
    setEditingProductId(watch.id);
    setProductName(watch.name);
    setProductTagline(watch.tagline);
    setProductCollection(watch.collection);
    setProductBadge(watch.badgeText || '');
    setRealPrice(watch.originalPricePKR || watch.pricePKR);
    setSellingPrice(watch.pricePKR);
    if (watch.originalPricePKR && watch.originalPricePKR > watch.pricePKR) {
      setDiscountPercent(Math.round(((watch.originalPricePKR - watch.pricePKR) / watch.originalPricePKR) * 100));
    } else {
      setDiscountPercent(0);
    }
    const allImages = watch.galleryImages && watch.galleryImages.length > 0
      ? watch.galleryImages
      : [watch.primaryImage];
    setProductImages(allImages);
    setPrimaryImageIndex(0);
    setSelectedDialColor(watch.dialColor);
    setAvailableColors(watch.availableColors || [watch.dialColor]);
    setProductStrap(watch.strapMaterial);
    setProductMovement(watch.movement);
    setProductCase(watch.caseDiameter);
    setProductWater(watch.waterResistance);
    setProductDesc(watch.description);
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const primaryImg = productImages[primaryImageIndex] || productImages[0] || HERO_IMAGE;
    const secondaryImg = productImages.length > 1 ? productImages[(primaryImageIndex + 1) % productImages.length] : primaryImg;

    if (editingProductId) {
      // Update existing product
      updateProduct(editingProductId, {
        name: productName,
        tagline: productTagline || 'Mustafa Iqbal Signature Collection',
        collection: productCollection,
        pricePKR: Number(sellingPrice),
        originalPricePKR: realPrice > sellingPrice ? Number(realPrice) : undefined,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
        primaryImage: primaryImg,
        secondaryImage: secondaryImg,
        galleryImages: productImages,
        dialColor: selectedDialColor,
        availableColors: availableColors.length > 0 ? availableColors : [selectedDialColor],
        strapMaterial: productStrap,
        movement: productMovement,
        caseDiameter: productCase,
        waterResistance: productWater,
        badgeText: productBadge || undefined,
        description: productDesc,
      });
    } else {
      // Add new product
      const skuCode = 'MI-' + Math.floor(100 + Math.random() * 900);
      addProduct({
        name: productName,
        tagline: productTagline || 'Mustafa Iqbal Signature Collection',
        sku: skuCode,
        collection: productCollection,
        pricePKR: Number(sellingPrice),
        originalPricePKR: realPrice > sellingPrice ? Number(realPrice) : undefined,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
        rating: 5.0,
        reviewCount: 1,
        primaryImage: primaryImg,
        secondaryImage: secondaryImg,
        galleryImages: productImages,
        dialColor: selectedDialColor,
        availableColors: availableColors.length > 0 ? availableColors : [selectedDialColor],
        strapMaterial: productStrap,
        movement: productMovement,
        caseDiameter: productCase,
        caseThickness: '12mm',
        bandWidth: '22mm',
        glassType: 'Sapphire Crystal Glass',
        waterResistance: productWater,
        weight: '145g',
        inStock: true,
        isNew: true,
        badgeText: productBadge || undefined,
        description: productDesc,
        features: [
          'Precision calibrated movement',
          'Scratch-resistant sapphire crystal glass',
          'Solid 316L stainless steel architecture',
          '1-Year Official International Warranty',
        ],
        warrantyYears: 1,
        packageIncludes: [
          'Mustafa Iqbal Luxury Presentation Box',
          '1-Year International Warranty Card',
          'Microfiber Polishing Cloth',
        ],
        reviews: [
          {
            id: 'rev-init',
            author: 'Verified Buyer',
            rating: 5,
            date: 'March 2026',
            comment: 'Distinguished luxury timepiece, flawless finish and weight.',
            verified: true,
            location: 'Pakistan',
          },
        ],
      });
    }

    setIsAddProductOpen(false);
    setIsAddProductModalOpen(false);
    setEditingProductId(null);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName);
    setNewCategoryName('');
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPmName.trim() || !newPmNumber.trim()) return;
    addPaymentMethod({
      name: newPmName,
      accountTitle: newPmTitle,
      accountNumber: newPmNumber,
      instructions: newPmInstructions,
      type: newPmType,
      enabled: true,
    });
    setIsAddPaymentOpen(false);
    setNewPmName('');
  };

  const savingsAmount = Math.max(0, realPrice - sellingPrice);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = authEmail.trim().toLowerCase();
    const res = login(cleanEmail, authPassword);
    if (res.success && res.role === 'admin') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('mi_admin_authenticated', 'true');
      } catch {
        // ignore
      }
      setAuthError(null);
    } else {
      setAuthError('Incorrect email or password. Access is restricted to store administrator (iqbalmustafa2007@gmail.com / 223300).');
    }
  };

  const handleAdminLogout = () => {
    logout();
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('mi_admin_authenticated');
    } catch {
      // ignore
    }
    setAuthPassword('');
    setAuthError(null);
  };

  const sendWhatsAppConfirmation = (order: typeof orders[0]) => {
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(
      `Assalam o Alaikum ${order.customer.firstName}!\n\nYour order #${order.id} payment has been received and CONFIRMED by Mustafa Iqbal Watches (${adminEmail}).\nTotal: Rs. ${order.totalPKR.toLocaleString()}\nPayment Mode: ${order.paymentMethodName}\nSender Account: ${order.customer.accountNumber}\nTracking ID: ${order.trackingNumber}\n\nYour luxury timepiece has been verified and prepared for insured express courier delivery.\n\nThank you for choosing Mustafa Iqbal!`
    );
    window.open(`https://wa.me/${targetPhone || '923001234567'}?text=${msg}`, '_blank');
  };

  const generateAIEmailContent = (order: Order, tone: 'luxury' | 'courier' | 'concise') => {
    const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
    const itemsList = order.items
      .map(
        (i) =>
          `• ${i.watch.name} (Qty: ${i.quantity}) — Rs. ${(i.watch.pricePKR * i.quantity).toLocaleString()}`
      )
      .join('\n');
    const senderAcc = order.customer.accountNumber;
    const tracking = order.trackingNumber;
    const total = `Rs. ${order.totalPKR.toLocaleString()}`;
    const method = order.paymentMethodName;

    if (tone === 'luxury') {
      return {
        subject: `Order Confirmed: #${order.id} — Mustafa Iqbal Luxury Timepieces`,
        body: `Dear ${customerName},\n\nAssalam o Alaikum.\n\nThank you for choosing Mustafa Iqbal. We are pleased to formally confirm that your order #${order.id} has been verified and registered for fulfillment.\n\nFrom Store Administrator: ${adminEmail}\nStore: Mustafa Iqbal Luxury Watches\n\n═════════════════════════════════════\nORDER & PAYMENT VERIFICATION\n═════════════════════════════════════\nOrder ID: ${order.id}\nCourier Tracking ID: ${tracking}\nPayment Mode: ${method}\nSender Account / Reference: ${senderAcc}\nTotal Amount: ${total}\nPayment Status: VERIFIED & CONFIRMED\n\nPURCHASED TIMEPIECES:\n${itemsList}\n\n═════════════════════════════════════\nAUTHENTICITY & WARRANTY\n═════════════════════════════════════\nYour timepiece is constructed with 316L surgical stainless steel, sapphire crystal glass, and Japanese precision caliber. It is covered under our 1-Year Official Warranty.\n\nOur team is preparing your package for express insured courier delivery to:\n${order.customer.streetAddress || ''}, ${order.customer.city || ''}\n\nIf you have any questions, you can reply directly to this email at ${adminEmail} or reach us via WhatsApp.\n\nWarm regards,\n\nMustafa Iqbal\nFounder & Master Horologist\nMustafa Iqbal Watches\nEmail: ${adminEmail}`,
      };
    } else if (tone === 'courier') {
      return {
        subject: `Express Courier Dispatch Confirmation #${order.id} — Mustafa Iqbal`,
        body: `Hello ${customerName},\n\nYour order #${order.id} payment has been confirmed by store administrator Mustafa Iqbal (${adminEmail}).\n\nTracking ID: ${tracking}\nCourier: Express Insured Cargo\nTotal Amount: ${total} (Paid via ${method})\nDestination: ${order.customer.streetAddress || ''}, ${order.customer.city || ''}\nContact Phone: ${order.customer.phone}\n\nItems in Shipment:\n${itemsList}\n\nYour package is scheduled for courier handover. You will receive an SMS and WhatsApp alert upon arrival in your city.\n\nBest regards,\nMustafa Iqbal\n${adminEmail}`,
      };
    } else {
      return {
        subject: `Order #${order.id} Payment Confirmed — Mustafa Iqbal`,
        body: `Dear ${customerName},\n\nThis is Mustafa Iqbal (${adminEmail}) confirming that your payment of ${total} for Order #${order.id} has been received and verified.\n\nTracking Number: ${tracking}\nItems: ${order.items.length} timepiece(s)\nStatus: Confirmed & Packing\n\nThank you for shopping with Mustafa Iqbal Watches!\n\nOfficial Email: ${adminEmail}`,
      };
    }
  };

  const openAIEmailModal = (order: Order) => {
    setAiEmailOrder(order);
    setAiRecipientEmail(order.customer.email);
    const generated = generateAIEmailContent(order, 'luxury');
    setAiEmailSubject(generated.subject);
    setAiEmailBody(generated.body);
    setAiTone('luxury');
  };

  const handleToneChange = (tone: 'luxury' | 'courier' | 'concise') => {
    if (!aiEmailOrder) return;
    setAiTone(tone);
    const generated = generateAIEmailContent(aiEmailOrder, tone);
    setAiEmailSubject(generated.subject);
    setAiEmailBody(generated.body);
  };

  // If not authenticated, render the secure Admin Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Close button */}
          <button
            onClick={() => {
              setIsAdminOpen(false);
              setIsAddProductModalOpen(false);
              setAuthError(null);
            }}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-neutral-100 tracking-wide">
              MUSTAFA IQBAL
            </h3>
            <p className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold">
              Store Administrator Login
            </p>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Restricted portal for order confirmation, WhatsApp messaging, payment verification, and product management.
            </p>
          </div>

          {/* Error Notice */}
          {authError && (
            <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="iqbalmustafa2007@gmail.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-semibold flex justify-between">
                <span>Admin Password</span>
                <span className="text-[10px] text-neutral-500 font-mono">Master PIN</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-10 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                >
                  {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-md transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Portal</span>
            </button>

            {/* Quick Helper for Owner */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthEmail('iqbalmustafa2007@gmail.com');
                  setAuthPassword('223300');
                  setAuthError(null);
                }}
                className="text-[11px] text-neutral-400 hover:text-amber-400 underline underline-offset-4 cursor-pointer"
              >
                Autofill Mustafa Iqbal credentials (iqbalmustafa2007@gmail.com / 223300)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-6xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[95vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-base tracking-[0.2em] text-neutral-100">
              MUSTAFA IQBAL
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono">
              Store & Product Admin Portal
            </span>
            <span className="hidden md:inline text-[11px] text-neutral-400 font-mono">
              · iqbalmustafa2007@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-850 rounded border border-neutral-800 transition-colors cursor-pointer"
              title="Log out of administrator session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => {
                setIsAdminOpen(false);
                setIsAddProductModalOpen(false);
              }}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-neutral-800 bg-neutral-950/40 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Store Products Catalog ({watches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Modes ({paymentMethods.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'emails'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email & WhatsApp Logs ({sentEmails.length})</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: PRODUCTS (Featuring Comprehensive Add Product with Images, Colors, Real Price & Discount) */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-100 flex items-center gap-2">
                    <span>Store Products Catalog</span>
                    <span className="text-amber-400 font-mono text-xs">({watches.length} Active Listings)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Add new products, upload images, set dial/watch colors, configure real price, and set discount percentages.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isAddProductOpen) {
                      setIsAddProductOpen(false);
                      setIsAddProductModalOpen(false);
                      setEditingProductId(null);
                    } else {
                      handleOpenAddForm();
                    }
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddProductOpen ? 'Close Form' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Comprehensive Add / Edit Product Form */}
              {isAddProductOpen && (
                <form
                  onSubmit={handleSaveProduct}
                  className="p-6 bg-neutral-950 rounded-2xl border border-amber-400/30 space-y-6 text-xs shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <h4 className="font-bold text-amber-400 uppercase tracking-widest text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{editingProductId ? 'Edit Product Details' : 'Add New Product to Store'}</span>
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      Fill out images, color options, real price, and discount
                    </span>
                  </div>

                  {/* 1. Basic Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-200 mb-1 font-semibold">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mustafa Iqbal Royal Chronograph"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-200 mb-1 font-semibold">
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sunburst Emerald Dial with Tachymeter Bezel"
                        value={productTagline}
                        onChange={(e) => setProductTagline(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-200 mb-1 font-semibold">
                        Category / Collection *
                      </label>
                      <select
                        value={productCollection}
                        onChange={(e) => setProductCollection(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-200 mb-1 font-semibold">
                        Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bestseller, New Arrival, Limited Edition"
                        value={productBadge}
                        onChange={(e) => setProductBadge(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 2. REAL PRICE & DISCOUNT SECTION */}
                  <div className="p-4 bg-neutral-900/90 rounded-xl border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-neutral-100 uppercase tracking-wider text-xs">
                          Real Price & Discount Options
                        </span>
                      </div>
                      <span className="text-[11px] text-amber-400 font-mono">
                        Two-way Live Calculator
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Real Price */}
                      <div>
                        <label className="block text-neutral-300 mb-1 font-semibold">
                          Real / Original Price (PKR) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-neutral-500 font-mono">Rs.</span>
                          <input
                            type="number"
                            min="0"
                            required
                            value={realPrice}
                            onChange={(e) => handleRealPriceChange(Number(e.target.value))}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-10 pr-3 py-2 text-xs text-neutral-100 font-mono font-bold focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1">Standard retail / MSRP strike-through price</p>
                      </div>

                      {/* Discount % */}
                      <div>
                        <label className="block text-neutral-300 mb-1 font-semibold flex justify-between">
                          <span>Discount (%)</span>
                          <span className="text-amber-400 font-mono font-bold">{discountPercent}% OFF</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="95"
                            value={discountPercent}
                            onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-100 font-mono font-bold focus:border-amber-400 focus:outline-none pr-8"
                          />
                          <span className="absolute right-3 top-2 text-neutral-500 font-mono">%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          step="1"
                          value={discountPercent}
                          onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                          className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer mt-2"
                        />
                      </div>

                      {/* Selling / Discounted Price */}
                      <div>
                        <label className="block text-neutral-300 mb-1 font-semibold">
                          Selling Price (After Discount) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-amber-400 font-mono">Rs.</span>
                          <input
                            type="number"
                            min="0"
                            required
                            value={sellingPrice}
                            onChange={(e) => handleSellingPriceChange(Number(e.target.value))}
                            className="w-full bg-neutral-950 border border-amber-400/40 rounded-md pl-10 pr-3 py-2 text-xs text-amber-400 font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1">Final amount charged to customer</p>
                      </div>
                    </div>

                    {/* Quick Discount Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-neutral-400 mr-1">Quick Discount:</span>
                      {[0, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => applyPresetDiscount(pct)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                            discountPercent === pct
                              ? 'bg-amber-400 text-neutral-950 font-bold'
                              : 'bg-neutral-950 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          {pct === 0 ? 'No Discount' : `${pct}% OFF`}
                        </button>
                      ))}
                    </div>

                    {/* Live Calculated Savings Banner */}
                    <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <span className="text-neutral-300 text-xs">Customer Savings Breakdown:</span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-neutral-500 line-through font-mono">
                          {formatPrice(realPrice)}
                        </span>
                        <span className="text-neutral-100 font-bold text-sm font-mono">
                          {formatPrice(sellingPrice)}
                        </span>
                        {savingsAmount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
                            Save {formatPrice(savingsAmount)} ({discountPercent}% OFF)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. PRODUCT IMAGES SECTION */}
                  <div className="p-4 bg-neutral-900/90 rounded-xl border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-neutral-100 uppercase tracking-wider text-xs">
                          Product Images ({productImages.length} Attached)
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        Upload custom photos or pick luxury presets
                      </span>
                    </div>

                    {/* Image Sources: Upload, Presets, URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Option A: Upload from Device */}
                      <div className="p-3.5 bg-neutral-950 rounded-xl border border-dashed border-neutral-700 hover:border-amber-400 transition-colors flex flex-col items-center justify-center text-center p-4">
                        <Upload className="w-6 h-6 text-amber-400 mb-2" />
                        <p className="font-semibold text-neutral-200 text-xs">Upload from Phone / Computer</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 mb-3">
                          Select one or multiple photos (JPG, PNG, WEBP)
                        </p>
                        <label className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-semibold text-xs cursor-pointer transition-colors border border-neutral-700">
                          <span>Browse Device Photos</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Option B: Add by URL */}
                      <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-neutral-200 text-xs mb-1">Add Image from Web URL</p>
                          <p className="text-[11px] text-neutral-500 mb-2">Paste any image web link</p>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://example.com/watch.jpg"
                              value={imageUrlInput}
                              onChange={(e) => setImageUrlInput(e.target.value)}
                              className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddImageUrl}
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded text-xs"
                            >
                              Add URL
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-2">
                          Images will be displayed on the product card & zoom gallery.
                        </p>
                      </div>
                    </div>

                    {/* Preset Watch Photography Chooser */}
                    <div>
                      <p className="text-neutral-300 font-semibold mb-2 text-xs">
                        Or Pick from Studio Presets (Click to add to gallery):
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {PRESET_WATCH_IMAGES.map((preset) => {
                          const isAdded = productImages.includes(preset.image);
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSelectPresetImage(preset.image)}
                              className={`p-2 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all ${
                                isAdded
                                  ? 'border-amber-400 bg-amber-400/10'
                                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                              }`}
                            >
                              <img
                                src={preset.image}
                                alt={preset.name}
                                className="w-14 h-14 object-contain rounded"
                              />
                              <span className="text-[10px] font-medium text-neutral-300 text-center line-clamp-1">
                                {preset.name}
                              </span>
                              {isAdded && (
                                <span className="text-[9px] text-amber-400 font-semibold">✓ Added</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Attached Images Carousel / Preview Grid */}
                    {productImages.length > 0 && (
                      <div className="pt-2 border-t border-neutral-800">
                        <p className="text-neutral-300 font-semibold mb-2 text-xs">
                          Attached Product Gallery ({productImages.length} images - Select which is Primary):
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {productImages.map((img, idx) => {
                            const isPrimary = primaryImageIndex === idx;
                            return (
                              <div
                                key={idx}
                                className={`relative w-24 h-24 rounded-lg bg-neutral-950 border overflow-hidden p-1 flex items-center justify-center group ${
                                  isPrimary
                                    ? 'border-amber-400 ring-2 ring-amber-400/50'
                                    : 'border-neutral-800'
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Product ${idx + 1}`}
                                  className="w-full h-full object-contain"
                                />
                                {isPrimary ? (
                                  <div className="absolute top-1 left-1 bg-amber-400 text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                    Primary
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(idx)}
                                    className="absolute inset-0 bg-neutral-950/80 text-amber-400 text-[10px] font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                  >
                                    Set Primary
                                  </button>
                                )}
                                {productImages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-neutral-900/90 text-neutral-400 hover:text-red-400 rounded transition-colors"
                                    title="Remove photo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. COLOUR OPTIONS SECTION */}
                  <div className="p-4 bg-neutral-900/90 rounded-xl border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-neutral-100 uppercase tracking-wider text-xs">
                          Colour Options & Variants
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        Primary Dial: <strong className="text-amber-400">{selectedDialColor}</strong>
                      </span>
                    </div>

                    {/* Predefined Colors Swatches */}
                    <div>
                      <label className="block text-neutral-300 mb-2 font-semibold text-xs">
                        Select Primary Dial / Case Color:
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {PRESET_COLORS.map((col) => {
                          const active = selectedDialColor === col.name;
                          return (
                            <button
                              key={col.name}
                              type="button"
                              onClick={() => {
                                setSelectedDialColor(col.name);
                                if (!availableColors.includes(col.name)) {
                                  setAvailableColors((prev) => [...prev, col.name]);
                                }
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                                active
                                  ? 'border-amber-400 bg-amber-400/10 text-neutral-100 font-semibold'
                                  : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span>{col.label}</span>
                              {active && <Check className="w-3 h-3 text-amber-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Color Creator */}
                    <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 flex flex-wrap items-center gap-3">
                      <span className="text-neutral-300 text-xs font-semibold">Or Add Custom Color:</span>
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        className="w-7 h-7 rounded border border-neutral-700 bg-transparent cursor-pointer"
                        title="Pick custom hex color"
                      />
                      <input
                        type="text"
                        placeholder="Color name (e.g. Gunmetal Grey, Rose Gold)"
                        value={customColorName}
                        onChange={(e) => setCustomColorName(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded px-3 py-1 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomColor}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded text-xs"
                      >
                        Add Color
                      </button>
                    </div>

                    {/* Available Color Variants (Checkboxes for customer selection) */}
                    <div>
                      <label className="block text-neutral-300 mb-1.5 font-semibold text-xs">
                        Available Color Variants for this Product (Customer can choose from these):
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map((colName) => (
                          <span
                            key={colName}
                            className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs flex items-center gap-2"
                          >
                            <span>{colName}</span>
                            {availableColors.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleToggleAvailableColor(colName)}
                                className="text-neutral-500 hover:text-red-400"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 5. SPECIFICATIONS & DESCRIPTION */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Strap Material
                      </label>
                      <select
                        value={productStrap}
                        onChange={(e) => setProductStrap(e.target.value as StrapMaterial)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="Stainless Steel">316L Stainless Steel</option>
                        <option value="Genuine Leather">Genuine Calfskin Leather</option>
                        <option value="Ceramic">High-Tech Ceramic</option>
                        <option value="Mesh">Milanese Mesh</option>
                        <option value="Silicone">Silicone Sports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Movement Caliber
                      </label>
                      <select
                        value={productMovement}
                        onChange={(e) => setProductMovement(e.target.value as MovementType)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="Japanese Quartz">Japanese Quartz</option>
                        <option value="Automatic Skeleton">Automatic Skeleton</option>
                        <option value="Multi-function Quartz">Multi-function Quartz</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Case Diameter
                      </label>
                      <input
                        type="text"
                        value={productCase}
                        onChange={(e) => setProductCase(e.target.value)}
                        placeholder="e.g. 42mm"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Water Resistance
                      </label>
                      <select
                        value={productWater}
                        onChange={(e) => setProductWater(e.target.value as WaterResistance)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="3 ATM">3 ATM (30m - Splash)</option>
                        <option value="5 ATM">5 ATM (50m - Rain/Shower)</option>
                        <option value="10 ATM">10 ATM (100m - Diver)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">
                      Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddProductOpen(false);
                        setIsAddProductModalOpen(false);
                        setEditingProductId(null);
                      }}
                      className="px-4 py-2 rounded text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors shadow-lg cursor-pointer"
                    >
                      {editingProductId ? 'Save Product Changes' : 'Publish Product to Store'}
                    </button>
                  </div>
                </form>
              )}

              {/* Products Grid in Admin with Edit & Delete options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {watches.map((w) => {
                  const hasDiscount = w.originalPricePKR && w.originalPricePKR > w.pricePKR;
                  const discountPct = hasDiscount
                    ? Math.round(((w.originalPricePKR! - w.pricePKR) / w.originalPricePKR!) * 100)
                    : 0;

                  return (
                    <div
                      key={w.id}
                      className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={w.primaryImage}
                          alt={w.name}
                          className="w-18 h-18 object-contain bg-neutral-900 rounded-lg p-1 border border-neutral-850 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-amber-400">
                            <span>{w.collection}</span>
                            <span>·</span>
                            <span>{w.dialColor}</span>
                          </div>
                          <h4 className="text-xs font-bold text-neutral-100 truncate mt-0.5">{w.name}</h4>

                          {/* Price & Discount info */}
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xs font-mono font-bold text-neutral-100">
                              {formatPrice(w.pricePKR)}
                            </span>
                            {hasDiscount && (
                              <span className="text-[11px] font-mono text-neutral-500 line-through">
                                {formatPrice(w.originalPricePKR!)}
                              </span>
                            )}
                          </div>

                          {hasDiscount && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-semibold">
                              {discountPct}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Actions: Edit & Delete */}
                      <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500">
                          {w.galleryImages?.length || 1} Photo(s)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditProduct(w)}
                            className="px-2.5 py-1 text-xs text-neutral-300 hover:text-amber-400 bg-neutral-900 border border-neutral-800 rounded flex items-center gap-1"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteProduct(w.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-900 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ORDERS & RECEIVED PAYMENTS */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-100">
                    Incoming Customer Orders & Payment Approvals
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Inspect the customer's account number and click "Confirm Payment & Send Email" to notify the buyer.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
                  <Package className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm text-neutral-300 font-semibold">No orders received yet</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    When customers place an order on the storefront, their details will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isPending = order.deliveryStatus === 'Pending Admin Confirmation';
                    const isConfirmed = order.deliveryStatus === 'Confirmed';
                    const isDispatched = order.deliveryStatus === 'Dispatched';

                    return (
                      <div
                        key={order.id}
                        className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-amber-400">
                              {order.id}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              Tracking: {order.trackingNumber}
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPending && (
                              <span className="px-2.5 py-1 rounded bg-amber-950/50 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Awaiting Your Confirmation
                              </span>
                            )}
                            {isConfirmed && (
                              <span className="px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Confirmed & Email Sent
                              </span>
                            )}
                            {isDispatched && (
                              <span className="px-2.5 py-1 rounded bg-blue-950/50 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5" />
                                Dispatched via Courier
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer & Payment Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Col 1: Customer Details */}
                          <div className="space-y-1.5 p-3 rounded-lg bg-neutral-900 border border-neutral-850">
                            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                              Customer Contact
                            </p>
                            <p className="font-bold text-neutral-100 text-sm">
                              {order.customer.firstName} {order.customer.lastName}
                            </p>
                            <p className="text-amber-400 font-mono font-medium flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-neutral-400" />
                              {order.customer.email}
                            </p>
                            <p className="text-neutral-300 font-mono flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-neutral-400" />
                              {order.customer.phone}
                            </p>
                            {order.customer.streetAddress && (
                              <p className="text-neutral-400 text-[11px] pt-1 border-t border-neutral-800">
                                {order.customer.streetAddress}, {order.customer.city}
                              </p>
                            )}
                          </div>

                          {/* Col 2: Payment Mood & Account Number */}
                          <div className="space-y-1.5 p-3 rounded-lg bg-neutral-900 border border-neutral-850">
                            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                              Payment Mood & Account
                            </p>
                            <p className="font-bold text-neutral-100 text-sm">
                              {order.paymentMethodName}
                            </p>
                            <div className="p-2 rounded bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-amber-400">
                              <span className="text-neutral-400 block text-[9px] uppercase">
                                Sender Account / Number:
                              </span>
                              <strong className="text-amber-300 text-xs select-all">
                                {order.customer.accountNumber || 'Not specified'}
                              </strong>
                            </div>
                            <p className="text-[11px] text-neutral-400">
                              Payment Status: <span className="font-semibold text-neutral-200">{order.paymentStatus}</span>
                            </p>
                          </div>

                          {/* Col 3: Items & Total */}
                          <div className="space-y-1.5 p-3 rounded-lg bg-neutral-900 border border-neutral-850 flex flex-col justify-between">
                            <div>
                              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                                Order Items
                              </p>
                              <div className="space-y-1 mt-1 max-h-24 overflow-y-auto">
                                {order.items.map((i) => (
                                  <div key={i.watch.id} className="flex justify-between text-[11px]">
                                    <span className="text-neutral-300 truncate max-w-[150px]">
                                      {i.quantity}x {i.watch.name}
                                    </span>
                                    <span className="font-mono text-neutral-200">
                                      {formatPrice(i.watch.pricePKR * i.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                              <span className="font-semibold text-neutral-400">Total:</span>
                              <span className="text-base font-bold font-mono text-amber-400">
                                {formatPrice(order.totalPKR)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {order.confirmationEmailSent ? (
                              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                                <Mail className="w-3.5 h-3.5" />
                                Confirmation Email Dispatched to {order.customer.email}
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-400">
                                Click button to confirm payment & dispatch email.
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* AI Agent Order Confirmation Email Button */}
                            <button
                              type="button"
                              onClick={() => openAIEmailModal(order)}
                              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                              title={`Craft & send AI confirmation email from ${adminEmail} to ${order.customer.email}`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI Agent Email</span>
                            </button>

                            {/* WhatsApp Direct Confirmation Button */}
                            <button
                              type="button"
                              onClick={() => sendWhatsAppConfirmation(order)}
                              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow border border-emerald-500/40"
                              title={`Send instant WhatsApp payment confirmation to ${order.customer.phone}`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp ({order.customer.phone})</span>
                            </button>

                            {isPending && (
                              <button
                                onClick={() => confirmOrderAdmin(order.id)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                <span>Confirm Payment & Send Email</span>
                              </button>
                            )}

                            {isConfirmed && (
                              <button
                                onClick={() => markOrderDispatched(order.id)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>Mark as Dispatched</span>
                              </button>
                            )}

                            <button
                              onClick={() => deleteOrderAdmin(order.id)}
                              className="p-2 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-900 transition-colors cursor-pointer"
                              title="Delete order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CATEGORIES */}
          {/* ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-2xl">
              <div className="pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-100">
                  Manage Store Categories
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Categories control the navigation menu and storefront product filtering.
                </p>
              </div>

              <form onSubmit={handleAddCategorySubmit} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter new category name (e.g. Aviator Pilots, Ceramic Series)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md px-3.5 py-2.5 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </form>

              <div className="space-y-2">
                {categories.map((cat) => {
                  const productCount = watches.filter((w) => w.collection === cat).length;
                  return (
                    <div
                      key={cat}
                      className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-neutral-200">{cat}</span>
                        <span className="text-neutral-500 font-mono">({productCount} timepieces)</span>
                      </div>
                      <button
                        onClick={() => deleteCategory(cat)}
                        className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PAYMENT MOODS */}
          {/* ========================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-100">
                    Payment Moods & Receiving Accounts
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Configure your payment options (EasyPaisa, JazzCash, Meezan Bank, etc.) with receiving account numbers.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddPaymentOpen(!isAddPaymentOpen)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddPaymentOpen ? 'Close Form' : 'Add Payment Mood'}</span>
                </button>
              </div>

              {isAddPaymentOpen && (
                <form
                  onSubmit={handleAddPaymentSubmit}
                  className="p-6 bg-neutral-950 rounded-xl border border-neutral-800 space-y-4 text-xs max-w-xl"
                >
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs">
                    Add New Payment Mood
                  </h4>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">
                      Payment Mood Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nayapay / Sadapay / Bank Al Habib"
                      value={newPmName}
                      onChange={(e) => setNewPmName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Account Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPmTitle}
                        onChange={(e) => setNewPmTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Account / Mobile Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPmNumber}
                        onChange={(e) => setNewPmNumber(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">
                      Transfer Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={newPmInstructions}
                      onChange={(e) => setNewPmInstructions(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddPaymentOpen(false)}
                      className="px-4 py-2 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-400 text-neutral-950 font-bold rounded cursor-pointer"
                    >
                      Save Payment Mood
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-100 text-sm">{pm.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updatePaymentMethod(pm.id, { enabled: !pm.enabled })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                            pm.enabled
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {pm.enabled ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => deletePaymentMethod(pm.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-850 font-mono space-y-0.5 text-neutral-300">
                      <p>Title: <strong className="text-neutral-100">{pm.accountTitle}</strong></p>
                      <p>Number: <strong className="text-amber-400">{pm.accountNumber}</strong></p>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {pm.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SENT EMAILS LOG */}
          {/* ========================================================================= */}
          {activeTab === 'emails' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-100">
                  Dispatched Email & WhatsApp Notifications Log
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Automated customer messages sent for payment verification, tracking, and order confirmations.
                </p>
              </div>

              {sentEmails.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
                  <Mail className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm text-neutral-300 font-semibold">No notifications sent yet</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    When you confirm customer orders, email and WhatsApp message logs will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentEmails.map((item) => {
                    const isWhatsApp = item.channel === 'whatsapp';

                    return (
                      <div
                        key={item.id}
                        className={`p-4 bg-neutral-950 rounded-xl border space-y-2 text-xs ${
                          isWhatsApp ? 'border-emerald-500/30' : 'border-neutral-800'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {isWhatsApp ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] flex items-center gap-1 font-bold">
                                <MessageSquare className="w-3 h-3" />
                                WhatsApp
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-mono text-[10px] flex items-center gap-1 font-bold">
                                <Mail className="w-3 h-3" />
                                Official Email
                              </span>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="text-[11px] text-neutral-400">
                                From: <strong className="text-amber-400 font-mono">{item.fromEmail || adminEmail}</strong>
                              </span>
                              <span className="hidden sm:inline text-neutral-600">→</span>
                              <span className="text-[11px] text-neutral-200">
                                To: <strong className="text-neutral-100 font-mono">{item.toEmail}</strong> ({item.customerName})
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            {new Date(item.sentAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-neutral-300 font-medium">
                          Subject: {item.subject}
                        </p>
                        <div className="p-3 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 whitespace-pre-wrap font-sans text-[11px] leading-relaxed">
                          {item.body}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Agent Order Confirmation Email Studio Modal */}
      {aiEmailOrder && (
        <div className="fixed inset-0 z-60 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-2">
                    <span>AI Agent Order Confirmation Email</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 font-mono">
                      Order #{aiEmailOrder.id}
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Dispatched from store administrator <strong className="text-amber-400 font-mono">{adminEmail}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiEmailOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Routing Card */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      From (Store Administrator Email)
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded bg-neutral-900 border border-neutral-800 text-amber-400 font-mono font-bold text-xs">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{adminEmail}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                      <span>Enter Recipient Email (User) *</span>
                      <span className="text-[10px] text-emerald-400">Editable</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                      <input
                        type="email"
                        required
                        value={aiRecipientEmail}
                        onChange={(e) => setAiRecipientEmail(e.target.value)}
                        placeholder="Enter user email for order confirmation"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500">
                  Confirmation notice will be sent from <strong className="text-neutral-300 font-mono">{adminEmail}</strong> directly to the customer's mailbox.
                </p>
              </div>

              {/* AI Tone Selector */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select AI Tone / Email Persona</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToneChange('luxury')}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                      aiTone === 'luxury'
                        ? 'bg-amber-400/15 border-amber-400 text-neutral-100'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <p className="font-bold text-[11px]">Luxury Horology</p>
                    <p className="text-[9px] text-neutral-400 truncate">Warranty, sapphire, executive</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToneChange('courier')}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                      aiTone === 'courier'
                        ? 'bg-amber-400/15 border-amber-400 text-neutral-100'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <p className="font-bold text-[11px]">Courier Tracking</p>
                    <p className="text-[9px] text-neutral-400 truncate">Express dispatch emphasis</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToneChange('concise')}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                      aiTone === 'concise'
                        ? 'bg-amber-400/15 border-amber-400 text-neutral-100'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <p className="font-bold text-[11px]">Direct Receipt</p>
                    <p className="text-[9px] text-neutral-400 truncate">Payment verified</p>
                  </button>
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={aiEmailSubject}
                  onChange={(e) => setAiEmailSubject(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1 flex justify-between">
                  <span>AI Generated Email Body</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Editable message</span>
                </label>
                <textarea
                  rows={10}
                  value={aiEmailBody}
                  onChange={(e) => setAiEmailBody(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 font-mono leading-relaxed focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setAiEmailOrder(null)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white rounded border border-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. Send via Official Gmail */}
                <button
                  type="button"
                  onClick={() => {
                    if (!aiRecipientEmail.trim()) {
                      alert('Please enter a recipient email.');
                      return;
                    }
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                      aiRecipientEmail.trim()
                    )}&su=${encodeURIComponent(aiEmailSubject)}&body=${encodeURIComponent(aiEmailBody)}`;
                    window.open(gmailUrl, '_blank');
                    sendAIAgentOrderEmail(
                      aiEmailOrder.id,
                      aiRecipientEmail.trim(),
                      aiEmailSubject,
                      aiEmailBody
                    );
                    setAiEmailOrder(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow border border-red-500/30"
                  title="Open in Gmail composer ready to send from iqbalmustafa2007@gmail.com"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Gmail ({adminEmail})</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {/* 2. Send via Default mail client */}
                <button
                  type="button"
                  onClick={() => {
                    if (!aiRecipientEmail.trim()) {
                      alert('Please enter a recipient email.');
                      return;
                    }
                    const mailtoUrl = `mailto:${encodeURIComponent(
                      aiRecipientEmail.trim()
                    )}?subject=${encodeURIComponent(aiEmailSubject)}&body=${encodeURIComponent(aiEmailBody)}`;
                    window.location.href = mailtoUrl;
                    sendAIAgentOrderEmail(
                      aiEmailOrder.id,
                      aiRecipientEmail.trim(),
                      aiEmailSubject,
                      aiEmailBody
                    );
                    setAiEmailOrder(null);
                  }}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title="Open default email application"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Default Mail</span>
                </button>

                {/* 3. Confirm & Save to Logs */}
                <button
                  type="button"
                  onClick={() => {
                    if (!aiRecipientEmail.trim()) {
                      alert('Please enter a recipient email.');
                      return;
                    }
                    sendAIAgentOrderEmail(
                      aiEmailOrder.id,
                      aiRecipientEmail.trim(),
                      aiEmailSubject,
                      aiEmailBody
                    );
                    setAiEmailOrder(null);
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Order & Record Log</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
