import { BaseModel } from './base-model';

export class News extends BaseModel {
  header?: string;
  title?: string;
  description?: string;
  cards?: any[];
}