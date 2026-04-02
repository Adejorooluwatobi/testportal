import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends Repository<Admin> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'admins');
  }
}