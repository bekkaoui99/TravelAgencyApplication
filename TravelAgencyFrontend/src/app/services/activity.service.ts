import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {ActivityRequest} from "../types/Activity/ActivityRequest";
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivityResponse} from "../types/Activity/ActivityResponse";
import {ClientRequest} from "../types/Client/ClientRequest";
import {ClientResponse} from "../types/Client/ClientResponse";
import {Hotel} from "../types/Hotel/Hotel";

@Injectable({
  providedIn: 'root'
})
export class ActivityService  extends CrudService<FormData, ActivityResponse, string>{

  private static REST_API_URL = environment.REST_API_URL;
  private  ACTIVITY_REST_API_URL = environment.REST_API_URL + "/activities";

  constructor(http: HttpClient) {
    super(http, `${ActivityService.REST_API_URL}/activities`);
  }

  cloneWithActivityId(id: string) : Observable<ActivityResponse>{
    return this.http.post<ActivityResponse>(`${this.ACTIVITY_REST_API_URL}/clone/${id}` , {})
  }
  cloneWithActivityObject(activity: FormData): Observable<ActivityResponse> {
    return this.http.post<ActivityResponse>(`${this.ACTIVITY_REST_API_URL}/clone` , activity)
  }
  getActivityById(id: string): Observable<ActivityResponse> {
    return this.http.get<ActivityResponse>(`${this.ACTIVITY_REST_API_URL}/byId/${id}`)
  }
}
