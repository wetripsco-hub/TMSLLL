export interface Carrier {
  id: string;
  mcNumber: string;
  dotNumber: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'blacklisted';
  insuranceExpiration?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
