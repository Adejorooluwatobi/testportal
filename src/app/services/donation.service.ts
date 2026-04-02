import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { Observable } from 'rxjs';
import { Donation } from '../models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService extends Repository<Donation> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'donation');
  }

  // Override create to use /page endpoint for upsert
  override create(item: Donation): Observable<any> {
    return this.httpClient.post(`${this.url}/page`, item);
  }
}
