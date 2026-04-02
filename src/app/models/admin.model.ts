import { BaseModel } from './base-model';

export class Admin extends BaseModel {
  username?: string;
  email?: string;
  password?: string;
  role?: 'super_admin' | 'technical' | 'operator';
  isActive?: boolean;
}