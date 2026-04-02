import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { HomePage } from '../models/homepage.model';

@Injectable({
  providedIn: 'root'
})
export class HomePageService extends Repository<HomePage> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'homepage');
  }
}