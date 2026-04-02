import { BaseModel } from './base-model';

export class Notification extends BaseModel {
  type?: 'user_registration' | 'donation' | 'consultation' | 'volunteer_app';
  message?: string;
  referenceId?: string;
  isRead?: boolean;
}
