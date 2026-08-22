'use client';

import React, { useEffect, useState } from 'react';
import { 
  Truck, Plus, Search, MapPin, User, ShieldCheck, 
  Trash2, Edit, Check, AlertCircle, Phone, Calendar, ArrowUpRight
} from 'lucide-react';
import { truckService } from '@/lib/services/truckService';
import { TruckItem, DriverItem, EquipmentType } from '@/types/database.types';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MyTrucksPage() {
  const [trucks, setTrucks] = useState<TruckItem[]>([]);
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [unitNumber, setUnitNumber] = useState('');
  const [trailerNumber, setTrailerNumber] = useState('');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('reefer');
  const [makeModel, setMakeModel] = useState('2024 Freightliner Cascadia');
  const [rpmTarget, setRpmTarget] = useState(2.85);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  useEffect(() => {
    truckService.getTrucks().then(setTrucks);
    truckService.getDrivers().then(setDrivers);
  }, []);

  const filteredTrucks = trucks.filter(
    (t) =>
      t.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedDriver?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    const assigned = drivers.find((d) => d.id === selectedDriverId);

    const created = await truckService.addTruck({
      unitNumber: unitNumber || `Unit-${Math.floor(100 + Math.random() * 900)}`,
      trailerNumber,
      equipmentType,
      makeModel,
      rpmTarget,
      assignedDriver: assigned ? { id: assigned.id, name: assigned.name, phone: assigned.phone } : undefined,
    });

    setTrucks([created, ...trucks]);
    setIsAddModalOpen(false);
    setUnitNumber('');
    setTrailerNumber('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              My Fleet Trucks & Driver Roster
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage your fleet of assigned power units, trailer types, target RPMs, and active driver schedules.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Truck</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Unit #, Make, or Driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>

        <span className="text-xs font-bold text-muted-foreground">
          Showing {filteredTrucks.length} of {trucks.length} Managed Units
        </span>
      </div>

      {/* Trucks Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrucks.map((truck) => (
          <div key={truck.id} className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 flex items-center justify-center font-mono font-bold text-sm">
                  {truck.unitNumber.slice(0, 4)}
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-sm font-mono">{truck.unitNumber}</h3>
                  <p className="text-[11px] text-muted-foreground">{truck.makeModel} ({truck.year})</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                truck.status === 'in_transit'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : truck.status === 'dispatched'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}>
                {truck.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-background rounded-xl border border-border space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Equipment / Trailer</span>
                <strong className="text-foreground uppercase font-mono">{truck.equipmentType}</strong>
                <span className="text-[10px] text-muted-foreground block">{truck.trailerNumber || 'No Trailer'}</span>
              </div>

              <div className="p-2.5 bg-background rounded-xl border border-border space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Target RPM</span>
                <strong className="text-orange-600 dark:text-orange-400 font-mono text-sm">${truck.rpmTarget.toFixed(2)} / mi</strong>
                <span className="text-[10px] text-muted-foreground block">Minimum floor</span>
              </div>
            </div>

            {/* Assigned Driver */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">Assigned Driver:</span>
                  <strong className="text-foreground">{truck.assignedDriver?.name || 'Unassigned'}</strong>
                </div>
              </div>
              {truck.assignedDriver && (
                <span className="text-[11px] text-muted-foreground font-mono">{truck.assignedDriver.phone}</span>
              )}
            </div>

            {/* Waypoint */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{truck.currentLocation.city}, {truck.currentLocation.state}</span>
              </div>
              <span className="font-mono text-[10px]">Pinged {truck.currentLocation.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredTrucks.length === 0 && (
        <div className="p-8">
          <EmptyState
            icon={Truck}
            title="No Managed Trucks Found"
            description="You have not added any power units to your dispatch fleet yet, or no units matched your search."
            actionLabel="Add Power Unit"
            onActionClick={() => setIsAddModalOpen(true)}
          />
        </div>
      )}

      {/* Add Truck Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-foreground">
            <h2 className="text-lg font-extrabold text-foreground">Add Power Unit to Fleet</h2>
            <form onSubmit={handleAddTruck} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Unit Number</label>
                  <input
                    required
                    type="text"
                    placeholder="Unit-120"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono text-foreground focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Trailer #</label>
                  <input
                    type="text"
                    placeholder="TR-5320"
                    value={trailerNumber}
                    onChange={(e) => setTrailerNumber(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono text-foreground focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Equipment Type</label>
                  <select
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value as EquipmentType)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="reefer">Reefer (53ft)</option>
                    <option value="dry_van">Dry Van (53ft)</option>
                    <option value="flatbed">Flatbed (48/53ft)</option>
                    <option value="step_deck">Step Deck</option>
                    <option value="power_only">Power Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Target RPM ($/mi)</label>
                  <input
                    required
                    type="number"
                    step="0.05"
                    value={rpmTarget}
                    onChange={(e) => setRpmTarget(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono text-foreground focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Tractor Make & Model</label>
                <input
                  required
                  type="text"
                  placeholder="2024 Freightliner Cascadia"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Assign Initial Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="">-- Leave Unassigned --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Add Power Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
