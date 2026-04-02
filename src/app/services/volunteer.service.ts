import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { Volunteer } from '../models/volunteer.model';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService extends Repository<Volunteer> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'volunteer');
  }
}