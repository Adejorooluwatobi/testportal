import { Observable } from 'rxjs';

export interface IRepository<T> {
  create(item: T): Observable<any>;
  update(item: T, id?: string): Observable<any>;
  get(id?: string): Observable<any>;
  list(queryOptions?: any): Observable<any>;
  delete(id: string): Observable<T>;
}
