import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment.development";
import {API_URL_TOKEN} from "./app.tokens";

@Injectable({
  providedIn: 'root'
})
export class CrudService<REQUEST , RESPONSE , ID> {

  protected readonly REST_API_URL :String;

  constructor(protected http:HttpClient ,
              @Inject(API_URL_TOKEN) private url: string
  ) {
    this.REST_API_URL = url;
  }

  create(request: REQUEST): Observable<RESPONSE> {
    return this.http.post<RESPONSE>(`${this.REST_API_URL}`, request);
  }

  getAll(): Observable<RESPONSE[]> {
    return this.http.get<RESPONSE[]>(`${this.REST_API_URL}/list`);
  }

  getById(id: ID): Observable<RESPONSE> {
    return this.http.get<RESPONSE>(`${this.REST_API_URL}/${id}`);
  }

  update(request: REQUEST , id: ID): Observable<RESPONSE> {
    return this.http.put<RESPONSE>(`${this.REST_API_URL}/${id}`, request);
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.REST_API_URL}/${id}`);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.REST_API_URL}/count`);
  }
}
