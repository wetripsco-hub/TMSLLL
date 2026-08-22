'use client';

import React, { useState, use } from 'react';
import { 
  MapPin, Navigation, Phone, CheckCircle2, Camera, 
  Upload, Truck, AlertCircle, ShieldCheck, Clock, Check
} from 'lucide-react';
import { initialMockLoads } from '@/lib/mock-data';

export default function DriverTrackPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const matchedLoad = initialMockLoads.find(l => l.trackingToken === token) || initialMockLoads[0];

  const [currentStatus, setCurrentStatus] = useState<string>('in_transit');
  const [gpsActive, setGpsActive] = useState(true);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 32.7767,
    lng: -89.6012,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [podUploaded, setPodUploaded] = useState(false);
  const [podFileName, setPodFileName] = useState('');

  const handleShareLocation = () => {
    setIsUpdating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLastCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGpsActive(true);
          setIsUpdating(false);
        },
        () => {
          // Fallback simulation coordinates (I-20 East towards Atlanta)
          setLastCoords({
            lat: 33.7490,
            lng: -84.3880,
          });
          setGpsActive(true);
          setIsUpdating(false);
        }
      );
    } else {
      setTimeout(() => {
        setLastCoords({ lat: 33.7490, lng: -84.3880 });
        setIsUpdating(false);
      }, 500);
    }
  };

  const handleMilestoneClick = (status: string) => {
    setCurrentStatus(status);
  };

  const handleSimulatePodUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPodFileName(e.target.files[0].name);
      setPodUploaded(true);
    } else {
      setPodFileName('Signed_POD_Document_Photo.jpg');
      setPodUploaded(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Driver Mobile Header */}
      <div className="max-w-md mx-auto w-full space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mobile Driver Portal</span>
              <h1 className="text-base font-extrabold text-white font-mono">Load #{matchedLoad.loadNumber}</h1>
            </div>
          </div>

          <a
            href="tel:+18005558671"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Broker</span>
          </a>
        </div>

        {/* Live GPS Telematics Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-400" />
              Live Telematics Sharing
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
              GPS CONNECTED
            </span>
          </div>

          {lastCoords && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-400 font-sans font-semibold">Current Position:</div>
              <div className="text-orange-300 font-bold text-sm">
                {lastCoords.lat.toFixed(4)}° N, {Math.abs(lastCoords.lng).toFixed(4)}° W
              </div>
              <div className="text-[10px] text-slate-500">Auto-transmitting location updates to dispatch console.</div>
            </div>
          )}

          <button
            type="button"
            onClick={handleShareLocation}
            disabled={isUpdating}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{isUpdating ? 'Pinging GPS Satellite...' : 'Share My Exact GPS Location'}</span>
          </button>
        </div>

        {/* Milestone Check-In Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Trip Milestone Status
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { key: 'arrived_pickup', label: '1. At Shipper' },
              { key: 'in_transit', label: '2. Loaded & Rolling' },
              { key: 'arrived_delivery', label: '3. At Delivery Dock' },
              { key: 'delivered', label: '4. Unloaded & POD' },
            ].map((milestone) => (
              <button
                key={milestone.key}
                type="button"
                onClick={() => handleMilestoneClick(milestone.key)}
                className={`p-3 rounded-xl border font-bold transition-all text-left ${
                  currentStatus === milestone.key
                    ? 'border-orange-500 bg-orange-500/20 text-orange-300 shadow-xs'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {milestone.label}
              </button>
            ))}
          </div>
        </div>

        {/* POD Photo Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Proof of Delivery (POD) Camera Capture
          </span>
          <p className="text-[11px] text-slate-400">
            Snap a clear photo of the signed Bill of Lading to trigger instant carrier QuickPay settlement.
          </p>

          {podUploaded ? (
            <div className="p-3.5 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-orange-400 mx-auto" />
              <span className="text-xs font-bold text-orange-300 block">POD Uploaded & Processed!</span>
              <span className="text-[10px] text-slate-400 font-mono">{podFileName || 'Signed_POD_Photo.jpg'}</span>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-colors">
              <Camera className="w-6 h-6 text-orange-400" />
              <span className="text-xs font-bold text-white">Tap to Take POD Photo</span>
              <span className="text-[10px] text-slate-500">Uses smartphone camera or photo library</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleSimulatePodUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full pt-6 text-center text-[10px] text-slate-500 space-y-1">
        <div>Protected by FreightFlow 256-Bit SSL Telematics Engine</div>
        <div>No mobile app download or registration required for drivers.</div>
      </div>
    </div>
  );
}
