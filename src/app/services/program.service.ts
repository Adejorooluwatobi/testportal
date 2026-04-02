import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { Program } from '../models/program.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends Repository<Program> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'program');
  }
}