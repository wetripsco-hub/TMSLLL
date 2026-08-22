'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Truck, FileText, Navigation, DollarSign, 
  MapPin, ShieldCheck, CheckCircle2, Copy, Check, Download, 
  Calendar, Phone, Mail, Building2, User
} from 'lucide-react';
import { initialMockLoads } from '@/lib/mock-data';
import { DispatchBadge } from '@/components/dispatch/DispatchBadge';
import { RateConModal } from '@/components/modals/RateConModal';
import { DispatchLoad } from '@/types/tms';

export default function LoadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const loadId = resolvedParams.id;
  
  const foundLoad = initialMockLoads.find(l => l.id === loadId) || initialMockLoads[0];
  const [load, setLoad] = useState<DispatchLoad>(foundLoad);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRateConOpen, setIsRateConOpen] = useState(false);

  const origin = load.stops[0];
  const destination = load.stops[load.stops.length - 1];

  const handleCopyTrackingLink = () => {
    const url = `${window.location.origin}/track/${load.trackingToken}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/loads"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
                Load {load.loadNumber}
              </h1>
              <DispatchBadge status={load.status} />
              {load.trackingActive && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-xs font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  GPS ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {load.commodity} • {load.equipment.toUpperCase()} • {load.weightLbs.toLocaleString()} lbs • {load.miles} mi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyTrackingLink}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Driver GPS Link'}</span>
          </button>

          <button
            onClick={() => setIsRateConOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/25 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Rate Con & eSign</span>
          </button>
        </div>
      </div>

      {/* Financial Performance Hero Card */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
          Billing & Margin Overview
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-background p-3.5 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground block font-semibold">Customer Gross Invoice</span>
            <span className="text-xl font-extrabold text-foreground font-mono">${load.financials.shipperRate.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">{load.shipper.paymentTerms}</span>
          </div>

          <div className="bg-background p-3.5 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground block font-semibold">Carrier Agreed Pay</span>
            <span className="text-xl font-extrabold text-foreground font-mono">${load.financials.carrierRate.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Linehaul settlement</span>
          </div>

          <div className="bg-background p-3.5 rounded-xl border border-orange-200 dark:border-orange-500/30">
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block">Net Profit Margin</span>
            <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">+${load.financials.margin.toFixed(2)}</span>
            <span className="text-[10px] text-orange-600 font-mono block mt-0.5 font-bold">{load.financials.marginPercent.toFixed(1)}% Spread</span>
          </div>

          <div className="bg-background p-3.5 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground block font-semibold">Rate Per Mile (RPM)</span>
            <span className="text-xl font-extrabold text-foreground font-mono">${load.rpm.toFixed(2)} / mi</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Across {load.miles} loaded mi</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Routing Stops & Live Telematics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stops Timeline */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Routing & Appointment Timeline
            </h3>

            <div className="space-y-4 border-l-2 border-orange-500/30 pl-4 ml-2">
              {load.stops.map((stop, index) => (
                <div key={stop.id} className="relative space-y-1">
                  <span className={`w-3.5 h-3.5 rounded-full absolute -left-[23px] top-1 border-2 border-background ${
                    stop.type === 'pickup' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground capitalize">
                      Stop {index + 1} ({stop.type}): {stop.facility}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground uppercase font-bold">
                      {stop.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stop.address}, {stop.city}, {stop.state} {stop.zip}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{stop.date} @ {stop.timeWindow}</div>
                  {stop.specialInstructions && (
                    <div className="text-[11px] text-muted-foreground bg-background p-2.5 rounded-xl border border-border mt-1">
                      <strong className="text-foreground">Instructions:</strong> {stop.specialInstructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Telematics & Driver Breadcrumbs */}
          {load.driverLocation && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-orange-500" />
                  Driver Live GPS Telemetry
                </h3>
                <span className="text-xs text-orange-600 font-mono font-bold">
                  {load.driverLocation.speedMph} MPH • Updated {load.driverLocation.lastUpdated}
                </span>
              </div>

              <div className="bg-background p-4 rounded-xl border border-border space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-sans">Current Coordinate:</span>
                  <span className="text-foreground font-bold">{load.driverLocation.lat.toFixed(4)}° N, {Math.abs(load.driverLocation.lng).toFixed(4)}° W</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-sans">Location Waypoint:</span>
                  <span className="text-foreground font-bold">{load.driverLocation.city}, {load.driverLocation.state} (I-20 Corridor)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-sans">Driver Contact:</span>
                  <span className="text-orange-600 font-sans font-bold">{load.carrier?.driverName} ({load.carrier?.driverPhone})</span>
                </div>
              </div>
            </div>
          )}

          {/* Attached Documents */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              Attached Freight Documents ({load.documents.length})
            </h3>

            {load.documents.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {load.documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-background border border-border rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <div>
                        <span className="font-bold text-foreground">{doc.name}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono">{doc.fileSize} • Uploaded {doc.uploadedAt}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Shipper & Carrier Details */}
        <div className="space-y-6">
          {/* Customer / Shipper Card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" />
              Customer (Shipper)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="font-bold text-foreground text-sm">{load.shipper.name}</div>
              <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5" />
                <span>{load.shipper.contact}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5" />
                <span>{load.shipper.phone}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5" />
                <span>{load.shipper.email}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border flex justify-between text-[11px] font-mono">
              <span className="text-muted-foreground font-sans">Credit Line:</span>
              <span className="font-bold text-emerald-600">${load.shipper.creditLimit.toLocaleString()}</span>
            </div>
          </div>

          {/* Assigned Motor Carrier */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />
              Assigned Motor Carrier
            </h3>

            {load.carrier ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-foreground text-sm flex items-center gap-1">
                  {load.carrier.name}
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-muted-foreground font-mono">
                  MC #{load.carrier.mcNumber} • DOT #{load.carrier.dotNumber}
                </div>
                <div className="text-muted-foreground font-medium">
                  Driver: <strong className="text-foreground">{load.carrier.driverName}</strong>
                </div>
                <div className="text-muted-foreground font-medium">
                  Phone: <strong className="text-foreground">{load.carrier.driverPhone}</strong>
                </div>
                <div className="text-muted-foreground font-medium">
                  Factoring: <strong className="text-foreground">{load.carrier.factoringCompany || 'Direct Pay'}</strong>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Insurance Expiry:</span>
                  <span className="font-mono text-foreground font-bold">{load.carrier.insuranceExpiry}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-orange-600 font-semibold italic py-2">No carrier assigned yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Rate Con Modal */}
      <RateConModal
        isOpen={isRateConOpen}
        onClose={() => setIsRateConOpen(false)}
        load={load}
        onSignComplete={(signer) => {
          setLoad({ ...load, rateConSigned: true, rateConSignerName: signer });
        }}
      />
    </div>
  );
}
