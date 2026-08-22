'use client';

import React, { useState } from 'react';
import { 
  X, Calendar, Check, ArrowRight, ShieldCheck, Sparkles, 
  Building, User, Mail, Phone, CreditCard, Lock, Zap, CheckCircle2, ChevronRight
} from 'lucide-react';
import { tenantService } from '@/lib/services/tenantService';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
  defaultEdition?: 'freight_brokerage' | 'independent_dispatch';
}

export function BookDemoModal({ 
  isOpen, 
  onClose, 
  defaultPlan = 'Growing Brokerage ($239/mo)',
  defaultEdition = 'freight_brokerage'
}: BookDemoModalProps) {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    mcDotNumber: '',
    fleetSizeOrVolume: '50-150 loads/mo',
    edition: defaultEdition,
  });

  if (!isOpen) return null;

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await tenantService.createDemoRequest({
      fullName: formData.fullName,
      workEmail: formData.workEmail,
      phone: formData.phone,
      companyName: formData.companyName,
      mcDotNumber: formData.mcDotNumber || 'MC-Pending',
      fleetSizeOrVolume: formData.fleetSizeOrVolume,
      edition: formData.edition,
    });
    setIsSubmitting(false);
    setStep('success');
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

        {step === 'details' && (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Enterprise Access & Strategy Walkthrough
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Request Dedicated Tenant Environment
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our solutions engineering team will provision your dedicated sandbox instance with preloaded carrier network data.
              </p>
            </div>

            <form onSubmit={handleSubmitDetails} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-foreground">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Marcus Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-foreground">Work Email</label>
                  <input
                    required
                    type="email"
                    placeholder="marcus@freight.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-foreground">Company Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Apex Logistics LLC"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-foreground">MC / DOT # (Optional)</label>
                  <input
                    type="text"
                    placeholder="MC-940128"
                    value={formData.mcDotNumber}
                    onChange={(e) => setFormData({ ...formData, mcDotNumber: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-foreground">Edition Interested In</label>
                  <select
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="freight_brokerage">Freight Brokerage Edition (3PL)</option>
                    <option value="independent_dispatch">Truck Dispatcher Edition</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-foreground">Monthly Volume / Fleet Size</label>
                  <select
                    value={formData.fleetSizeOrVolume}
                    onChange={(e) => setFormData({ ...formData, fleetSizeOrVolume: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="1-5 Power Units (Dispatcher)">1-5 Power Units</option>
                    <option value="6-25 Power Units (Dispatcher)">6-25 Power Units</option>
                    <option value="25-100 Loads/mo (Broker)">25-100 Loads/mo</option>
                    <option value="100-500 Loads/mo (Broker)">100-500 Loads/mo</option>
                    <option value="500+ Loads/mo (Enterprise)">500+ Loads/mo (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Submitting Request...' : 'Submit Enterprise Access Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-foreground">Request Queued Successfully!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your request for <strong className="text-foreground">{formData.companyName}</strong> has been logged to the Super Admin provisioning queue.
            </p>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-xs transition-colors"
              >
                Return to Product Overview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
