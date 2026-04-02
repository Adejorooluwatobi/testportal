import { BaseModel } from './base-model';

export class Donation extends BaseModel {
  banner?: {
    header: string;
    title: string;
    description: string;
  };
  choose?: {
    suggestedAmounts: number[];
    programs: string[];
  };
  addition?: Array<{
    header: string;
    description: string;
  }>;
  card?: Array<{
    header: string;
    annualGoal: number;
    amountRaised: number;
    progress: number;
    items: Array<{ figure: string; details: string }>;
  }>;
  details?: Array<{
    header: string;
    accountname: string;
    bank: string;
    accountno: string;
    text: string;
  }>;
}
