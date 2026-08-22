'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, Trash2, ArrowLeft, DollarSign, TrendingUp, Truck, 
  MapPin, ShieldCheck, CheckCircle2, Sparkles, Building2, Calendar
} from 'lucide-react';
import { initialMockShippers, initialMockCarriers } from '@/lib/mock-data';
import { EquipmentType } from '@/types/tms';

export default function NewLoadPage() {
  const router = useRouter();

  // Form State
  const [loadNumber, setLoadNumber] = useState(`FF-${Math.floor(10000 + Math.random() * 90000)}`);
  const [selectedShipperId, setSelectedShipperId] = useState(initialMockShippers[0].id);
  const [selectedCarrierId, setSelectedCarrierId] = useState(initialMockCarriers[0].id);
  const [equipment, setEquipment] = useState<EquipmentType>('reefer');
  const [commodity, setCommodity] = useState('Frozen Food Products');
  const [weightLbs, setWeightLbs] = useState(42000);
  const [temperature, setTemperature] = useState('-10°F Continuous');
  const [miles, setMiles] = useState(750);

  // Financials State
  const [shipperRate, setShipperRate] = useState(3500);
  const [carrierRate, setCarrierRate] = useState(2800);
  const [fuelSurcharge, setFuelSurcharge] = useState(350);

  // Stops State
  const [stops, setStops] = useState([
    {
      id: 'st_1',
      type: 'pickup',
      facility: 'Dallas Cold Hub Facility',
      address: '8400 Logistics Pkwy',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
      date: '2026-08-25',
      timeWindow: '08:00 - 12:00',
      specialInstructions: 'Pre-cool trailer. Seal verification required on BOL.',
    },
    {
      id: 'st_2',
      type: 'delivery',
      facility: 'Kroger Distribution Center #12',
      address: '4200 Interstate Blvd',
      city: 'Atlanta',
      state: 'GA',
      zip: '30301',
      date: '2026-08-27',
      timeWindow: '06:00 - 10:00',
      specialInstructions: 'Lumper pre-authorized ($185). Temperature recorder slip required.',
    },
  ]);

  // Derived Calculations
  const totalShipperRevenue = Number(shipperRate);
  const totalCarrierPay = Number(carrierRate);
  const marginSpread = totalShipperRevenue - totalCarrierPay;
  const marginPct = totalShipperRevenue > 0 ? (marginSpread / totalShipperRevenue) * 100 : 0;
  const rpm = miles > 0 ? (totalShipperRevenue / miles) : 0;

  const currentShipper = initialMockShippers.find(s => s.id === selectedShipperId);
  const currentCarrier = initialMockCarriers.find(c => c.id === selectedCarrierId);

  const handleAddStop = () => {
    setStops([
      ...stops,
      {
        id: `st_${Date.now()}`,
        type: 'delivery',
        facility: 'Additional Distribution Stop',
        address: '100 Terminal Way',
        city: 'Nashville',
        state: 'TN',
        zip: '37201',
        date: '2026-08-26',
        timeWindow: '13:00 - 17:00',
        specialInstructions: 'Driver assist offload.',
      },
    ]);
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleCreateLoad = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/loads');
  };

  return (
    <form onSubmit={handleCreateLoad} className="max-w-5xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Create New Dispatch Load
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 font-bold">
                {loadNumber}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Build multi-stop routing, select verified carriers, and lock in margin spreads.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/loads"
            className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl border border-border"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Book & Dispatch Load
          </button>
        </div>
      </div>

      {/* Financial Margin Guard Overview */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
          Margin Guard & Rate Calculator
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-background p-3.5 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground block font-semibold">Customer Billing</span>
            <span className="text-xl font-extrabold text-foreground font-mono">${totalShipperRevenue.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Shipper invoice total</span>
          </div>

          <div className="bg-background p-3.5 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground block font-semibold">Carrier Cost</span>
            <span className="text-xl font-extrabold text-foreground font-mono">${totalCarrierPay.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Linehaul agreement</span>
          </div>

          <div className="bg-background p-3.5 rounded-xl border border-orange-200 dark:border-orange-500/30">
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block">Net Margin Spread</span>
            <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">+${marginSpread.toFixed(2)}</span>
            <span className="text-[10px] text-orange-600 font-mono block mt-0.5 font-bold">{marginPct.toFixed(1)}% profit margin</span>
          </div>

          <div className="bg-background p-3.5 rounded-xl border border-border">
            <span className="text-[10px] text-muted-foreground block font-semibold">Rate Per Mile (RPM)</span>
            <span className="text-xl font-extrabold text-foreground font-mono">${rpm.toFixed(2)} / mi</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Over {miles} loaded miles</span>
          </div>
        </div>
      </div>

      {/* 2-Column Core Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Customer, Equipment, Routing Stops */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Cargo Details */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" />
              1. Customer (Shipper) & Cargo Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Select Customer</label>
                <select
                  value={selectedShipperId}
                  onChange={(e) => setSelectedShipperId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
                >
                  {initialMockShippers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Credit Limit: ${s.creditLimit.toLocaleString()})
                    </option>
                  ))}
                </select>
                {currentShipper && (
                  <div className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between font-medium">
                    <span>Available Credit: <strong className="text-emerald-600">${currentShipper.availableCredit.toLocaleString()}</strong></span>
                    <span>{currentShipper.paymentTerms}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Equipment Type</label>
                <select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value as EquipmentType)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium capitalize"
                >
                  <option value="dry_van">53' Dry Van</option>
                  <option value="reefer">53' Refrigerated (Reefer)</option>
                  <option value="flatbed">48' / 53' Flatbed</option>
                  <option value="step_deck">Step Deck (Drop Deck)</option>
                  <option value="power_only">Power Only (Tractor)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Commodity</label>
                <input
                  type="text"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  placeholder="e.g. Frozen Produce"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Weight (Lbs)</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Temperature Setpoint</label>
                <input
                  type="text"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  placeholder="-10°F Continuous"
                />
              </div>
            </div>
          </div>

          {/* Multi-Stop Routing Card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                2. Multi-Stop Appointment Schedule ({stops.length} Stops)
              </h3>
              <button
                type="button"
                onClick={handleAddStop}
                className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Intermediate Stop</span>
              </button>
            </div>

            <div className="space-y-4">
              {stops.map((stop, index) => (
                <div key={stop.id} className="p-4 bg-background border border-border rounded-xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stop.type === 'pickup' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                      Stop {index + 1}: {stop.type.toUpperCase()}
                    </span>
                    {stops.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="text-rose-500 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Facility Name</label>
                      <input
                        type="text"
                        value={stop.facility}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index].facility = e.target.value;
                          setStops(updated);
                        }}
                        className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted-foreground font-semibold mb-1">Street Address</label>
                      <input
                        type="text"
                        value={stop.address}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index].address = e.target.value;
                          setStops(updated);
                        }}
                        className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] text-muted-foreground font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={stop.city}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index].city = e.target.value;
                          setStops(updated);
                        }}
                        className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-foreground font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted-foreground font-semibold mb-1">State</label>
                      <input
                        type="text"
                        value={stop.state}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index].state = e.target.value;
                          setStops(updated);
                        }}
                        className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-foreground uppercase font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted-foreground font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        value={stop.date}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index].date = e.target.value;
                          setStops(updated);
                        }}
                        className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-foreground font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted-foreground font-semibold mb-1">Time Window</label>
                      <input
                        type="text"
                        value={stop.timeWindow}
                        onChange={(e) => {
                          const updated = [...stops];
                          updated[index].timeWindow = e.target.value;
                          setStops(updated);
                        }}
                        className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-foreground font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Carrier Assignment & Financial Rates */}
        <div className="space-y-6">
          {/* Carrier Assignment */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />
              3. Carrier Assignment
            </h3>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Assigned Carrier (MC#)</label>
              <select
                value={selectedCarrierId}
                onChange={(e) => setSelectedCarrierId(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500 font-medium"
              >
                {initialMockCarriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (MC #{c.mcNumber})
                  </option>
                ))}
              </select>
            </div>

            {currentCarrier && (
              <div className="bg-background p-3.5 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{currentCarrier.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-[10px] font-bold font-mono">
                    FMCSA APPROVED
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  MC #{currentCarrier.mcNumber} • DOT #{currentCarrier.dotNumber}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Insurance Valid: <strong className="text-foreground">{currentCarrier.insuranceExpiration}</strong>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Factoring: <strong className="text-foreground">{currentCarrier.factoringCompany || 'Direct QuickPay'}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Linehaul Rates Input */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" />
              4. Financial Linehaul Agreement
            </h3>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Shipper Gross Rate ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  value={shipperRate}
                  onChange={(e) => setShipperRate(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Carrier Agreed Pay ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  value={carrierRate}
                  onChange={(e) => setCarrierRate(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Estimated Route Mileage</label>
              <input
                type="number"
                value={miles}
                onChange={(e) => setMiles(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all"
            >
              Confirm & Generate Rate Con
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
