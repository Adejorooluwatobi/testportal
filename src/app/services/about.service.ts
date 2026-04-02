import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { About } from '../models/about.model';

@Injectable({
  providedIn: 'root'
})
export class AboutService extends Repository<About> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'about');
  }
}