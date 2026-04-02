import { BaseModel } from './base-model';

export class Program extends BaseModel {
  banner?: {
    header: string;
    title: string;
    description: string;
  };
  card?: any[];
}