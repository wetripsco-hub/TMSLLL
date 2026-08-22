'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Navigation, MapPin, Truck, Phone, Copy, Check, 
  ShieldCheck, RefreshCw, ExternalLink, Clock, AlertCircle
} from 'lucide-react';
import { truckService } from '@/lib/services/truckService';
import { loadService } from '@/lib/services/loadService';
import { TruckItem } from '@/types/database.types';
import { DispatchLoad } from '@/types/tms';

export default function DispatcherTrackingPage() {
  const [trucks, setTrucks] = useState<TruckItem[]>([]);
  const [loads, setLoads] = useState<DispatchLoad[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<TruckItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    truckService.getTrucks().then((data) => {
      setTrucks(data);
      if (data.length > 0) setSelectedTruck(data[0]);
    });
    loadService.getLoads().then(setLoads);
  }, []);

  const handleCopyLink = (token: string, id: string) => {
    const url = `${window.location.origin}/track/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Navigation className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Live Fleet GPS Telematics & Tracking
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Real-time driver smartphone GPS check-ins, highway transit corridors, and shipper live share links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Live Satellite Feed Active
          </span>
        </div>
      </div>

      {/* Split Map & Unit Telemetry View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Map Canvas Simulation (2 Cols) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              North American Freight Corridors (I-20, I-35, I-10)
            </h3>
            <span className="text-xs text-muted-foreground font-mono">Zoom: 100% (US Southeast/Central)</span>
          </div>

          {/* Interactive Map Visual Simulator */}
          <div className="relative w-full h-80 bg-slate-950 rounded-2xl overflow-hidden border border-border flex items-center justify-center p-4">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Simulated Interstate Road Lines */}
            <div className="absolute w-[80%] h-0.5 bg-slate-700/60 top-1/2 -rotate-6" />
            <div className="absolute h-[80%] w-0.5 bg-slate-700/60 left-1/3 rotate-12" />

            {/* Truck Pins on Map */}
            {trucks.map((t, idx) => {
              const isSelected = selectedTruck?.id === t.id;
              const positions = [
                { top: '45%', left: '42%' },
                { top: '35%', left: '28%' },
                { top: '60%', left: '55%' },
                { top: '70%', left: '30%' },
              ];
              const pos = positions[idx % positions.length];

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTruck(t)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white ring-4 ring-orange-500/30 scale-110 z-20 shadow-xl'
                      : 'bg-slate-900 text-orange-400 border border-slate-700 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 px-1 font-mono text-[11px] font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{t.unitNumber}</span>
                  </div>
                </button>
              );
            })}

            {/* Floating Telemetry Box */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-white text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-400" />
                <span className="font-semibold font-mono">
                  {selectedTruck?.unitNumber}: {selectedTruck?.currentLocation.city}, {selectedTruck?.currentLocation.state}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">68 MPH • Smooth Flow</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Unit Telematics Dossier (1 Col) */}
        {selectedTruck && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-border pb-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Unit Telematics</span>
              <h3 className="text-lg font-extrabold text-foreground font-mono">{selectedTruck.unitNumber}</h3>
              <p className="text-xs text-muted-foreground">{selectedTruck.makeModel}</p>
            </div>

            <div className="p-3 bg-background rounded-xl border border-border space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Current Coordinate:</span>
                <span className="text-foreground font-bold">{selectedTruck.currentLocation.lat.toFixed(4)}° N, {Math.abs(selectedTruck.currentLocation.lng).toFixed(4)}° W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Waypoint:</span>
                <span className="text-foreground font-bold">{selectedTruck.currentLocation.city}, {selectedTruck.currentLocation.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Status:</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold uppercase">{selectedTruck.status}</span>
              </div>
            </div>

            {/* Assigned Driver Contact */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Driver: {selectedTruck.assignedDriver?.name || 'Unassigned'}</span>
              </div>
              {selectedTruck.assignedDriver && (
                <div className="text-muted-foreground font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  <span>{selectedTruck.assignedDriver.phone}</span>
                </div>
              )}
            </div>

            {/* Public Link Generator */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyLink('trk_marcus_vance_88902', selectedTruck.id)}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                {copiedId === selectedTruck.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === selectedTruck.id ? 'Public Link Copied!' : 'Copy Shipper GPS Link'}</span>
              </button>

              <Link
                href="/track/trk_marcus_vance_88902"
                target="_blank"
                className="w-full py-2 bg-muted hover:bg-orange-50 hover:text-orange-700 text-foreground rounded-xl text-xs font-bold border border-border text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Preview Mobile Tracking View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
