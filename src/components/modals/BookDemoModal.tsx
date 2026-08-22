'use client';

import React, { useState } from 'react';
import { 
  X, Calendar, Check, ArrowRight, ShieldCheck, Sparkles, 
  Building, User, Mail, Phone, CreditCard, Lock, Zap
} from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export function BookDemoModal({ isOpen, onClose, defaultPlan = 'Growing Brokerage ($239/mo)' }: BookDemoModalProps) {
  const [modalMode, setModalMode] = useState<'demo' | 'stripe'>('demo');
  const [step, setStep] = useState<'details' | 'calendar' | 'success'>('details');
  const [stripeSuccess, setStripeSuccess] = useState(false);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    businessType: 'brokerage',
    teamSize: '5-20 users',
    plan: defaultPlan,
    timeSlot: 'Tomorrow at 2:00 PM EST',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '884',
  });

  if (!isOpen) return null;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('calendar');
  };

  const handleConfirmBooking = () => {
    setStep('success');
  };

  const handleStripeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingStripe(true);
    setTimeout(() => {
      setIsProcessingStripe(false);
      setStripeSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Mode Selector Tabs */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setModalMode('demo'); setStep('details'); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              modalMode === 'demo'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-orange-500" />
            <span>Book Live Strategy Demo</span>
          </button>
          <button
            type="button"
            onClick={() => setModalMode('stripe')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              modalMode === 'stripe'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Buy Instant License</span>
          </button>
        </div>

        {/* 1. STRIPE INSTANT CHECKOUT MODE */}
        {modalMode === 'stripe' && (
          <div>
            {!stripeSuccess ? (
              <form onSubmit={handleStripeCheckout} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">Stripe 256-Bit SSL Checkout</span>
                    <h2 className="text-xl font-extrabold text-foreground">Instant SaaS License Activation</h2>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-lg font-extrabold text-foreground">$239</span>
                    <span className="text-[10px] text-muted-foreground block font-sans">/ month</span>
                  </div>
                </div>

                <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Selected Plan:</span>
                    <strong className="text-foreground">Growing Brokerage (3PL)</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Seats Included:</span>
                    <span className="text-foreground">10 Dispatcher Licenses</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>AI Vision Scans:</span>
                    <span className="text-emerald-600 font-bold">1,000 / Month</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-muted-foreground font-bold mb-1">Cardholder Work Email</label>
                    <input
                      required
                      type="email"
                      placeholder="finance@apexlogistics.com"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-bold mb-1">Credit / Debit Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        required
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-muted-foreground font-bold mb-1">Exp Date (MM/YY)</label>
                      <input
                        required
                        type="text"
                        placeholder="12/28"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground font-bold mb-1">CVC Code</label>
                      <input
                        required
                        type="password"
                        placeholder="884"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessingStripe}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isProcessingStripe ? 'Securing License via Stripe...' : 'Pay $239 & Launch Instant Instance'}</span>
                  </button>
                  <span className="block text-center text-[10px] text-muted-foreground mt-2">
                    14-day money-back guarantee • Cancel subscription anytime in dashboard
                  </span>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/30">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground">License Key Issued!</h2>
                <div className="p-4 bg-muted/60 border border-border rounded-xl font-mono text-xs text-left space-y-1">
                  <div className="text-muted-foreground font-sans">Your Organization License:</div>
                  <div className="text-orange-600 font-bold text-sm select-all">FF-PRO-2026-LIVE-88902-XK</div>
                  <div className="text-[10px] text-muted-foreground font-sans">Full administrative login credentials dispatched to {formData.workEmail || 'your email'}.</div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
                >
                  Enter Enterprise Dashboard $\rightarrow$
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. DEMO SCHEDULE MODE */}
        {modalMode === 'demo' && step === 'details' && (
          <div>
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Commercial VIP Onboarding</span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">
              Book a Live 1-on-1 Strategy Demo
            </h2>
            <p className="text-xs text-muted-foreground mb-6 font-medium">
              See how FreightFlow AI eliminates manual load entry, automates carrier dispatch, and protects your brokerage margins.
            </p>

            <form onSubmit={handleSubmitDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      placeholder="Alex Mercer"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Company Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      placeholder="Apex Logistics LLC"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="email"
                      placeholder="alex@apexlogistics.com"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Direct Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Operations Model</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="brokerage">Freight Brokerage (3PL)</option>
                    <option value="dispatcher">Independent Dispatcher</option>
                    <option value="fleet">Asset Carrier / Fleet</option>
                    <option value="hybrid">Broker & Asset Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Team Size</label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="1-3">1 - 3 Dispatchers / Brokers</option>
                    <option value="4-10">4 - 10 Dispatchers / Brokers</option>
                    <option value="11-50">11 - 50 Enterprise Seats</option>
                    <option value="50+">50+ Enterprise Seats</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 font-extrabold text-xs text-white rounded-xl shadow-md shadow-orange-500/25 transition-all"
                >
                  Continue to Select Demo Time
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {modalMode === 'demo' && step === 'calendar' && (
          <div>
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Step 2 of 2: Pick VIP Timeslot</span>
            </div>
            <h2 className="text-xl font-extrabold text-foreground mb-2">
              Select Your 25-Min Architecture Demo
            </h2>
            <p className="text-xs text-muted-foreground mb-4 font-medium">
              A dedicated Principal Logistics Solutions Engineer will walk you through live customer workflows.
            </p>

            <div className="space-y-2 mb-6">
              {[
                'Today at 4:30 PM EST (Fast-Track Slot)',
                'Tomorrow at 10:00 AM EST',
                'Tomorrow at 2:00 PM EST',
                'Thursday at 11:30 AM EST',
                'Friday at 1:00 PM EST',
              ].map((slot, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, timeSlot: slot })}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    formData.timeSlot === slot
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-bold'
                      : 'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{slot}</span>
                  </div>
                  {formData.timeSlot === slot && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground rounded-xl border border-border font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all text-center"
              >
                Confirm & Receive Calendar Invite
              </button>
            </div>
          </div>
        )}

        {modalMode === 'demo' && step === 'success' && (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-200 dark:border-orange-500/30 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">Demo Successfully Booked!</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4 font-medium">
              We have reserved your slot for <span className="text-orange-600 font-bold">{formData.timeSlot}</span>. A calendar invite and Google Meet link have been sent to <span className="text-foreground font-mono font-bold">{formData.workEmail}</span>.
            </p>
            <div className="bg-muted/50 border border-border p-4 rounded-xl text-left text-xs space-y-2 mb-6 font-medium">
              <div className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">What We Will Cover:</div>
              <div className="flex items-center gap-2 text-foreground">
                <Check className="w-3.5 h-3.5 text-orange-500" />
                <span>Zero-manual-entry Gemini 2.0 AI OCR document extraction</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Check className="w-3.5 h-3.5 text-orange-500" />
                <span>1-Click Rate Confirmation generation & automated driver tracking</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Check className="w-3.5 h-3.5 text-orange-500" />
                <span>Direct QuickBooks, TriumphPay & SheetJS financial integrations</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-muted hover:bg-orange-50 hover:text-orange-700 text-foreground text-xs font-bold rounded-xl transition-colors border border-border"
            >
              Close & Explore Sandbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
