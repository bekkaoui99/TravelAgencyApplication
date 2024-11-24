import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {DayTripResponse} from "../types/DayTrip/DayTripResponse";
import {TravelRequest} from "../types/Travel/TravelRequest";
import {TravelResponse} from "../types/Travel/TravelResponse";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TravelService extends CrudService<TravelRequest, TravelResponse, string>{

  private static REST_API_URL = environment.REST_API_URL;
  private  TRAVEL_REST_API_URL = environment.REST_API_URL + "/travels";

  constructor(http: HttpClient) {
    super(http, `${TravelService.REST_API_URL}/travels`);
  }


  uploadTravelImages(id: string, travelImageFiles: File[]): Observable<TravelResponse> {

    const formData = new FormData();
    formData.append('travelId', id);

    travelImageFiles.forEach((file: File) => {
      if (file instanceof File && file.size > 0) {
        formData.append('travelImages', file);
      }
    });

    return this.http.post<TravelResponse>(`${this.TRAVEL_REST_API_URL}/uploadTravelImages`, formData);

  }


  canceledReservation(travelId: string , clientId: string) : Observable<TravelResponse>{
    const requestBody = { travelId, clientId };
    return this.http.post<TravelResponse>(`${this.TRAVEL_REST_API_URL}/canceledReservation` , requestBody)
  }


  cloneWithTravelId(id: string) : Observable<TravelResponse>{
    return this.http.post<TravelResponse>(`${this.TRAVEL_REST_API_URL}/clone/${id}` , {})
  }

  cloneWithTravelObject(travelRequest: TravelRequest): Observable<TravelResponse> {
    return this.http.post<TravelResponse>(`${this.TRAVEL_REST_API_URL}/clone` , travelRequest)
  }

}
