export type LoadStatus = 
  | 'available' 
  | 'booked' 
  | 'dispatched' 
  | 'loaded' 
  | 'in_transit' 
  | 'delivered' 
  | 'invoiced' 
  | 'paid' 
  | 'cancelled';

export type EquipmentType = 
  | 'dry_van' 
  | 'reefer' 
  | 'flatbed' 
  | 'step_deck' 
  | 'power_only'
  | 'box_truck'
  | 'hotshot';

export type DocumentType = 
  | 'bol' 
  | 'pod' 
  | 'rate_con' 
  | 'carrier_invoice' 
  | 'lumper_receipt' 
  | 'scale_ticket' 
  | 'coi' 
  | 'w9';

export interface DispatchStop {
  id: string;
  type: 'pickup' | 'delivery';
  sequence: number;
  facility: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  date: string;
  timeWindow: string;
  contactName?: string;
  contactPhone?: string;
  specialInstructions?: string;
  completedAt?: string;
  status: 'pending' | 'arrived' | 'departed';
}

export interface FinancialBreakdown {
  shipperRate: number;
  carrierRate: number;
  fuelSurcharge: number;
  accessorials: number;
  lumperFee: number;
  detention: number;
  margin: number;
  marginPercent: number;
}

export interface DispatchLoad {
  id: string;
  loadNumber: string;
  shipper: {
    id: string;
    name: string;
    contact: string;
    phone: string;
    email: string;
    creditLimit: number;
    availableCredit: number;
    paymentTerms: string;
  };
  carrier: {
    id: string;
    name: string;
    mcNumber: string;
    dotNumber: string;
    driverName?: string;
    driverPhone?: string;
    truckNumber?: string;
    trailerNumber?: string;
    safetyRating?: 'Satisfactory' | 'Conditional' | 'Unrated';
    insuranceExpiry?: string;
    coiVerified?: boolean;
    factoringCompany?: string;
  } | null;
  equipment: EquipmentType;
  status: LoadStatus;
  stops: DispatchStop[];
  financials: FinancialBreakdown;
  miles: number;
  rpm: number; // Rate per mile
  commodity: string;
  weightLbs: number;
  temperature?: string;
  sealNumber?: string;
  bolNumber?: string;
  trackingActive: boolean;
  trackingToken: string;
  rateConSigned: boolean;
  rateConSignedAt?: string;
  rateConSignerName?: string;
  driverLocation?: {
    lat: number;
    lng: number;
    city: string;
    state: string;
    lastUpdated: string;
    speedMph: number;
  };
  documents: {
    id: string;
    name: string;
    type: DocumentType;
    uploadedAt: string;
    fileSize: string;
    verified: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CarrierProfile {
  id: string;
  name: string;
  mcNumber: string;
  dotNumber: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'active' | 'pending_review' | 'inactive' | 'blacklisted';
  safetyRating: 'Satisfactory' | 'Conditional' | 'Unrated';
  safetyScore: number; // 0-100
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insuranceCoverageAmount: number;
  insuranceExpiration: string;
  daysToInsuranceExpiry: number;
  w9Verified: boolean;
  coiVerified: boolean;
  authorityActive: boolean;
  equipmentFleet: EquipmentType[];
  totalLoadsCompleted: number;
  onTimeDeliveryRate: number; // percentage
  averageRatePerMile: number;
  factoringCompany?: string;
  factoringEmail?: string;
  notes?: string;
  createdAt: string;
}

export interface ShipperProfile {
  id: string;
  name: string;
  accountNumber: string;
  contactName: string;
  phone: string;
  email: string;
  billingAddress: string;
  city: string;
  state: string;
  zip: string;
  creditScore: number; // Experian credit score (0-100)
  creditLimit: number;
  availableCredit: number;
  paymentTerms: 'Net 15' | 'Net 30' | 'Net 45' | 'QuickPay 2%';
  status: 'active' | 'credit_hold' | 'inactive';
  totalLoadsBooked: number;
  mtdVolume: number;
  ytdVolume: number;
  primaryCommodity: string;
  rating: number;
  notes?: string;
  createdAt: string;
}

export interface DocumentScanResult {
  id: string;
  fileName: string;
  fileType: DocumentType;
  fileSize: string;
  uploadDate: string;
  status: 'processing' | 'verified' | 'needs_review' | 'rejected';
  confidenceScore: number;
  extractedFields: {
    invoiceNumber?: string;
    loadNumber?: string;
    bolNumber?: string;
    carrierName?: string;
    shipperName?: string;
    originCity?: string;
    originState?: string;
    destCity?: string;
    destState?: string;
    deliveryDate?: string;
    linehaulAmount?: number;
    fuelSurcharge?: number;
    accessorials?: number;
    tax?: number;
    totalAmount?: number;
    weight?: number;
    pieceCount?: number;
    signeeName?: string;
  };
  validationAlerts: {
    type: 'warning' | 'error' | 'success';
    message: string;
  }[];
  previewUrl: string;
}

export interface AccountingTransaction {
  id: string;
  type: 'receivable' | 'payable';
  referenceNumber: string; // INV-XXXX or SET-XXXX
  loadNumber: string;
  partyName: string; // Shipper or Carrier name
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'paid' | 'pending' | 'overdue' | 'factored';
  agingBucket: 'Current' | '1-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days';
  paymentMethod?: string;
  paymentReference?: string;
  factoringBatchId?: string;
}
