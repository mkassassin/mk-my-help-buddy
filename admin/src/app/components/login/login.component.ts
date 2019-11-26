import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { ToasterService } from './../../services/common-services/toaster/toaster.service';
import { LoginService } from './../../services/login-management/login.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   LoginForm: FormGroup;

   UserRequired = false;
   UserMinLengthErr = false;

   constructor(
      private Toaster: ToasterService,
      private router: Router,
      private service: LoginService
   ) {}

   ngOnInit() {
      this.LoginForm = new FormGroup({
         User_Name: new FormControl('', Validators.required),
         User_Password: new FormControl('', Validators.required),
      });
   }

   submit() {
      if (this.LoginForm.valid) {
         const Data = this.LoginForm.value;
         let ReqInfo = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         ReqInfo = ReqInfo.toString();
         this.service.User_Login_Validate({Info: ReqInfo}).subscribe((response): any => {
            const ReceivingData = JSON.parse(JSON.stringify(response));
            if (ReceivingData.Status) {
               this.router.navigate(['/Categories']);
               this.Toaster.NewToasterMessage({ Type: 'Success', Message: 'You Are Successfully Logged In' });
            } else if (!ReceivingData.Status && ReceivingData.Message) {
               this.Toaster.NewToasterMessage({ Type: 'Error', Message: ReceivingData.Message });
            } else {
               this.Toaster.NewToasterMessage({ Type: 'Error', Message: 'Some Error Occurred!, Error Not Defined.' });               }
         });
      }
   }

}
