import { UserProfile, UserRole } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';

export const DEMO_BROKER_USER: UserProfile = {
  id: 'usr_broker_881',
  email: 'broker@apexlogistics.com',
  fullName: 'Marcus Sterling',
  companyName: 'Apex Global Freight Logistics',
  role: 'broker',
  phone: '+1 (800) 555-8671',
  status: 'active',
  lastActiveAt: 'Just now',
  createdAt: '2026-01-15T08:00:00Z',
};

export const DEMO_DISPATCHER_USER: UserProfile = {
  id: 'usr_disp_992',
  email: 'dispatcher@swiftfleet.com',
  fullName: 'Elena Rostova',
  companyName: 'Swift Fleet Dispatch LLC',
  role: 'dispatcher',
  phone: '+1 (888) 555-3921',
  status: 'active',
  lastActiveAt: '2 mins ago',
  createdAt: '2026-02-01T08:00:00Z',
};

export const DEMO_ADMIN_USER: UserProfile = {
  id: 'usr_admin_001',
  email: 'admin@freightflow.ai',
  fullName: 'Alexander Vance',
  companyName: 'FreightFlow Global Infrastructure',
  role: 'admin',
  phone: '+1 (800) 555-0000',
  status: 'active',
  lastActiveAt: 'Just now',
  createdAt: '2025-08-15T00:00:00Z',
};

export const initialMockUsers: UserProfile[] = [
  DEMO_ADMIN_USER,
  DEMO_BROKER_USER,
  DEMO_DISPATCHER_USER,
  {
    id: 'usr_broker_882',
    email: 'catherine@titanfreight.com',
    fullName: 'Catherine Hayes',
    companyName: 'Titan Freight Brokerage Inc',
    role: 'broker',
    phone: '+1 (555) 998-1029',
    status: 'active',
    lastActiveAt: '14 mins ago',
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'usr_disp_993',
    email: 'dmitri@redstartrucking.com',
    fullName: 'Dmitri Pavlov',
    companyName: 'Red Star Heavy Haul Dispatch',
    role: 'dispatcher',
    phone: '+1 (555) 302-8819',
    status: 'active',
    lastActiveAt: '45 mins ago',
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'usr_broker_883',
    email: 'jordan@freightlink.io',
    fullName: 'Jordan Bell',
    companyName: 'FreightLink 3PL Solutions',
    role: 'broker',
    phone: '+1 (555) 441-2900',
    status: 'active',
    lastActiveAt: '2 hours ago',
    createdAt: '2026-02-14T00:00:00Z',
  },
];

const AUTH_STORAGE_KEY = 'tms_user_session';
const USERS_STORAGE_KEY = 'tms_users_registry';

export const authService = {
  /**
   * Retrieves active session user from localStorage or Supabase
   */
  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return DEMO_BROKER_USER;
    } catch {
      return DEMO_BROKER_USER;
    }
  },

  /**
   * Get all registered platform users for Admin console
   */
  async getUsers(): Promise<UserProfile[]> {
    if (typeof window === 'undefined') return initialMockUsers;
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockUsers;
  },

  /**
   * Toggle user account status
   */
  async toggleUserStatus(userId: string): Promise<UserProfile[]> {
    const current = await this.getUsers();
    const updated = current.map((u) =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? ('suspended' as const) : ('active' as const) }
        : u
    );
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
    return updated;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'password123',
      });

      if (!error && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: profile?.full_name || email.split('@')[0],
          companyName: profile?.company_name || 'Logistics Operations',
          role: (profile?.role as UserRole) || (email.includes('admin') ? 'admin' : email.includes('dispatch') ? 'dispatcher' : 'broker'),
          phone: profile?.phone,
          status: profile?.status || 'active',
          lastActiveAt: 'Just now',
          createdAt: profile?.created_at || new Date().toISOString(),
        };

        this.setLocalSession(user);
        return { success: true, user };
      }
    } catch (e) {
      // Fallback local authentication
    }

    let user: UserProfile;
    if (email.toLowerCase().includes('admin')) {
      user = { ...DEMO_ADMIN_USER, email, lastActiveAt: 'Just now' };
    } else if (email.toLowerCase().includes('dispatch') || email.toLowerCase().includes('fleet')) {
      user = { ...DEMO_DISPATCHER_USER, email, lastActiveAt: 'Just now' };
    } else {
      user = { ...DEMO_BROKER_USER, email, lastActiveAt: 'Just now' };
    }

    this.setLocalSession(user);
    return { success: true, user };
  },

  /**
   * Register new user with designated role
   */
  async signUp(data: {
    email: string;
    fullName: string;
    companyName: string;
    role: UserRole;
    phone?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      companyName: data.companyName,
      role: data.role,
      phone: data.phone,
      status: 'active',
      lastActiveAt: 'Just now',
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        const existing = await this.getUsers();
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([newUser, ...existing]));
      } catch {}
    }

    this.setLocalSession(newUser);
    return { success: true, user: newUser };
  },

  /**
   * Set demo session directly
   */
  setDemoSession(role: UserRole): UserProfile {
    let user: UserProfile;
    if (role === 'admin') {
      user = { ...DEMO_ADMIN_USER, lastActiveAt: 'Just now' };
    } else if (role === 'dispatcher') {
      user = { ...DEMO_DISPATCHER_USER, lastActiveAt: 'Just now' };
    } else {
      user = { ...DEMO_BROKER_USER, lastActiveAt: 'Just now' };
    }
    this.setLocalSession(user);
    return user;
  },

  setLocalSession(user: UserProfile) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      document.cookie = `tms_user_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
    }
  },

  signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      document.cookie = 'tms_user_role=; path=/; max-age=0';
    }
    const supabase = createClient();
    supabase.auth.signOut().catch(() => {});
  },
};
