import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {ClientResponse} from "../types/Client/ClientResponse";
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {CompanionRequest} from "../types/Companion/CompanionRequest";
import {CompanionResponse} from "../types/Companion/CompanionResponse";

@Injectable({
  providedIn: 'root'
})
export class CompanionService  extends CrudService<FormData, CompanionResponse, string>{

  private static REST_API_URL = environment.REST_API_URL;
  private  COMPANION_REST_API_URL = environment.REST_API_URL + "/companions";

  constructor(http: HttpClient) {
    super(http, `${CompanionService.REST_API_URL}/companions`);
  }


}
