import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Package,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    currentUser,
    login,
    register,
    logout,
    orders,
    setIsAdminOpen,
    formatPrice,
  } = useStore();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim() || !loginPassword) {
      setLoginError('Please enter your email or phone number and password.');
      return;
    }

    const res = login(loginIdentifier, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setRegError('Please complete all registration fields.');
      return;
    }

    if (regPassword.length < 5) {
      setRegError('Password must be at least 5 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type your password.');
      return;
    }

    const res = register(regName, regEmail, regPhone, regPassword);
    if (!res.success) {
      setRegError(res.message);
    } else {
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
    }
  };

  const handleFillAdminCredentials = () => {
    setLoginIdentifier('iqbalmustafa2007@gmail.com');
    setLoginPassword('223300');
    setLoginError(null);
  };

  // Find customer's personal orders if logged in
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          (currentUser.email && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.phone && o.customer.phone.replace(/[^0-9]/g, '') === currentUser.phone.replace(/[^0-9]/g, ''))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-wider text-neutral-100 block">
                MUSTAFA IQBAL
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {currentUser ? 'User Account & Profile' : 'Sign In & Registration'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-7 flex-1">
          {currentUser ? (
            /* ========================================================================= */
            /* PROFILE & ACCOUNT DASHBOARD VIEW */
            /* ========================================================================= */
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-100">{currentUser.name}</h3>
                    <p className="text-xs text-neutral-400">{currentUser.email}</p>
                    <p className="text-xs font-mono text-neutral-400 mt-0.5">{currentUser.phone}</p>
                  </div>
                  <div>
                    {currentUser.role === 'admin' ? (
                      <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Store Administrator</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium font-mono">
                        Verified Customer
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Quick Action Button */}
                {currentUser.role === 'admin' && (
                  <div className="pt-3 border-t border-neutral-900">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setIsAdminOpen(true);
                      }}
                      className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Open Admin Control Dashboard</span>
                    </button>
                    <p className="text-[11px] text-neutral-500 text-center mt-2">
                      Access customer orders, verify payments, send WhatsApp/Email notices, and manage store products.
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Orders History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>My Store Orders ({userOrders.length})</span>
                  </h4>
                </div>

                {userOrders.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-neutral-950 border border-dashed border-neutral-800">
                    <Package className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-xs text-neutral-300 font-semibold">No orders placed yet</p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Browse our luxury timepieces collection and complete checkout.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {userOrders.map((o) => (
                      <div
                        key={o.id}
                        className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">#{o.id}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                                o.deliveryStatus === 'Confirmed' || o.deliveryStatus === 'Dispatched'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {o.deliveryStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            {o.items.length} item(s) · {o.paymentMethodName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-neutral-100 block">
                            {formatPrice(o.totalPKR)}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Log Out Button */}
              <div className="pt-2 border-t border-neutral-800 flex justify-end">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* LOGIN & REGISTRATION TABS */
            /* ========================================================================= */
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setLoginError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authModalTab === 'login'
                      ? 'bg-amber-400 text-neutral-950 shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('register');
                    setRegError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authModalTab === 'register'
                      ? 'bg-amber-400 text-neutral-950 shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* 1. LOGIN FORM */}
              {authModalTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  {loginError && (
                    <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-neutral-300 mb-1.5 font-semibold">
                      Email Address or Mobile / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. iqbalmustafa2007@gmail.com or 03001234567"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Log in using either your registered email address or mobile number.
                    </p>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1.5 font-semibold flex justify-between">
                      <span>Password *</span>
                      <span className="text-[10px] text-neutral-500 font-mono">Password / PIN</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-10 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-md transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Sign In to Mustafa Iqbal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Owner / Admin helper card */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 space-y-1.5 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Store Administrator Access</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleFillAdminCredentials}
                        className="text-[10px] text-neutral-300 hover:text-amber-400 bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Auto-fill Admin Credentials
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      To access the Admin Portal, sign in with <code className="text-amber-400 font-mono">iqbalmustafa2007@gmail.com</code> and password <code className="text-amber-400 font-mono">223300</code>.
                    </p>
                  </div>
                </form>
              )}

              {/* 2. REGISTER / CREATE ACCOUNT FORM */}
              {authModalTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  {regError && (
                    <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Kamran Akhtar or Mustafa Iqbal"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-xs text-neutral-100 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. yourname@example.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">
                      Mobile / WhatsApp Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="e.g. 03001234567"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      Used for WhatsApp order confirmation and courier delivery updates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Create Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 5 characters"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 mb-1 font-semibold">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-xs text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-md transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Create My Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-neutral-500 text-center leading-relaxed">
                    By creating an account, you receive instant WhatsApp order verification, exclusive access to new watch arrivals, and tracked delivery updates.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
