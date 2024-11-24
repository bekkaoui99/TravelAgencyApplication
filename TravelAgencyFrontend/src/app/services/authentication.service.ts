import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {BehaviorSubject, Observable, of, switchMap, throwError} from "rxjs";
import {jwtDecode} from "jwt-decode";
import { environment } from "src/environments/environment.development";
import { Router } from "@angular/router";
import { TokenService } from "./token.service";
import { LoginResponse } from "../authentication/types/Login-response";
import { JwtCustomPayload } from "../authentication/types/JwtCustomPayload";
import { LoginRequest } from "../authentication/types/Login-request";
import { RegistrationRequest } from "../authentication/types/registration-request";
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: "root",
})
export class AuthenticationService {

  private readonly REST_API_AUTH_URL = environment.REST_API_AUTH_URL;

  public authenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public adminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public roleSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");

  public role: string | undefined | null = null;
  public userName: string | undefined | null = null;
  constructor(
      private http: HttpClient,
      private router: Router,
      private tokenService: TokenService
  ) {}

  public login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.REST_API_AUTH_URL}/login`, loginRequest);
  }

  public logout(): void {
    this.authenticatedSubject.next(false);
    if (this.roleSubject.getValue() === "ADMIN") {
      this.adminSubject.next(false);
      this.router.navigateByUrl('/');
    }
    this.tokenService.clearTokens();
    this.roleSubject.next("");
  }

  public refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${refreshToken}` });
    return this.http.post<LoginResponse>(`${this.REST_API_AUTH_URL}/refreshToken`, {}, { headers });
  }

  public clientRegistration(registrationRequest: RegistrationRequest): Observable<RegistrationRequest> {
    return this.http.post<RegistrationRequest>(`${this.REST_API_AUTH_URL}/clientRegistration`, registrationRequest);
  }


  isTokenExpired(token: string | null | undefined): boolean {
    if (typeof token !== 'string') {
      console.error("Invalid token specified: must be a string");
      return true;
    }
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (!exp) {
        return true;
      }
      const currentTime = Math.floor(new Date().getTime() / 1000);
      if (exp < currentTime)
        console.log("token expired")
      return exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }

  accessTokenAvailable(token: string): void {
    this.role = this.getUserRole(token);
    this.userName = this.getUsername(token);
    if (this.role === "ADMIN" || this.role === "CLIENT") {
      this.authenticatedSubject.next(true);
    }
    if (this.role === "ADMIN") {
      this.adminSubject.next(true);
    }
    this.roleSubject.next(this.role??'');
  }



  isAuthenticated(): Observable<boolean> {
    console.log("call isAuthenticated");

    const token = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();
    const tokenExpired = this.isTokenExpired(token);
    const refreshTokenExpired = this.isTokenExpired(refreshToken);

    if (tokenExpired) {
      if (!refreshTokenExpired) {
        console.log("Token expired, but refresh token is valid. Getting a new access token.");

        return this.refreshToken().pipe(
          switchMap((refreshTokenResponse) => {
            this.tokenService.saveToken(refreshTokenResponse.accessToken, refreshTokenResponse.refreshToken);
            const userName = refreshTokenResponse.userName;
            if(userName != null){
              this.tokenService.setUserName(userName);
            }
            console.log("Re-run authentication check after refreshing the token");

            // Re-run authentication check after refreshing the token
            return this.isAuthenticated();  // Ensure to return the final authentication state
          }),
          catchError((err) => {
            console.error("Error refreshing token:", err);
            return of(false);  // If refresh fails, return false
          })
        );
      } else {
        // Both tokens are expired, log out or redirect to log in
        console.log("Both access and refresh tokens are expired.");
        return of(false);
      }
    } else {
      console.log("Access token is valid.");

      if (token != null) {
        const userRole = this.getUserRole(token);
        if (userRole === "ADMIN") {
          return of(true);
        }
      } else {
        console.log("Access token is null.");
      }

      return of(false);
    }
  }



  public loadingData(loginResponse: LoginResponse): void {
    this.tokenService.saveToken(loginResponse.accessToken, loginResponse.refreshToken);
    this.userName = loginResponse.userName;
    this.role = this.getUserRole(loginResponse.accessToken);
    if(this.userName != null){
      this.tokenService.setUserName(this.userName);
    }
    if (this.role === "ADMIN" || this.role === "CLIENT") {
      console.log("admin and client section")
      this.authenticatedSubject.next(true);
    }
    if (this.role === "ADMIN") {
      console.log("admin section")
      this.adminSubject.next(true);
    }
    if (this.role != null) {
      this.roleSubject.next(this.role);
    }
  }

  public getUsername(accessToken: string): string | undefined | null {
    const decoded = jwtDecode<JwtCustomPayload>(accessToken);
    return decoded ? decoded.userName : null;
  }

  getUserRole(accessToken: string): string | undefined | null {
    const decoded = jwtDecode<JwtCustomPayload>(accessToken);
    return decoded ? decoded.role : null;
  }

}
