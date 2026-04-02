import { BaseModel } from './../models/base-model';
import { IRepository } from '../shared/irepository';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export abstract class Repository<T extends BaseModel> implements IRepository<T> {
    protected url: string;
    constructor(protected httpClient: HttpClient, private endpoint: string) {
        this.url = `${environment.apiUrl}${endpoint}`;
    }
    create(item: T): Observable<any> {
        return this.httpClient
        .post<any>(this.url, item);
    }

    update(item: T, id?: string): Observable<any> {
        if (id){
            return this.httpClient
            .put<T>(`${this.url}/${id}`, item);
        } else {
        return this.httpClient
        .put<T>(`${this.url}`, item);
        }
    }
    get(id?: string): Observable<any> {
        const fetchUrl = id ? `${this.url}/${id}` : this.url;
        return this.httpClient
        .get<any>(fetchUrl);
    }
    list(queryOptions?: any): Observable<any> {
        return this.httpClient
        .get<any>(this.url);
    }
    delete(id: string): Observable<T> {
        return this.httpClient
        .delete<T>(`${this.url}/${id}`);
    }
}
