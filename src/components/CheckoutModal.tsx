import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building2,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerDetails } from '../types/watch';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalPKR,
    cartDiscountPKR,
    cartTotalPKR,
    freeShippingThresholdPKR,
    formatPrice,
    completeOrder,
    paymentMethods,
    currentUser,
  } = useStore();

  const enabledPaymentMethods = paymentMethods.filter((pm) => pm.enabled);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    enabledPaymentMethods[0]?.id || 'easypaisa'
  );

  // Customer form fields in the EXACT sequence requested by the user:
  // 1. Email, 2. First Name, 3. Last Name, 4. Number, 5. Account Number
  const [email, setEmail] = useState('customer@example.com');
  const [firstName, setFirstName] = useState('Ali');
  const [lastName, setLastName] = useState('Raza');
  const [phoneNumber, setPhoneNumber] = useState('03001234567'); // 10-digit random for show
  const [accountNumber, setAccountNumber] = useState('03001234567'); // Sender account / wallet / reference number
  const [streetAddress, setStreetAddress] = useState('House 21, Street 4, Sector F-7');
  const [city, setCity] = useState('Islamabad');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Auto-fill from logged-in account if available
  useEffect(() => {
    if (currentUser) {
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) {
        setPhoneNumber(currentUser.phone);
        setAccountNumber(currentUser.phone);
      }
      if (currentUser.name) {
        const parts = currentUser.name.trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || parts[0]);
      }
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  const shippingCostPKR = cartSubtotalPKR >= freeShippingThresholdPKR || cart.length === 0 ? 0 : 450;
  const finalPayablePKR = cartTotalPKR + shippingCostPKR;

  const currentMethod = paymentMethods.find((pm) => pm.id === selectedMethodId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !accountNumber.trim()) {
      alert('Please fill in all required fields (Email, First Name, Last Name, Phone Number, and Account Number).');
      return;
    }

    const customer: CustomerDetails = {
      email,
      firstName,
      lastName,
      phone: phoneNumber,
      accountNumber,
      streetAddress,
      city,
      deliveryNotes,
    };

    completeOrder(customer, selectedMethodId);
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'mobile_wallet':
        return <Smartphone className="w-4 h-4 text-amber-400" />;
      case 'bank':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'cod':
        return <Banknote className="w-4 h-4 text-amber-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div
        className="fixed inset-0"
        onClick={() => setIsCheckoutOpen(false)}
      />

      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="font-display font-bold text-sm tracking-wider uppercase text-neutral-100">
              Mustafa Iqbal · Secure Checkout & Payment
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Sequential Form Fields as Requested */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-mono text-[11px]">
                    1
                  </span>
                  Customer & Payment Information
                </h3>

                <div className="space-y-4">
                  {/* Field 1: Email */}
                  <div>
                    <label className="block text-[11px] text-neutral-300 uppercase font-semibold mb-1 flex justify-between flex-wrap gap-1">
                      <span>1. Enter Email For Your Order Confirmation *</span>
                      <span className="text-[10px] text-amber-400 font-mono">From: iqbalmustafa2007@gmail.com</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter email for your order is confirm (e.g. customer@gmail.com)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Official order confirmation & tracking details will be dispatched from store owner Mustafa Iqbal (<strong className="text-amber-400 font-mono">iqbalmustafa2007@gmail.com</strong>) to this email.
                    </p>
                  </div>

                  {/* Field 2 & 3: First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-300 uppercase font-semibold mb-1">
                        2. First Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-300 uppercase font-semibold mb-1">
                        3. Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Field 4: Phone Number */}
                  <div>
                    <label className="block text-[11px] text-neutral-300 uppercase font-semibold mb-1">
                      4. Phone Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="03001234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                    />
                  </div>

                  {/* Field 5: Account Number / Payment Account Number */}
                  <div>
                    <label className="block text-[11px] text-neutral-300 uppercase font-semibold mb-1 flex items-center justify-between">
                      <span>5. Account Number (Account you are paying / transferring from) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 03001234567 or IBAN / Account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Mustafa Iqbal will verify this account number against incoming payment in the admin portal before confirming.
                    </p>
                  </div>

                  {/* Address & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase font-medium mb-1">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        placeholder="House, Street, Area"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Lahore / Karachi / Islamabad"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Mood / Method Selection */}
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-mono text-[11px]">
                    2
                  </span>
                  Select Payment Mood / Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {enabledPaymentMethods.map((pm) => {
                    const active = selectedMethodId === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedMethodId(pm.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          active
                            ? 'border-amber-400 bg-amber-400/10 text-neutral-100'
                            : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div className="p-2 rounded bg-neutral-900 border border-neutral-800 shrink-0">
                          {getMethodIcon(pm.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-100 truncate">{pm.name}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                            {pm.accountTitle} · {pm.accountNumber}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Instructions Box */}
                {currentMethod && (
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-400">{currentMethod.name} Details</span>
                      <span className="text-[10px] text-neutral-400 uppercase">Receiving Account</span>
                    </div>
                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-200 space-y-1">
                      <p>Account Title: <strong className="text-neutral-100">{currentMethod.accountTitle}</strong></p>
                      <p>Account / Number: <strong className="text-amber-400 select-all">{currentMethod.accountNumber}</strong></p>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      {currentMethod.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Confirm Action */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-200 pb-2 border-b border-neutral-800">
                  Order Summary ({cart.length} Item{cart.length > 1 ? 's' : ''})
                </h3>

                {/* Cart list preview */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.watch.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800 text-xs"
                    >
                      <img
                        src={item.watch.primaryImage}
                        alt={item.watch.name}
                        className="w-12 h-12 object-contain bg-neutral-900 rounded p-1"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-200 truncate">{item.watch.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          Qty: {item.quantity} · {item.watch.collection}
                        </p>
                      </div>
                      <span className="font-mono font-medium text-neutral-200">
                        {formatPrice(item.watch.pricePKR * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-neutral-200">{formatPrice(cartSubtotalPKR)}</span>
                  </div>
                  {cartDiscountPKR > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Privilege Discount</span>
                      <span className="font-mono">-{formatPrice(cartDiscountPKR)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-400">
                    <span>Courier Delivery</span>
                    <span className="font-mono text-neutral-200">
                      {shippingCostPKR === 0 ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        formatPrice(shippingCostPKR)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-100 pt-2 border-t border-neutral-800">
                    <span>Total Amount</span>
                    <span className="font-mono text-amber-400 text-base">
                      {formatPrice(finalPayablePKR)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs text-neutral-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Mustafa Iqbal Horology Guarantee</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    100% genuine luxury timepiece. Includes 1-Year official warranty certificate and safe, insured courier shipping.
                  </p>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="space-y-2 pt-4 border-t border-neutral-800">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wider uppercase rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Place Order ({formatPrice(finalPayablePKR)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-neutral-400">
                  Secure checkout · Free insured courier delivery on qualifying orders
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
