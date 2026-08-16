export type LoadStatus = 'available' | 'dispatched' | 'in_transit' | 'delivered' | 'invoiced' | 'cancelled';
export type EquipmentType = 'Dry Van' | 'Reefer' | 'Flatbed' | 'Step Deck' | 'Power Only' | 'Other';
export type StopType = 'pickup' | 'delivery';

export type SafetyRating = 'Satisfactory' | 'Conditional' | 'Unsatisfactory' | 'None';
export type OperatingStatus = 'Active' | 'Inactive' | 'Unauthorized';

export type DocumentType = 'rate_con' | 'bol' | 'invoice' | 'other';

export interface Database {
  public: {
    Tables: {
      loads: {
        Row: {
          id: string;
          reference_number: string;
          shipper_id: string;
          carrier_id: string | null;
          equipment_type: EquipmentType;
          commodity: string;
          weight: number;
          temperature: number | null;
          shipper_rate: number;
          carrier_rate: number | null;
          margin_amount: number | null;
          margin_percentage: number | null;
          status: LoadStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['loads']['Row'], 'id' | 'created_at' | 'updated_at'>;
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
      carriers: {
        Row: {
          id: string;
          company_name: string;
          dot_number: string;
          mc_number: string;
          safety_rating: SafetyRating;
          operating_status: OperatingStatus;
          insurance_on_file: boolean;
          insurance_expiry_date: string | null;
          physical_address: string;
          phone: string;
          is_active_in_directory: boolean;
          assigned_load_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['carriers']['Row'], 'id' | 'created_at' | 'updated_at' | 'assigned_load_count'>;
        Update: Partial<Database['public']['Tables']['carriers']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          load_id: string;
          doc_type: DocumentType;
          file_name: string;
          file_url: string | null;
          signature_base64: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
    };
  };
}

export type LoadRow = Database['public']['Tables']['loads']['Row'];
export type LoadInsert = Database['public']['Tables']['loads']['Insert'];
export type LoadStopRow = Database['public']['Tables']['load_stops']['Row'];
export type LoadStopInsert = Database['public']['Tables']['load_stops']['Insert'];
export type CarrierRow = Database['public']['Tables']['carriers']['Row'];
export type CarrierInsert = Database['public']['Tables']['carriers']['Insert'];
export type DocumentRow = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
