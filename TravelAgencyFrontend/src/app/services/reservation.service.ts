import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {TravelRequest} from "../types/Travel/TravelRequest";
import {TravelResponse} from "../types/Travel/TravelResponse";
import {ReservationRequest} from "../types/Reservation/ReservationRequest";
import {ReservationResponse} from "../types/Reservation/ReservationResponse";
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends CrudService<ReservationRequest, ReservationResponse, string> {

  private static REST_API_URL = environment.REST_API_URL;
  private  RESERVATION_REST_API_URL = environment.REST_API_URL + "/reservations";

  constructor(http: HttpClient) {
    super(http, `${ReservationService.REST_API_URL}/reservations`);
  }

  /*
  // Method to call the clientReservation endpoint
  getClientReservation(reservationCode: string): Observable<ReservationResponse> {
    // Prepare the HTTP params with the reservationCode
    const params = new HttpParams().set('reservationCode', reservationCode);

    // Make a POST request to the endpoint with the reservation code
    return this.http.post<ReservationResponse>(`${this.RESERVATION_REST_API_URL}/clientReservation`, null, { params });
  }

   */

  getClientReservation(travelId: string , clientId: string): Observable<ReservationResponse> {
    const url = `${this.RESERVATION_REST_API_URL}/clientReservation`;

    const requestBody = {
      travelId: travelId,
      clientId: clientId
    };

    return this.http.post<ReservationResponse>(url, requestBody);
  }


}
