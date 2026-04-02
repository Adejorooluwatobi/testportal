import { BaseModel } from './base-model';

export class About extends BaseModel {
  banner?: {
    header: string;
    title: string;
    description: string;
  };
  ourMission?: {
    header: string;
    title: string;
    description: string;
    cards: any[];
  };
  ourVision?: {
    icon: string;
    title: string;
    description: string;
    progress: number;
  };
  team?: {
    header: string;
    title: string;
    description: string;
    card: {
      name: string;
      role: string;
      image: string;
      socials?: { link: string; icon: string }[];
    }[];
  };
  ourJourney?: any[];
}