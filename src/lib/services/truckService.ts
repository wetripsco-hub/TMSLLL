import { TruckItem, DriverItem } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';

export const initialMockTrucks: TruckItem[] = [
  {
    id: 'trk_1',
    dispatcherId: 'usr_disp_992',
    unitNumber: 'Unit-101',
    trailerNumber: 'TR-5301',
    equipmentType: 'reefer',
    makeModel: '2024 Freightliner Cascadia',
    year: 2024,
    vin: '1FUJGLDR5PL891024',
    plateNumber: 'TX-992-AKL',
    status: 'in_transit',
    currentLocation: {
      city: 'Jackson',
      state: 'MS',
      lat: 32.2988,
      lng: -90.1848,
      updatedAt: '10 mins ago',
    },
    assignedDriver: {
      id: 'drv_1',
      name: 'Marcus Vance',
      phone: '+1 (555) 889-1029',
    },
    rpmTarget: 2.85,
    currentLoadNumber: 'FF-88902',
  },
  {
    id: 'trk_2',
    dispatcherId: 'usr_disp_992',
    unitNumber: 'Unit-104',
    trailerNumber: 'TR-5304',
    equipmentType: 'dry_van',
    makeModel: '2023 Kenworth T680',
    year: 2023,
    vin: '1XKDDP9X8PR392019',
    plateNumber: 'TX-448-PLM',
    status: 'available',
    currentLocation: {
      city: 'Dallas',
      state: 'TX',
      lat: 32.7767,
      lng: -96.7970,
      updatedAt: '25 mins ago',
    },
    assignedDriver: {
      id: 'drv_2',
      name: 'Darius Thorne',
      phone: '+1 (555) 302-9912',
    },
    rpmTarget: 2.50,
  },
  {
    id: 'trk_3',
    dispatcherId: 'usr_disp_992',
    unitNumber: 'Unit-108',
    trailerNumber: 'TR-5308',
    equipmentType: 'flatbed',
    makeModel: '2023 Peterbilt 579',
    year: 2023,
    vin: '1XP4DP9X2PD881920',
    plateNumber: 'TX-109-WQR',
    status: 'dispatched',
    currentLocation: {
      city: 'Little Rock',
      state: 'AR',
      lat: 34.7465,
      lng: -92.2896,
      updatedAt: '1 hour ago',
    },
    assignedDriver: {
      id: 'drv_3',
      name: 'Sergei Volkov',
      phone: '+1 (555) 749-1028',
    },
    rpmTarget: 3.10,
    currentLoadNumber: 'FF-88903',
  },
  {
    id: 'trk_4',
    dispatcherId: 'usr_disp_992',
    unitNumber: 'Unit-112',
    trailerNumber: 'TR-5312',
    equipmentType: 'step_deck',
    makeModel: '2024 Volvo VNL 860',
    year: 2024,
    vin: '4V4NC9EH8RN992011',
    plateNumber: 'TX-882-ZZK',
    status: 'available',
    currentLocation: {
      city: 'Houston',
      state: 'TX',
      lat: 29.7604,
      lng: -95.3698,
      updatedAt: 'Just now',
    },
    assignedDriver: {
      id: 'drv_4',
      name: 'Jackson Reed',
      phone: '+1 (555) 482-1920',
    },
    rpmTarget: 3.25,
  },
];

export const initialMockDrivers: DriverItem[] = [
  {
    id: 'drv_1',
    dispatcherId: 'usr_disp_992',
    name: 'Marcus Vance',
    phone: '+1 (555) 889-1029',
    email: 'marcus.v@swiftfleet.com',
    licenseNumber: 'TX-CDL-998201',
    licenseState: 'TX',
    medicalCardExpiry: '2026-12-15',
    status: 'driving',
    currentTruckId: 'trk_1',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'drv_2',
    dispatcherId: 'usr_disp_992',
    name: 'Darius Thorne',
    phone: '+1 (555) 302-9912',
    email: 'darius.t@swiftfleet.com',
    licenseNumber: 'TX-CDL-448201',
    licenseState: 'TX',
    medicalCardExpiry: '2026-10-20',
    status: 'available',
    currentTruckId: 'trk_2',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'drv_3',
    dispatcherId: 'usr_disp_992',
    name: 'Sergei Volkov',
    phone: '+1 (555) 749-1028',
    email: 'sergei.v@swiftfleet.com',
    licenseNumber: 'TX-CDL-119283',
    licenseState: 'TX',
    medicalCardExpiry: '2027-02-18',
    status: 'driving',
    currentTruckId: 'trk_3',
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'drv_4',
    dispatcherId: 'usr_disp_992',
    name: 'Jackson Reed',
    phone: '+1 (555) 482-1920',
    email: 'jackson.r@swiftfleet.com',
    licenseNumber: 'TX-CDL-882910',
    licenseState: 'TX',
    medicalCardExpiry: '2026-09-30',
    status: 'available',
    currentTruckId: 'trk_4',
    createdAt: '2026-02-05T00:00:00Z',
  },
];

const TRUCKS_STORAGE_KEY = 'tms_trucks_data';
const DRIVERS_STORAGE_KEY = 'tms_drivers_data';

export const truckService = {
  /**
   * Get all trucks
   */
  async getTrucks(): Promise<TruckItem[]> {
    if (typeof window === 'undefined') return initialMockTrucks;
    try {
      const saved = localStorage.getItem(TRUCKS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockTrucks;
  },

  /**
   * Add a new truck to fleet
   */
  async addTruck(truck: Partial<TruckItem>): Promise<TruckItem> {
    const newTruck: TruckItem = {
      id: `trk_${Date.now()}`,
      dispatcherId: truck.dispatcherId || 'usr_disp_992',
      unitNumber: truck.unitNumber || `Unit-${Math.floor(100 + Math.random() * 900)}`,
      trailerNumber: truck.trailerNumber,
      equipmentType: truck.equipmentType || 'dry_van',
      makeModel: truck.makeModel || '2024 Freightliner Cascadia',
      year: truck.year || 2024,
      vin: truck.vin || `1FUJGLDR5PL${Math.floor(100000 + Math.random() * 900000)}`,
      plateNumber: truck.plateNumber || 'TX-771-KLP',
      status: truck.status || 'available',
      currentLocation: truck.currentLocation || {
        city: 'Dallas',
        state: 'TX',
        lat: 32.7767,
        lng: -96.7970,
        updatedAt: 'Just now',
      },
      assignedDriver: truck.assignedDriver,
      rpmTarget: truck.rpmTarget || 2.80,
    };

    if (typeof window !== 'undefined') {
      try {
        const current = await this.getTrucks();
        const updated = [newTruck, ...current];
        localStorage.setItem(TRUCKS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }

    return newTruck;
  },

  /**
   * Get all drivers
   */
  async getDrivers(): Promise<DriverItem[]> {
    if (typeof window === 'undefined') return initialMockDrivers;
    try {
      const saved = localStorage.getItem(DRIVERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockDrivers;
  },

  /**
   * Assign driver to truck
   */
  async assignDriver(truckId: string, driver: { id: string; name: string; phone: string }): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const current = await this.getTrucks();
        const updated = current.map((t) => (t.id === truckId ? { ...t, assignedDriver: driver } : t));
        localStorage.setItem(TRUCKS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  },
};
