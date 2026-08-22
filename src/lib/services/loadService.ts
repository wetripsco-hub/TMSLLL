import { DispatchLoad } from '@/types/tms';
import { initialMockLoads } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

const LOADS_STORAGE_KEY = 'tms_loads_data';

export const loadService = {
  /**
   * Fetch all loads with Supabase sync and persistent local fallback
   */
  async getLoads(): Promise<DispatchLoad[]> {
    if (typeof window === 'undefined') return initialMockLoads;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          loadNumber: d.reference_number,
          shipper: d.stops?.[0]?.facility ? {
            id: d.shipper_id || 'shp_1',
            name: d.stops[0].facility,
            contact: 'Shipping Desk',
            phone: '+1 (555) 019-2834',
            email: 'desk@shipper.com',
            creditLimit: 75000,
            availableCredit: 75000,
            paymentTerms: 'Net 30',
          } : initialMockLoads[0].shipper,
          carrier: d.carrier_id ? {
            id: d.carrier_id,
            name: 'Assigned Motor Carrier',
            mcNumber: '1049281',
            dotNumber: '3819201',
            driverName: 'Marcus Vance',
            driverPhone: '+1 (555) 889-1029',
            insuranceExpiry: '2026-11-30',
            safetyRating: 'Satisfactory',
          } : null,
          equipment: d.equipment_type || 'reefer',
          status: d.status || 'available',
          stops: d.stops || [],
          financials: d.financials || {
            shipperRate: d.shipper_rate || 3500,
            carrierRate: d.carrier_rate || 2900,
            fuelSurcharge: 320,
            accessorials: 0,
            lumperFee: 0,
            detention: 0,
            margin: d.margin_amount || 600,
            marginPercent: d.margin_percentage || 17.1,
          },
          miles: d.miles || 740,
          rpm: Number(((d.shipper_rate || 3500) / (d.miles || 740)).toFixed(2)),
          commodity: d.commodity || 'Freight Goods',
          weightLbs: d.weight || 42000,
          temperature: d.temperature ? `${d.temperature}°F` : undefined,
          trackingToken: d.tracking_token || `trk_${d.id}`,
          trackingActive: d.tracking_active || false,
          rateConSigned: d.rate_con_signed || false,
          rateConSignerName: d.rate_con_signer_name,
          driverLocation: d.driver_location,
          documents: d.documents || [],
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Fallback
    }

    try {
      const saved = localStorage.getItem(LOADS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    return initialMockLoads;
  },

  /**
   * Save a newly created load
   */
  async createLoad(newLoad: Partial<DispatchLoad>): Promise<DispatchLoad> {
    const miles = newLoad.miles || 750;
    const shipperRate = newLoad.financials?.shipperRate || 3500;
    const carrierRate = newLoad.financials?.carrierRate || 2900;
    const margin = shipperRate - carrierRate;
    const marginPercent = Number(((margin / shipperRate) * 100).toFixed(1));

    const load: DispatchLoad = {
      id: `ld_${Date.now()}`,
      loadNumber: newLoad.loadNumber || `FF-${Math.floor(10000 + Math.random() * 90000)}`,
      shipper: newLoad.shipper || initialMockLoads[0].shipper,
      carrier: newLoad.carrier || null,
      equipment: newLoad.equipment || 'reefer',
      status: newLoad.status || 'available',
      stops: newLoad.stops || initialMockLoads[0].stops,
      financials: {
        shipperRate,
        carrierRate,
        fuelSurcharge: newLoad.financials?.fuelSurcharge || 320,
        accessorials: 0,
        lumperFee: 0,
        detention: 0,
        margin,
        marginPercent,
      },
      miles,
      rpm: Number((shipperRate / miles).toFixed(2)),
      commodity: newLoad.commodity || 'General Freight',
      weightLbs: newLoad.weightLbs || 42000,
      temperature: newLoad.temperature,
      trackingToken: `trk_${Math.random().toString(36).substring(2, 10)}`,
      trackingActive: false,
      rateConSigned: false,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Attempt Supabase insert
    try {
      const supabase = createClient();
      await supabase.from('loads').insert({
        reference_number: load.loadNumber,
        equipment_type: load.equipment,
        commodity: load.commodity,
        weight: load.weightLbs,
        miles: load.miles,
        shipper_rate: load.financials.shipperRate,
        carrier_rate: load.financials.carrierRate,
        margin_amount: load.financials.margin,
        margin_percentage: load.financials.marginPercent,
        status: load.status,
        tracking_token: load.trackingToken,
        stops: load.stops,
        financials: load.financials,
      });
    } catch {}

    // Persist to local cache
    if (typeof window !== 'undefined') {
      try {
        const current = await this.getLoads();
        const updated = [load, ...current];
        localStorage.setItem(LOADS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }

    return load;
  },

  /**
   * Update load status
   */
  async updateStatus(id: string, status: DispatchLoad['status']): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const current = await this.getLoads();
        const updated = current.map((l) => (l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l));
        localStorage.setItem(LOADS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  },
};
