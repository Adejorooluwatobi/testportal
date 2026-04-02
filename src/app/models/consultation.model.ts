import { BaseModel } from './base-model';

export class Consultation extends BaseModel {
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string;
  subject?: string;
  message?: string;
  isRead?: boolean;
}
