export type UserRole = 'broker' | 'dispatcher' | 'admin';
export type LoadStatus = 'available' | 'booked' | 'dispatched' | 'loaded' | 'in_transit' | 'delivered' | 'invoiced' | 'paid' | 'cancelled';
export type EquipmentType = 'dry_van' | 'reefer' | 'flatbed' | 'step_deck' | 'power_only';
export type StopType = 'pickup' | 'delivery';
export type TruckStatus = 'available' | 'dispatched' | 'in_transit' | 'maintenance' | 'off_duty';
export type DriverStatus = 'available' | 'driving' | 'sleeper' | 'off_duty';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TruckItem {
  id: string;
  dispatcherId: string;
  unitNumber: string;
  trailerNumber?: string;
  equipmentType: EquipmentType;
  makeModel: string;
  year: number;
  vin?: string;
  plateNumber?: string;
  status: TruckStatus;
  currentLocation: {
    city: string;
    state: string;
    lat: number;
    lng: number;
    updatedAt: string;
  };
  assignedDriver?: {
    id: string;
    name: string;
    phone: string;
  };
  rpmTarget: number;
  currentLoadNumber?: string;
}

export interface DriverItem {
  id: string;
  dispatcherId: string;
  currentTruckId?: string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseState: string;
  medicalCardExpiry?: string;
  status: DriverStatus;
  createdAt: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          company_name: string;
          role: UserRole;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      loads: {
        Row: {
          id: string;
          reference_number: string;
          broker_id: string | null;
          dispatcher_id: string | null;
          shipper_id: string | null;
          carrier_id: string | null;
          truck_id: string | null;
          driver_id: string | null;
          equipment_type: EquipmentType;
          commodity: string;
          weight: number;
          temperature: number | null;
          miles: number;
          shipper_rate: number;
          carrier_rate: number;
          margin_amount: number | null;
          margin_percentage: number | null;
          dispatcher_fee_rate: number;
          dispatcher_fee_amount: number;
          status: LoadStatus;
          tracking_token: string;
          tracking_active: boolean;
          rate_con_signed: boolean;
          rate_con_signer_name: string | null;
          stops: any;
          financials: any;
          driver_location: any;
          documents: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['loads']['Row'], 'id' | 'created_at' | 'updated_at'>> & { reference_number?: string };
        Update: Partial<Database['public']['Tables']['loads']['Insert']>;
      };
      load_stops: {
        Row: {
          id: string;
          load_id: string;
          stop_type: StopType;
          stop_sequence: number;
          facility_name: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          appointment_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['load_stops']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['load_stops']['Insert']>;
      };
      trucks: {
        Row: {
          id: string;
          dispatcher_id: string;
          unit_number: string;
          trailer_number: string | null;
          equipment_type: EquipmentType;
          make_model: string;
          year: number;
          vin: string | null;
          plate_number: string | null;
          status: TruckStatus;
          current_location: any;
          rpm_target: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['trucks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['trucks']['Insert']>;
      };
      drivers: {
        Row: {
          id: string;
          dispatcher_id: string;
          current_truck_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          license_number: string;
          license_state: string;
          medical_card_expiry: string | null;
          status: DriverStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['drivers']['Insert']>;
      };
      shippers: {
        Row: {
          id: string;
          broker_id: string | null;
          name: string;
          account_number: string;
          contact_name: string;
          phone: string;
          email: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          credit_limit: number;
          available_credit: number;
          payment_terms: string;
          credit_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['shippers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['shippers']['Insert']>;
      };
      carriers: {
        Row: {
          id: string;
          owner_id: string | null;
          mc_number: string;
          dot_number: string;
          name: string;
          contact_name: string;
          phone: string;
          email: string;
          city: string;
          state: string;
          safety_rating: string;
          safety_score: number;
          insurance_company: string;
          insurance_coverage_amount: number;
          insurance_expiration: string;
          factoring_company: string | null;
          preferred: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['carriers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['carriers']['Insert']>;
      };
    };
  };
}

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type LoadRow = Database['public']['Tables']['loads']['Row'];
export type LoadInsert = Database['public']['Tables']['loads']['Insert'];
export type LoadStopRow = Database['public']['Tables']['load_stops']['Row'];
export type LoadStopInsert = Database['public']['Tables']['load_stops']['Insert'];
export type TruckRow = Database['public']['Tables']['trucks']['Row'];
export type DriverRow = Database['public']['Tables']['drivers']['Row'];
export type ShipperRow = Database['public']['Tables']['shippers']['Row'];
export type CarrierRow = Database['public']['Tables']['carriers']['Row'];
