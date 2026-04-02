import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { VolunteerAppForm } from '../models/volunteer-app-form.model';

@Injectable({
  providedIn: 'root'
})
export class VolunteerAppFormService extends Repository<VolunteerAppForm> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'volunteer/applications');
  }
}