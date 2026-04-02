import { BaseModel } from './base-model';

export class User extends BaseModel {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  profile?: {
    id: string;
    phoneNumber: string;
    address: string;
    dob: string;
    bio: string;
    city: string;
    state: string;
    country: string;
  };
}