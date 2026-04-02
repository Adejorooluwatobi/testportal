import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { Consultation } from '../models/consultation.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService extends Repository<Consultation> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'consultation');
  }
}
