import { BaseModel } from './base-model';

export class Contact extends BaseModel {
  header?: string;
  title?: string;
  description?: string;
  contactInformation?: {
    ourOffice: any[];
    phoneNumbers: any[];
    emailAddress: any[];
  };
}