import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends Repository<Contact> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'contact');
  }
}