import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {ClientResponse} from "../types/Client/ClientResponse";
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ClientRequest} from "../types/Client/ClientRequest";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService extends CrudService<ClientRequest, ClientResponse, string>{

  private static REST_API_URL = environment.REST_API_URL;
  private  CLIENT_REST_API_URL = environment.REST_API_URL + "/clients";

  constructor(http: HttpClient) {
    super(http, `${ClientService.REST_API_URL}/clients`);
  }


  createClient(clientData: ClientRequest, imageFile: File | null): Observable<ClientResponse> {
    const formData: FormData = new FormData();

    formData.append('firstName', clientData.firstName);
    formData.append('lastName', clientData.lastName);
    formData.append('userName', clientData.userName || '');
    formData.append('country', clientData.country);
    formData.append('phone', clientData.phone);
    formData.append('cin', clientData.cin);
    formData.append('email', clientData.email);
    formData.append('password', clientData.password);
    formData.append('confirmationPassword', clientData.confirmationPassword);

    // Append passport data if it exists
    if (clientData.passport) {
      formData.append('passport.passportNumber', clientData.passport.passportNumber);
      formData.append('passport.issueDate', clientData.passport.issueDate);
      formData.append('passport.expiryDate', clientData.passport.expiryDate);
    }

    // Append the image file if it exists
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.post<ClientResponse>(`${this.CLIENT_REST_API_URL}`, formData);
  }

  updateClient(clientData: ClientRequest, imageFile: File | null , changePassword:boolean): Observable<ClientResponse> {
    const formData: FormData = new FormData();

    formData.append('firstName', clientData.firstName);
    formData.append('lastName', clientData.lastName);
    formData.append('userName', clientData.userName || '');
    formData.append('country', clientData.country);
    formData.append('phone', clientData.phone);
    formData.append('cin', clientData.cin);
    formData.append('email', clientData.email);
    if(changePassword){
      formData.append('password', clientData.password);
      formData.append('confirmationPassword', clientData.confirmationPassword);
    }
    // Append passport data if it exists
    if (clientData.passport) {
      formData.append('passport.passportNumber', clientData.passport.passportNumber);
      formData.append('passport.issueDate', clientData.passport.issueDate);
      formData.append('passport.expiryDate', clientData.passport.expiryDate);
    }

    // Append the image file if it exists
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.put<ClientResponse>(`${this.CLIENT_REST_API_URL}/${clientData.id}`, formData);
  }


}
