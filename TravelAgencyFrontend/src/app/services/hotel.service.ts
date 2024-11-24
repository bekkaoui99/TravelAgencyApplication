import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Hotel} from "../types/Hotel/Hotel";
import {Observable} from "rxjs";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class HotelService extends CrudService<Hotel , Hotel , string>{

  private static REST_API_URL = environment.REST_API_URL;
  private  HOTEL_REST_API_URL = environment.REST_API_URL + "/hotels";

  constructor(http: HttpClient) {
    super(http, `${HotelService.REST_API_URL}/hotels`);
  }

  cloneWithHotelId(id: string): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.HOTEL_REST_API_URL}/clone/${id}` , {})
  }

  cloneWithHotelObject(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.HOTEL_REST_API_URL}/clone` , hotel)
  }

}
