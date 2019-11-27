import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { CategoriesService } from './../../../services/settings-services/categories.service';
import { ToasterService } from './../../../services/common-services/toaster/toaster.service';
import { LoginService } from './../../../services/login-management/login.service';


@Component({
  selector: 'app-categories-model',
  templateUrl: './categories-model.component.html',
  styleUrls: ['./categories-model.component.css']
})
export class CategoriesModelComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data: any;

   Uploading = false;
   Form: FormGroup;
   UserId: any;

   constructor( public bsModalRef: BsModalRef,
                public Service: CategoriesService,
                private Toaster: ToasterService,
                public LService: LoginService
            ) {
               this.UserId = this.LService.LoginUser_Info()._id;
            }

   ngOnInit() {
      this.onClose = new Subject();
      // If Create New Category
      if (this.Type === 'Create') {
         this.Form = new FormGroup({
            Category: new FormControl( '', {  validators: Validators.required, asyncValidators: [this.Category_AsyncValidate.bind(this)], updateOn: 'change' } ),
            Created_By: new FormControl( this.UserId, Validators.required ),
         });
      }
      // If Edit New Category
      if (this.Type === 'Edit') {
         this.Form = new FormGroup({
            Category: new FormControl(this.Data.Category, { validators: Validators.required, asyncValidators: [this.Category_AsyncValidate.bind(this)], updateOn: 'change' }),
            Category_Id: new FormControl(this.Data._id, Validators.required),
            Modified_By: new FormControl(this.UserId, Validators.required)
         });
      }
   }
   // onSubmit Function
   onSubmit() {
      if (this.Type === 'Create') {
         this.submit();
      }
      if (this.Type === 'Edit') {
         this.update();
      }
   }

   Category_AsyncValidate( control: AbstractControl ) {
      const Data = { Category: control.value, User_Id: this.UserId  };
      let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      InfoData = InfoData.toString();
      return this.Service.Category_AsyncValidate({Info: InfoData}).pipe(map( response => {
         if (this.Type === 'Edit' && this.Data.Category === control.value) {
            return null;
         } else {
            const ReceivingData = JSON.parse(JSON.stringify(response));
            if (ReceivingData.Status && ReceivingData.Available) {
               return null;
            } else {
               return { Category_NotAvailable: true};
            }
         }
      }));
   }

   // Submit New Category
   submit() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.value;
         let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         InfoData = InfoData.toString();
         this.Service.Category_Create({Info: InfoData}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(JSON.stringify(response));
            if (ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData.Response, 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toaster.NewToasterMessage( { Type: 'Success', Message: 'New category Successfully Created' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (!ReceivingData.Status) {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: ReceivingData.Message } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Category!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

   // Update New Category
   update() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.value;
         let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         InfoData = InfoData.toString();
         this.Service.Category_Update({Info: InfoData}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(JSON.stringify(response));
            if (ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData.Response, 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toaster.NewToasterMessage( { Type: 'Success', Message: 'Category Successfully Updated' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (!ReceivingData.Status) {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: ReceivingData.Message } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating Category!' } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            }
         });
      }
   }



}
