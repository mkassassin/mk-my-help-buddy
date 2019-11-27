import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';

import { SubCategoriesService } from './../../../services/settings-services/sub-categories.service';
import { ToasterService } from './../../../services/common-services/toaster/toaster.service';
import { LoginService } from './../../../services/login-management/login.service';

import { SubCategoriesModelComponent } from '../../../models/settings-models/sub-categories-model/sub-categories-model.component';
import { DeleteModelComponent } from '../../../models/common-models/delete-model/delete-model.component';


@Component({
  selector: 'app-sub-categories-management',
  templateUrl: './sub-categories-management.component.html',
  styleUrls: ['./sub-categories-management.component.css']
})
export class SubCategoriesManagementComponent implements OnInit {


   bsModalRef: BsModalRef;

   Loader = true;
   List: any[] = [];
   UserId: any;

   constructor(   private modalService: BsModalService,
                  private Service: SubCategoriesService,
                  private Toaster: ToasterService,
                  public LService: LoginService
               ) {
                  this.UserId = this.LService.LoginUser_Info()._id;
                  // Get Sub Categories List
                  const Data = {User_Id: this.UserId };
                  let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  InfoData = InfoData.toString();
                  this.Loader = true;
                  this.Service.SubCategory_List({Info: InfoData}).subscribe(response => {
                     const ResponseData = JSON.parse(JSON.stringify(response));
                     this.Loader = false;
                     if (ResponseData.Status ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData.Response, 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.List = DecryptedData;
                     } else if (!ResponseData.Status) {
                        this.Toaster.NewToasterMessage({ Type: 'Error', Message: ResponseData.Message });
                     } else {
                        this.Toaster.NewToasterMessage({ Type: 'Error', Message: 'Sub Category List Getting Error!, But not Identify!' });
                     }
                  });
               }

   ngOnInit() {
   }

   // Create New Sub Category
   CreateSubCategory() {
      const initialState = { Type: 'Create' };
      this.bsModalRef = this.modalService.show(SubCategoriesModelComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: '' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         const ResponseData = JSON.parse(JSON.stringify(response));
         if (ResponseData.Status) {
            this.List.splice(0, 0, ResponseData.Response);
         }
      });
   }
   // Edit Sub Category
   EditSubCategory(index: any) {
      const initialState = { Type: 'Edit', Data: this.List[index] };
      this.bsModalRef = this.modalService.show(SubCategoriesModelComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: '' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         const ResponseData = JSON.parse(JSON.stringify(response));
         if (ResponseData.Status) {
            this.List[index] = ResponseData.Response;
         }
      });
   }
   // View Sub Category
   ViewSubCategory(index: any) {
      const initialState = { Type: 'View', Data: this.List[index] };
      this.bsModalRef = this.modalService.show(SubCategoriesModelComponent, Object.assign({initialState}, { class: '' }));
   }
   // Delete Sub Category
   DeleteSubCategory(index: any) {
      const initialState = { Text: ' Category ' };
      this.bsModalRef = this.modalService.show(DeleteModelComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            const Data = { Category_Id: this.List[index]._id, Modified_By: this.UserId };
            let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            InfoData = InfoData.toString();
            this.Service.SubCategory_Delete({Info: InfoData}).subscribe( returnResponse => {
               const ResponseData = JSON.parse(JSON.stringify(returnResponse));
               if (ResponseData.Status) {
                  this.List.splice(index, 1);
                  this.Toaster.NewToasterMessage( { Type: 'Warning', Message: 'Sub Category Successfully Deleted'} );
               } else if (!ResponseData.Status) {
                  this.Toaster.NewToasterMessage( { Type: 'Error', Message: ResponseData.Message } );
               } else {
                  this.Toaster.NewToasterMessage( { Type: 'Error', Message: 'Some Error Occurred!, But not Identify!' } );
               }
            });
         }
      });
   }

}
