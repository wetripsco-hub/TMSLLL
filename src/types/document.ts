export type DocumentType = 'bol' | 'invoice' | 'rate_con' | 'proof_of_delivery' | 'other';

export interface Document {
  id: string;
  loadId: string;
  type: DocumentType;
  fileUrl: string;
  uploadedAt: Date | string;
  uploadedBy: string;
  ocrProcessed: boolean;
  ocrData?: any;
}
