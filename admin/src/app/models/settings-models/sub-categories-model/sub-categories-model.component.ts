import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { CategoriesService } from './../../../services/settings-services/categories.service';
import { SubCategoriesService } from './../../../services/settings-services/sub-categories.service';
import { ToasterService } from './../../../services/common-services/toaster/toaster.service';
import { LoginService } from './../../../services/login-management/login.service';

@Component({
  selector: 'app-sub-categories-model',
  templateUrl: './sub-categories-model.component.html',
  styleUrls: ['./sub-categories-model.component.css']
})
export class SubCategoriesModelComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data: any;

   Uploading = false;
   Form: FormGroup;
   UserId: any;
   Categories: any[] = [];

   constructor( public bsModalRef: BsModalRef,
                public Service: SubCategoriesService,
                public CategoryService: CategoriesService,
                private Toaster: ToasterService,
                public LService: LoginService
            ) {
               this.UserId = this.LService.LoginUser_Info()._id;
            }

   ngOnInit() {
      this.onClose = new Subject();
      // If Create New Sub Category
      if (this.Type === 'Create') {
         this.Form = new FormGroup({
            SubCategory: new FormControl( '', {  validators: Validators.required, asyncValidators: [this.SubCategory_AsyncValidate.bind(this)], updateOn: 'change' } ),
            Category: new FormControl( null, Validators.required ),
            Created_By: new FormControl( this.UserId, Validators.required ),
         });
      }
      // If Edit New Category
      if (this.Type === 'Edit') {
         this.Form = new FormGroup({
            SubCategory: new FormControl(this.Data.SubCategory, { validators: Validators.required, asyncValidators: [this.SubCategory_AsyncValidate.bind(this)], updateOn: 'change' }),
            Category: new FormControl( null, Validators.required ),
            SubCategory_Id: new FormControl(this.Data._id, Validators.required),
            Modified_By: new FormControl(this.UserId, Validators.required)
         });
      }

      const Data = { User_Id: this.UserId  };
      let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      InfoData = InfoData.toString();
      this.CategoryService.Category_SimpleList({Info: InfoData}).subscribe( response => {
         const ReceivingData = JSON.parse(JSON.stringify(response));
         if (ReceivingData.Status) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData.Response, 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this.Categories = DecryptedData;
            this.updateCategories();
         }
      });
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

   updateCategories() {
      if (this.Type === 'Edit') {
         const Courses = this.Data.Category.map(obj => obj._id);
         this.Form.controls.Category.setValue(Courses);
         this.Form.controls.Category.disable();

      }
   }

   SubCategory_AsyncValidate( control: AbstractControl ) {
      const Data = { SubCategory: control.value, User_Id: this.UserId  };
      let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      InfoData = InfoData.toString();
      return this.Service.SubCategory_AsyncValidate({Info: InfoData}).pipe(map( response => {
         if (this.Type === 'Edit' && this.Data.SubCategory === control.value) {
            return null;
         } else {
            const ReceivingData = JSON.parse(JSON.stringify(response));
            if (ReceivingData.Status && ReceivingData.Available) {
               return null;
            } else {
               return { SubCategory_NotAvailable: true};
            }
         }
      }));
   }

   // Submit New Sub Category
   submit() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.value;
         let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         InfoData = InfoData.toString();
         this.Service.SubCategory_Create({Info: InfoData}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(JSON.stringify(response));
            if (ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData.Response, 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toaster.NewToasterMessage( { Type: 'Success', Message: 'New Sub Category Successfully Created' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (!ReceivingData.Status) {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: ReceivingData.Message } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Sub Category!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

   // Update Sub Category
   update() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.value;
         let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         InfoData = InfoData.toString();
         this.Service.SubCategory_Update({Info: InfoData}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(JSON.stringify(response));
            if (ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData.Response, 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toaster.NewToasterMessage( { Type: 'Success', Message: 'Sub Category Successfully Updated' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (!ReceivingData.Status) {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: ReceivingData.Message } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toaster.NewToasterMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating Sub Category!' } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            }
         });
      }
   }


}
