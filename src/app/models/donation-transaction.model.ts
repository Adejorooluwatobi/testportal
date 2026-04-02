import { BaseModel } from './base-model';

export class DonationTransaction extends BaseModel {
  firstname?: string;
  lastname?: string;
  email?: string;
  amount?: number;
  program?: string;
  message?: string;
  status?: 'pending' | 'success' | 'failed';
  isRead?: boolean;
}
