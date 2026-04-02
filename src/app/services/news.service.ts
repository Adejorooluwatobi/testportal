import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends Repository<News> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'news');
  }
}