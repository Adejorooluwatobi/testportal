import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { Notification } from '../models/notification.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends Repository<Notification> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'notifications');
  }

  readAll(): Observable<any> {
    return this.httpClient.patch(`${this.url}/read-all`, {});
  }
}
