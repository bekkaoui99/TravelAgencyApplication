import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StatisticResponse} from "../types/Statistic/StatisticResponse";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private  REST_API_URL = environment.REST_API_URL + "/statistics";

  constructor(private http: HttpClient) { }

  getStatistics():Observable<StatisticResponse>{
    return this.http.get<StatisticResponse>(`${this.REST_API_URL}`)
  }

}
