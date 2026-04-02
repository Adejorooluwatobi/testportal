import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { DonationTransaction } from '../models/donation-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class DonationTransactionService extends Repository<DonationTransaction> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'donation/records');
  }
}
