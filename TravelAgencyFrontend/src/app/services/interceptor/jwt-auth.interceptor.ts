import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {TokenService} from "../token.service";
import {AuthenticationService} from "../authentication.service";
import {LoginResponse} from "../../authentication/types/Login-response";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  #tokenService = inject(TokenService);
  #authService = inject(AuthenticationService);
  #router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // exclude /auth endpoint
    if (!request.url.includes('/login') &&
      !request.url.includes('/refresh-token')
    ) {
      let token = this.#tokenService.getToken();
      let refreshToken = this.#tokenService.getRefreshToken();
      // check if the token is expired
      if (this.#authService.isTokenExpired(token as string)) {
        // check if the refresh token is expired
        if(this.#authService.isTokenExpired(refreshToken as string)){
          // alert user and log him out
          alert("Your session has expired. Please log in again.")
          this.#authService.logout()
          return next.handle(request)
        }
        else {
          // if the token and refresh token is good
          return this.#authService.refreshToken().pipe(
            switchMap((response: LoginResponse) => {
              this.#tokenService.saveToken(response.accessToken, response.refreshToken);
              const newRequest = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + response.accessToken),
              });
              return next.handle(newRequest);
            }),
            catchError((error: HttpErrorResponse) => {
              console.log("Error while asking for new token");
              alert("Your session has expired. Please log in again.")
              this.#authService.logout()
              return throwError(() => new Error(error.message));
            })
          );
        }
      }
      else { // if the token not expired
        const newRequest = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + token),
        });
        return next.handle(newRequest);
      }
    } else { // if the request is going to /auth endpoint
      return next.handle(request);
    }
  }
}
