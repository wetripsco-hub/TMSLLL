export type LoadStatus = 'available' | 'dispatched' | 'in_transit' | 'delivered' | 'invoiced' | 'cancelled';
export type EquipmentType = 'Dry Van' | 'Reefer' | 'Flatbed' | 'Step Deck' | 'Power Only' | 'Other';
export type StopType = 'pickup' | 'delivery';

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
    };
  };
}

export type LoadRow = Database['public']['Tables']['loads']['Row'];
export type LoadInsert = Database['public']['Tables']['loads']['Insert'];
export type LoadStopRow = Database['public']['Tables']['load_stops']['Row'];
export type LoadStopInsert = Database['public']['Tables']['load_stops']['Insert'];
