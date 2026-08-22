import { CarrierProfile } from '@/types/tms';
import { initialMockCarriers } from '@/lib/mock-data';

const CARRIERS_STORAGE_KEY = 'tms_carriers_data';

export const carrierService = {
  async getCarriers(): Promise<CarrierProfile[]> {
    if (typeof window === 'undefined') return initialMockCarriers;
    try {
      const saved = localStorage.getItem(CARRIERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockCarriers;
  },

  async addCarrier(carrier: Partial<CarrierProfile>): Promise<CarrierProfile> {
    const newCarrier: CarrierProfile = {
      id: `car_${Date.now()}`,
      name: carrier.name || 'New Carrier Logistics',
      mcNumber: carrier.mcNumber || '109281',
      dotNumber: carrier.dotNumber || '3819201',
      contactName: carrier.contactName || 'Dispatch Desk',
      phone: carrier.phone || '+1 (800) 555-0192',
      email: carrier.email || 'dispatch@carrier.com',
      city: carrier.city || 'Dallas',
      state: carrier.state || 'TX',
      safetyRating: carrier.safetyRating || 'Satisfactory',
      safetyScore: carrier.safetyScore || 95,
      insuranceExpiration: carrier.insuranceExpiration || '2026-11-30',
      daysToInsuranceExpiry: 88,
      insuranceCoverageAmount: carrier.insuranceCoverageAmount || 1000000,
      insuranceCompany: carrier.insuranceCompany || 'Progressive Commercial',
      factoringCompany: carrier.factoringCompany || 'TriumphPay Direct',
      preferred: carrier.preferred || false,
    };

    if (typeof window !== 'undefined') {
      try {
        const current = await this.getCarriers();
        const updated = [newCarrier, ...current];
        localStorage.setItem(CARRIERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }

    return newCarrier;
  },
};
