import React from 'react';
import {
  CheckCircle,
  Printer,
  CreditCard,
  MapPin,
  Clock,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationModal: React.FC = () => {
  const {
    isOrderConfirmedOpen,
    setIsOrderConfirmedOpen,
    lastOrder,
    formatPrice,
  } = useStore();

  if (!isOrderConfirmedOpen || !lastOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = lastOrder.customer.phone.replace(/[^0-9]/g, '');
  const waPhoneTarget = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
  const waMessage = encodeURIComponent(
    `Assalam o Alaikum Mustafa Iqbal Watches!\n\nI have placed Order #${lastOrder.id}.\nTotal Amount: Rs. ${lastOrder.totalPKR.toLocaleString()}\nMy Sender Account Number: ${lastOrder.customer.accountNumber}\nPayment Mode: ${lastOrder.paymentMethodName}\nCustomer: ${lastOrder.customer.firstName} ${lastOrder.customer.lastName}\nEmail: ${lastOrder.customer.email}\nPhone: ${lastOrder.customer.phone}\n\nPlease verify my payment and confirm my order. Thank you!`
  );
  const waUrl = `https://wa.me/${waPhoneTarget || '923001234567'}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Success Header Banner */}
        <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/40 border-b border-neutral-800 p-6 sm:p-8 text-center space-y-3">
          <div className="w-14 h-14 bg-amber-400 text-neutral-950 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-neutral-100">
            Order Successfully Placed
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Thank you for choosing Mustafa Iqbal. Your order details have been securely recorded. An official confirmation email will be sent from store owner Mustafa Iqbal (<strong className="text-amber-400 font-mono">iqbalmustafa2007@gmail.com</strong>) to <strong className="text-amber-400 font-mono">{lastOrder.customer.email}</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono">
            <div className="bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800">
              <span className="text-neutral-400">Order ID: </span>
              <span className="text-amber-400 font-bold">{lastOrder.id}</span>
            </div>
            <div className="bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800">
              <span className="text-neutral-400">Tracking: </span>
              <span className="text-neutral-200">{lastOrder.trackingNumber}</span>
            </div>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="p-6 bg-neutral-950/50 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Fulfillment Status
            </h3>
            <span className="text-xs text-amber-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {lastOrder.deliveryStatus}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold text-[11px] flex items-center justify-center mx-auto">
                1
              </div>
              <p className="font-semibold text-neutral-200 text-[11px]">Placed</p>
              <p className="text-[10px] text-neutral-400">Order Received</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 font-bold text-[11px] flex items-center justify-center mx-auto">
                2
              </div>
              <p className="font-medium text-neutral-400 text-[11px]">Verification</p>
              <p className="text-[10px] text-neutral-500">Invoice Dispatched</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 font-bold text-[11px] flex items-center justify-center mx-auto">
                3
              </div>
              <p className="font-medium text-neutral-400 text-[11px]">Dispatched</p>
              <p className="text-[10px] text-neutral-500">Insured Cargo</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 font-bold text-[11px] flex items-center justify-center mx-auto">
                4
              </div>
              <p className="font-medium text-neutral-400 text-[11px]">Delivered</p>
              <p className="text-[10px] text-neutral-500">Doorstep Handover</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs">
          {/* Purchased Watches */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-300">
              Purchased Items
            </h4>
            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
              {lastOrder.items.map((item) => (
                <div key={item.watch.id} className="p-3 sm:p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.watch.primaryImage}
                      alt={item.watch.name}
                      className="w-12 h-12 object-contain bg-neutral-900 rounded p-1 border border-neutral-800"
                    />
                    <div>
                      <p className="font-semibold text-neutral-100">{item.watch.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        {item.watch.sku} · Qty: {item.quantity} · 1-Year Official Warranty Included
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-neutral-200">
                    {formatPrice(item.watch.pricePKR * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Payment Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Customer & Contact</span>
              </div>
              <p className="font-semibold text-neutral-200">
                {lastOrder.customer.firstName} {lastOrder.customer.lastName}
              </p>
              <p className="text-amber-400 font-mono">{lastOrder.customer.email}</p>
              <p className="text-neutral-400 font-mono">Phone: {lastOrder.customer.phone}</p>
              {lastOrder.customer.streetAddress && (
                <p className="text-neutral-400">
                  {lastOrder.customer.streetAddress}, {lastOrder.customer.city}
                </p>
              )}
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Payment Information</span>
              </div>
              <p className="font-semibold text-neutral-200">{lastOrder.paymentMethodName}</p>
              <p className="text-neutral-400 font-mono text-[11px]">
                Sender Account Number: <strong className="text-neutral-200">{lastOrder.customer.accountNumber}</strong>
              </p>
              <div className="flex justify-between font-bold text-neutral-100 pt-2 border-t border-neutral-800">
                <span>Total Amount:</span>
                <span className="font-mono text-amber-400 text-sm">
                  {formatPrice(lastOrder.totalPKR)}
                </span>
              </div>
            </div>
          </div>

          {/* Email & WhatsApp Instant Notification Section */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                  Payment Verification & Notifications Dispatched
                </span>
              </div>
              <span className="text-[11px] text-emerald-300 font-mono">
                Order #{lastOrder.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-950/90 rounded-lg border border-neutral-800 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Confirmation</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Automated invoice & order summary queued for:
                </p>
                <p className="font-mono text-amber-400 font-bold text-[11px] truncate">
                  {lastOrder.customer.email}
                </p>
                <p className="text-[10px] text-neutral-500">
                  Dispatched directly from <span className="text-amber-400 font-mono">iqbalmustafa2007@gmail.com</span> upon payment verification.
                </p>
              </div>

              <div className="p-3 bg-neutral-950/90 rounded-lg border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Payment Verification</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800 font-mono">
                    Ready
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Notify store desk on WhatsApp to confirm payment instantly:
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Payment Notice</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={() => setIsOrderConfirmedOpen(false)}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wider uppercase rounded-md transition-colors shadow-lg cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
