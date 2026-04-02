import { BaseModel } from './base-model';

export class VolunteerAppForm extends BaseModel {
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string;
  stateOfResidence?: string;
  availability?: string;
  areaOfExpertise?: string;
  preferredProgram?: string;
  whatYouVolunteer?: string;
  isRead?: boolean;
}