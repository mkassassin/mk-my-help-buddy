import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './../services/login-management/login.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {

   constructor( private router: Router, private Service: LoginService) {

   }

   canActivate(): boolean {
      if (this.Service.If_LoggedIn()) {
         this.router.navigate(['/Categories']);
         return false;
       } else {
         return true;
       }
   }

}
