import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {GuideRequest} from "../types/Guide/GuideRequest";
import {GuideResponse} from "../types/Guide/GuideResponse";
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {ClientRequest} from "../types/Client/ClientRequest";
import {Observable} from "rxjs";
import {ClientResponse} from "../types/Client/ClientResponse";

@Injectable({
  providedIn: 'root'
})
export class GuideService extends CrudService<FormData, GuideResponse, string>{

  private static REST_API_URL = environment.REST_API_URL;
  private  GUIDE_REST_API_URL = environment.REST_API_URL + "/guides";

  constructor(http: HttpClient) {
    super(http, `${GuideService.REST_API_URL}/guides`);
  }

  updateGuide(guideData: GuideRequest, imageFile: File | null): Observable<GuideResponse> {
    const formData: FormData = new FormData();

    formData.append('firstName', guideData.firstName);
    formData.append('lastName', guideData.lastName);
    formData.append('userName', guideData.userName || '');
    formData.append('country', guideData.country);
    formData.append('phone', guideData.phone);
    formData.append('cin', guideData.cin);
    formData.append('email', guideData.email);
    formData.append('password', guideData.password);
    formData.append('confirmationPassword', guideData.confirmationPassword);
    // Append the image file if it exists
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.put<GuideResponse>(`${this.GUIDE_REST_API_URL}/${guideData.id}`, formData);
  }


}
