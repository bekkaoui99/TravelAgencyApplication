import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() { }

  public setToken(token:string){
    localStorage.setItem("accessToken" , token);
  }

  getToken(): string | null {
    return localStorage.getItem("accessToken") as string;
  }

  public setRefreshToken(refreshToken:string){
    localStorage.setItem("refreshToken" , refreshToken);
  }

  public getRefreshToken():string{
    return localStorage.getItem("refreshToken") as string;
  }

  public saveToken(token:string , refreshToken:string){
    this.setToken(token);
    this.setRefreshToken(refreshToken);
  }

  clearTokens(): void {
    console.log("clearTokens: ")
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
  }

  getUserName(): string | null {
    return localStorage.getItem("userName") as string | null;
  }

  public setUserName(userName:string){
    localStorage.setItem("userName" , userName);
  }

}
