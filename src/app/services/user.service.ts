import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Repository<User> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'users');
  }
}