import { ShipperAccount } from '@/types/tms';
import { initialMockShippers } from '@/lib/mock-data';

const SHIPPERS_STORAGE_KEY = 'tms_shippers_data';

export const shipperService = {
  async getShippers(): Promise<ShipperAccount[]> {
    if (typeof window === 'undefined') return initialMockShippers;
    try {
      const saved = localStorage.getItem(SHIPPERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockShippers;
  },

  async addShipper(shipper: Partial<ShipperAccount>): Promise<ShipperAccount> {
    const newShipper: ShipperAccount = {
      id: `shp_${Date.now()}`,
      name: shipper.name || 'New Shipper Account',
      accountNumber: shipper.accountNumber || `SHP-${Math.floor(1000 + Math.random() * 9000)}`,
      contactName: shipper.contactName || 'Logistics Coordinator',
      phone: shipper.phone || '+1 (555) 019-2834',
      email: shipper.email || 'shipping@company.com',
      address: shipper.address || '100 Industrial Parkway',
      city: shipper.city || 'Dallas',
      state: shipper.state || 'TX',
      zip: shipper.zip || '75201',
      creditLimit: shipper.creditLimit || 75000,
      availableCredit: shipper.availableCredit || 75000,
      activeLoadsCount: 0,
      paymentTerms: shipper.paymentTerms || 'Net 30',
      creditStatus: shipper.creditStatus || 'approved',
    };

    if (typeof window !== 'undefined') {
      try {
        const current = await this.getShippers();
        const updated = [newShipper, ...current];
        localStorage.setItem(SHIPPERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }

    return newShipper;
  },
};
