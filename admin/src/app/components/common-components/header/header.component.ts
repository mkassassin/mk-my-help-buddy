import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './../../../services/login-management/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   UserId: any;
   UserType: any;

   constructor(public router: Router, private Service: LoginService) {
      //  Get Users List
      this.UserId = this.Service.LoginUser_Info()._id;
      this.UserType = this.Service.LoginUser_Info().User_Type;
   }

   ngOnInit() {
   }

   LogOut() {
      localStorage.clear();
      this.router.navigate(['/Login']);
   }

}
