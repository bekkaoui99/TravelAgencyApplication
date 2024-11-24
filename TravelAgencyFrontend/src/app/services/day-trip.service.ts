import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {DayTripRequest} from "../types/DayTrip/DayTripRequest";
import {DayTripResponse} from "../types/DayTrip/DayTripResponse";
import {ClientRequest} from "../types/Client/ClientRequest";
import {Observable} from "rxjs";
import {ClientResponse} from "../types/Client/ClientResponse";
import {ActivityResponse} from "../types/Activity/ActivityResponse";

@Injectable({
  providedIn: 'root'
})
export class DayTripService extends CrudService<FormData, DayTripResponse, string>{

  private static REST_API_URL = environment.REST_API_URL;
  private  DAY_TRIP_REST_API_URL = environment.REST_API_URL + "/dayTrips";

  constructor(http: HttpClient) {
    super(http, `${DayTripService.REST_API_URL}/dayTrips`);
  }

  createDayTrip(dayTripRequest: DayTripRequest): Observable<DayTripResponse> {
    return this.http.post<DayTripResponse>(`${this.DAY_TRIP_REST_API_URL}`, dayTripRequest);
  }

  uploadDayTripImages(dayTripId: string, dayTripImages: File[]): Observable<DayTripResponse> {
    const formData = new FormData();
    formData.append('dayTripId', dayTripId);

    dayTripImages.forEach((file: File) => {
      if (file instanceof File && file.size > 0) {
        formData.append('dayTripImages', file);
      }
    });

    return this.http.post<DayTripResponse>(`${this.DAY_TRIP_REST_API_URL}/uploadDayTripImages`, formData);
  }

  cloneWithDayTripId(id: string) : Observable<DayTripResponse>{
    return this.http.post<DayTripResponse>(`${this.DAY_TRIP_REST_API_URL}/clone/${id}` , {})
  }

  cloneWithDayTripObject(activity: FormData): Observable<DayTripResponse> {
    return this.http.post<DayTripResponse>(`${this.DAY_TRIP_REST_API_URL}/clone` , activity)
  }

  getDayTripById(id: string): Observable<DayTripResponse> {
    return this.http.get<DayTripResponse>(`${this.DAY_TRIP_REST_API_URL}/byId/${id}`)
  }

}
