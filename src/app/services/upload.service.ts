import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(this.apiUrl, formData).pipe(
      map(response => response.url)
    );
  }

  uploadMultipleFiles(files: FileList | File[]): Observable<string[]> {
    const formData = new FormData();
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post<{ urls: string[] }>(`${this.apiUrl}/multiple`, formData).pipe(
      map(response => response.urls)
    );
  }
}
