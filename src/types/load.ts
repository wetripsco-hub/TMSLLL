export type LoadStatus = 'pending' | 'dispatched' | 'in_transit' | 'delivered' | 'invoiced' | 'cancelled';

export interface Location {
  address: string;
  city: string;
  state: string;
  zip: string;
  date: Date | string;
}

export interface Load {
  id: string;
  referenceNumber: string;
  status: LoadStatus;
  shipperId: string;
  carrierId?: string;
  origin: Location;
  destination: Location;
  rate: number;
  weight: number;
  distance: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
