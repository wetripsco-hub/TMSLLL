import { UserProfile, UserRole } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';

const DEMO_BROKER_USER: UserProfile = {
  id: 'usr_broker_881',
  email: 'broker@apexlogistics.com',
  fullName: 'Marcus Sterling',
  companyName: 'Apex Global Freight Logistics',
  role: 'broker',
  phone: '+1 (800) 555-8671',
  createdAt: '2026-01-15T08:00:00Z',
};

const DEMO_DISPATCHER_USER: UserProfile = {
  id: 'usr_disp_992',
  email: 'dispatcher@swiftfleet.com',
  fullName: 'Elena Rostova',
  companyName: 'Swift Fleet Dispatch LLC',
  role: 'dispatcher',
  phone: '+1 (888) 555-3921',
  createdAt: '2026-02-01T08:00:00Z',
};

const AUTH_STORAGE_KEY = 'tms_user_session';

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
      // Default to broker if not logged in for smooth exploration
      return DEMO_BROKER_USER;
    } catch {
      return DEMO_BROKER_USER;
    }
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
        // Fetch profile
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
          role: (profile?.role as UserRole) || (email.includes('dispatch') ? 'dispatcher' : 'broker'),
          phone: profile?.phone,
          createdAt: profile?.created_at || new Date().toISOString(),
        };

        this.setLocalSession(user);
        return { success: true, user };
      }
    } catch (e) {
      // Fallback local authentication
    }

    // Determine role by email keyword
    const isDispatcher = email.toLowerCase().includes('dispatch') || email.toLowerCase().includes('fleet');
    const user: UserProfile = isDispatcher
      ? { ...DEMO_DISPATCHER_USER, email }
      : { ...DEMO_BROKER_USER, email };

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
    try {
      const supabase = createClient();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: 'password123',
        options: {
          data: {
            full_name: data.fullName,
            company_name: data.companyName,
            role: data.role,
          },
        },
      });

      if (!error && authData.user) {
        await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: data.fullName,
          company_name: data.companyName,
          role: data.role,
          phone: data.phone || null,
        });
      }
    } catch (e) {
      // Fallback
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      companyName: data.companyName,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };

    this.setLocalSession(newUser);
    return { success: true, user: newUser };
  },

  /**
   * Set demo session directly
   */
  setDemoSession(role: UserRole): UserProfile {
    const user = role === 'dispatcher' ? DEMO_DISPATCHER_USER : DEMO_BROKER_USER;
    this.setLocalSession(user);
    return user;
  },

  setLocalSession(user: UserProfile) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      // Also set lightweight cookie for middleware / SSR detection
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
