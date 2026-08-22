'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Plus, Trash2, ShieldCheck, AlertCircle, 
  DollarSign, Calculator, MapPin, Truck, Sparkles, AlertTriangle, Check
} from 'lucide-react';
import { loadService } from '@/lib/services/loadService';
import { DispatchStop, EquipmentType } from '@/types/dispatch';

export default function BrokerNewLoadPage() {
  const router = useRouter();
  const [commodity, setCommodity] = useState('Frozen Poultry & Meats');
  const [equipment, setEquipment] = useState<EquipmentType>('reefer');
  const [weightLbs, setWeightLbs] = useState(42500);
  const [temperature, setTemperature] = useState('-10°F Continuous');
  const [miles, setMiles] = useState(740);

  // Financials & Margin
  const [shipperRate, setShipperRate] = useState(3600);
  const [carrierRate, setCarrierRate] = useState(2950);
  const [fuelIndexDiesel, setFuelIndexDiesel] = useState(3.845);
  const [fuelSurchargeTotal, setFuelSurchargeTotal] = useState(320);

  // Multi-Stops State
  const [stops, setStops] = useState<DispatchStop[]>([
    {
      id: 'stp_1',
      type: 'pickup',
      sequence: 1,
      facility: 'Tyson Cold Storage Facility #4',
      address: '4200 Logistics Pkwy',
      city: 'Springdale',
      state: 'AR',
      zip: '72762',
      date: '2026-03-01',
      timeWindow: '08:00 - 12:00',
      status: 'pending',
    },
    {
      id: 'stp_2',
      type: 'delivery',
      sequence: 2,
      facility: 'Kroger Distribution Center #12',
      address: '100 Industrial Pkwy',
      city: 'Atlanta',
      state: 'GA',
      zip: '30301',
      date: '2026-03-03',
      timeWindow: '06:00 - 10:00',
      status: 'pending',
    },
  ]);

  // Margin Calculations
  const grossMargin = shipperRate - carrierRate;
  const marginPercent = shipperRate > 0 ? (grossMargin / shipperRate) * 100 : 0;
  const rpm = miles > 0 ? shipperRate / miles : 0;
  const isMarginLow = marginPercent < 12.0;

  // Fetch live fuel index from ScrapeGraphAI worker
  useEffect(() => {
    fetch(`/api/fuel/index?miles=${miles}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.index) {
          setFuelIndexDiesel(res.index.nationalAverageDiesel);
          if (res.calculation) {
            setFuelSurchargeTotal(res.calculation.fscTotalAmount);
          }
        }
      })
      .catch(() => {});
  }, [miles]);

  const handleAddStop = () => {
    const newStop: DispatchStop = {
      id: `stp_${Date.now()}`,
      type: 'delivery',
      sequence: stops.length + 1,
      facility: 'Intermediate Cross-Dock',
      address: '770 Transit Way',
      city: 'Memphis',
      state: 'TN',
      zip: '38118',
      date: '2026-03-02',
      timeWindow: '14:00 - 17:00',
      status: 'pending',
    };
    setStops([...stops, newStop]);
    setMiles(miles + 180);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
    setMiles(Math.max(200, miles - 180));
  };

  const handleCreateLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadService.createLoad({
      commodity,
      equipment,
      weightLbs,
      temperature,
      miles,
      stops,
      financials: {
        shipperRate,
        carrierRate,
        fuelSurcharge: fuelSurchargeTotal,
        accessorials: 0,
        lumperFee: 0,
        detention: 0,
        margin: grossMargin,
        marginPercent,
      },
    });
    router.push('/broker/loads');
  };

  return (
    <form onSubmit={handleCreateLoad} className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/broker/loads"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Create New Brokerage Load
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Assign multi-stops, calculate live fuel surcharges, and protect broker profit margins.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Book & Dispatch Load</span>
        </button>
      </div>

      {/* Margin Guard & Live Fuel Surcharge Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${
          isMarginLow
            ? 'bg-amber-50/80 border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30'
            : 'bg-card border-orange-200 dark:border-orange-500/30'
        } shadow-xs space-y-2`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
              <ShieldCheck className="w-4 h-4" />
              Broker Margin Guard
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              isMarginLow ? 'bg-amber-200 text-amber-900' : 'bg-orange-500 text-white'
            }`}>
              {marginPercent.toFixed(1)}%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            +${grossMargin.toFixed(2)}
          </div>
          {isMarginLow ? (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              Margin is below 12.0% brokerage threshold.
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground font-medium">Healthy profit margin locked in.</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>EIA Diesel Fuel Benchmark</span>
            <span className="text-[10px] bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 px-2 py-0.5 rounded-full font-mono font-bold">
              ScrapeGraphAI
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${fuelIndexDiesel.toFixed(3)} <span className="text-xs text-muted-foreground font-sans font-normal">/ gal</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Auto-calculated Fuel Surcharge: <strong className="text-foreground font-mono font-bold">${fuelSurchargeTotal.toFixed(2)}</strong>
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Effective Rate Per Mile (RPM)</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
              {miles} Miles
            </span>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            ${rpm.toFixed(2)} <span className="text-xs text-muted-foreground font-sans font-normal">/ mi</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Target RPM for {equipment.toUpperCase()} capacity</p>
        </div>
      </div>

      {/* 2-Column Form Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Freight Specifications & Financials */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">1. Freight Specs & Pricing</h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-foreground mb-1">Commodity Description</label>
              <input
                required
                type="text"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1">Equipment Type</label>
                <select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value as EquipmentType)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="reefer">Reefer (53ft)</option>
                  <option value="dry_van">Dry Van (53ft)</option>
                  <option value="flatbed">Flatbed (48ft/53ft)</option>
                  <option value="step_deck">Step Deck</option>
                  <option value="power_only">Power Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Total Weight (Lbs)</label>
                <input
                  required
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1">Shipper Rate (Invoice $)</label>
                <input
                  required
                  type="number"
                  value={shipperRate}
                  onChange={(e) => setShipperRate(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Carrier Rate (Agreed $)</label>
                <input
                  required
                  type="number"
                  value={carrierRate}
                  onChange={(e) => setCarrierRate(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Multi-Stop Schedule */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">2. Routing Stops ({stops.length})</h2>
            <button
              type="button"
              onClick={handleAddStop}
              className="flex items-center gap-1 px-3 py-1 bg-muted hover:bg-orange-50 hover:text-orange-700 text-foreground text-xs font-bold rounded-xl border border-border transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Intermediate Stop</span>
            </button>
          </div>

          <div className="space-y-3">
            {stops.map((stop, index) => (
              <div key={stop.id} className="p-3 bg-background border border-border rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                    Stop {index + 1}: {stop.type.toUpperCase()}
                  </span>
                  {stops.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop.id)}
                      className="text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Facility Name"
                    value={stop.facility}
                    onChange={(e) => {
                      const updated = [...stops];
                      updated[index].facility = e.target.value;
                      setStops(updated);
                    }}
                    className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="City, State"
                    value={`${stop.city}, ${stop.state}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      const updated = [...stops];
                      updated[index].city = parts[0]?.trim() || '';
                      updated[index].state = parts[1]?.trim() || '';
                      setStops(updated);
                    }}
                    className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
