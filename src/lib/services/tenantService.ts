export interface TenantOrganization {
  id: string;
  name: string;
  slug: string;
  type: 'freight_brokerage' | 'independent_dispatch';
  subscriptionTier: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'pending' | 'suspended';
  adminEmail: string;
  mcDotNumber: string;
  fleetSizeOrVolume: string;
  mrr: number;
  totalLoads: number;
  activationToken: string;
  createdAt: string;
}

export interface DemoRequest {
  id: string;
  fullName: string;
  workEmail: string;
  phone?: string;
  companyName: string;
  mcDotNumber: string;
  fleetSizeOrVolume: string;
  edition: 'freight_brokerage' | 'independent_dispatch';
  status: 'pending' | 'provisioned' | 'rejected';
  submittedAt: string;
}

export const initialMockTenants: TenantOrganization[] = [
  {
    id: 'tnt_apex_01',
    name: 'Apex Global Freight Logistics',
    slug: 'apex-logistics',
    type: 'freight_brokerage',
    subscriptionTier: 'growth',
    status: 'active',
    adminEmail: 'broker@apexlogistics.com',
    mcDotNumber: 'MC-940128 / DOT-3849102',
    fleetSizeOrVolume: '250+ loads/mo',
    mrr: 499,
    totalLoads: 142,
    activationToken: 'act_apex_prod_99182',
    createdAt: '2025-11-10T08:00:00Z',
  },
  {
    id: 'tnt_swift_02',
    name: 'Swift Fleet Dispatch LLC',
    slug: 'swift-fleet',
    type: 'independent_dispatch',
    subscriptionTier: 'starter',
    status: 'active',
    adminEmail: 'dispatcher@swiftfleet.com',
    mcDotNumber: 'MC-1049281 / DOT-3819201',
    fleetSizeOrVolume: '12 Power Units',
    mrr: 239,
    totalLoads: 88,
    activationToken: 'act_swift_prod_44012',
    createdAt: '2025-12-04T09:30:00Z',
  },
  {
    id: 'tnt_titan_03',
    name: 'Titan Freight Brokerage Inc',
    slug: 'titan-freight',
    type: 'freight_brokerage',
    subscriptionTier: 'enterprise',
    status: 'active',
    adminEmail: 'catherine@titanfreight.com',
    mcDotNumber: 'MC-771920 / DOT-2910482',
    fleetSizeOrVolume: '600+ loads/mo',
    mrr: 999,
    totalLoads: 340,
    activationToken: 'act_titan_prod_88194',
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    id: 'tnt_redstar_04',
    name: 'Red Star Heavy Haul Dispatch',
    slug: 'red-star-dispatch',
    type: 'independent_dispatch',
    subscriptionTier: 'growth',
    status: 'active',
    adminEmail: 'dmitri@redstartrucking.com',
    mcDotNumber: 'MC-819203 / DOT-3194012',
    fleetSizeOrVolume: '25 Flatbed Units',
    mrr: 499,
    totalLoads: 115,
    activationToken: 'act_redstar_prod_33019',
    createdAt: '2026-02-01T14:15:00Z',
  },
];

export const initialMockDemoRequests: DemoRequest[] = [
  {
    id: 'req_101',
    fullName: 'David Sterling',
    workEmail: 'david@sterlingfreight.io',
    phone: '+1 (555) 304-9912',
    companyName: 'Sterling 3PL Logistics',
    mcDotNumber: 'MC-559102',
    fleetSizeOrVolume: '150 loads/month',
    edition: 'freight_brokerage',
    status: 'pending',
    submittedAt: '10 mins ago',
  },
  {
    id: 'req_102',
    fullName: 'Maria Rodriguez',
    workEmail: 'maria@ironhorsedispatch.com',
    phone: '+1 (555) 778-2231',
    companyName: 'Iron Horse Fleet Dispatch',
    mcDotNumber: 'DOT-3910284',
    fleetSizeOrVolume: '18 Trucks',
    edition: 'independent_dispatch',
    status: 'pending',
    submittedAt: '1 hour ago',
  },
  {
    id: 'req_103',
    fullName: 'Kevin Thorne',
    workEmail: 'kevin@pinnaclecarrier.com',
    phone: '+1 (555) 991-3482',
    companyName: 'Pinnacle Freight Network',
    mcDotNumber: 'MC-640192',
    fleetSizeOrVolume: '400 loads/month',
    edition: 'freight_brokerage',
    status: 'provisioned',
    submittedAt: 'Yesterday',
  },
];

const TENANTS_KEY = 'tms_tenants_registry';
const DEMO_REQUESTS_KEY = 'tms_demo_requests';

export const tenantService = {
  async getTenants(): Promise<TenantOrganization[]> {
    if (typeof window === 'undefined') return initialMockTenants;
    try {
      const saved = localStorage.getItem(TENANTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockTenants;
  },

  async getDemoRequests(): Promise<DemoRequest[]> {
    if (typeof window === 'undefined') return initialMockDemoRequests;
    try {
      const saved = localStorage.getItem(DEMO_REQUESTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockDemoRequests;
  },

  async createDemoRequest(data: Omit<DemoRequest, 'id' | 'status' | 'submittedAt'>): Promise<DemoRequest> {
    const newReq: DemoRequest = {
      ...data,
      id: `req_${Date.now()}`,
      status: 'pending',
      submittedAt: 'Just now',
    };

    if (typeof window !== 'undefined') {
      try {
        const existing = await this.getDemoRequests();
        const updated = [newReq, ...existing];
        localStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(updated));
      } catch {}
    }
    return newReq;
  },

  async provisionTenant(data: {
    name: string;
    adminEmail: string;
    mcDotNumber: string;
    subscriptionTier: 'starter' | 'growth' | 'enterprise';
    type: 'freight_brokerage' | 'independent_dispatch';
    fleetSizeOrVolume?: string;
    demoRequestId?: string;
  }): Promise<TenantOrganization> {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const mrrMap = { starter: 239, growth: 499, enterprise: 999 };

    const newTenant: TenantOrganization = {
      id: `tnt_${Date.now()}`,
      name: data.name,
      slug: slug || `tenant-${Date.now()}`,
      type: data.type,
      subscriptionTier: data.subscriptionTier,
      status: 'active',
      adminEmail: data.adminEmail,
      mcDotNumber: data.mcDotNumber || 'MC-Pending',
      fleetSizeOrVolume: data.fleetSizeOrVolume || 'Standard Tier',
      mrr: mrrMap[data.subscriptionTier] || 499,
      totalLoads: 0,
      activationToken: `act_${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        const tenants = await this.getTenants();
        const updatedTenants = [newTenant, ...tenants];
        localStorage.setItem(TENANTS_KEY, JSON.stringify(updatedTenants));

        if (data.demoRequestId) {
          const requests = await this.getDemoRequests();
          const updatedRequests = requests.map((r) =>
            r.id === data.demoRequestId ? { ...r, status: 'provisioned' as const } : r
          );
          localStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(updatedRequests));
        }
      } catch {}
    }

    return newTenant;
  },

  async toggleTenantStatus(tenantId: string): Promise<TenantOrganization[]> {
    const tenants = await this.getTenants();
    const updated = tenants.map((t) =>
      t.id === tenantId
        ? { ...t, status: t.status === 'active' ? ('suspended' as const) : ('active' as const) }
        : t
    );

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TENANTS_KEY, JSON.stringify(updated));
      } catch {}
    }
    return updated;
  },
};
