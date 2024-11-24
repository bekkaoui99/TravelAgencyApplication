import {inject} from '@angular/core';

import {AuthenticationService} from "../authentication.service";
import {CanActivateFn, Router} from "@angular/router";

export const authenticationGuard: CanActivateFn = (route, state) => {

  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  var authenticated = false;
  authenticationService.adminSubject.subscribe({
    next:(data)=>{
      authenticated = data;
    }
  })

  authenticationService.isAuthenticated().subscribe({
    next:(isAuthenticatedValue)=> {
      authenticated = isAuthenticatedValue;
    }
  })

  console.log("guard " +  authenticated)
  if(!authenticated){
    router.navigateByUrl("/auth/login");
  }
  return authenticated;

}
