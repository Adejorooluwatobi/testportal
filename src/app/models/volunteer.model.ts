import { BaseModel } from './base-model';

export class Volunteer extends BaseModel {
  banner?: {
    header: string;
    title: string;
    description: string;
  };
  header?: string;
  title?: string;
  card?: any[];
}