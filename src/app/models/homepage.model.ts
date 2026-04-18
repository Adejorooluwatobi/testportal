import { BaseModel } from './base-model';

export class HomePage extends BaseModel {
  banner?: {
    header: string;
    title: string;
    description: string;
    buttons: any[];
    imageUrl: string;
    bannerSummary: any[];
  };
  whatWeDo?: {
    header: string;
    title: string;
    description: string;
  };
  testimonials?: {
    header: string;
    title: string;
    description: string;
    items: any[];
  };
  quote?: {
    header: string;
    text: string;
    author: string;
    cards: any[];
  };
  donate?: {
    header: string;
    title: string;
    description: string;
    buttons: any[];
  };
  partners?: any[];
  video?: string;
}