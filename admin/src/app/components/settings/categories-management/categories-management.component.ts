import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Renderer, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';

import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

import { CategoriesService } from './../../../services/settings-services/categories.service';
import { ToasterService } from './../../../services/common-services/toaster/toaster.service';
import { LoginService } from './../../../services/login-management/login.service';

import { CategoriesModelComponent } from '../../../models/settings-models/categories-model/categories-model.component';
import { DeleteModelComponent } from '../../../models/common-models/delete-model/delete-model.component';
import { FormGroup } from '@angular/forms';

export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: any): string {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
   }
}

@Component({
  selector: 'app-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class CategoriesManagementComponent implements OnInit {

   PageLoader = true;

   @ViewChild('TableHeaderSection', {static: true}) TableHeaderSection: ElementRef;
   @ViewChild('TableBodySection', {static: true}) TableBodySection: ElementRef;
   @ViewChild('TableLoaderSection', {static: true}) TableLoaderSection: ElementRef;


   // Pagination Keys
   CurrentIndex = 1;
   SkipCount = 0;
   SerialNoAddOn = 0;
   LimitCount = 5;
   ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
   PagesArray = [];
   TotalRows = 0;
   LastCreation: Date = new Date();
   PagePrevious: object = { Disabled: true, value : 0, Class: 'PageAction_Disabled'};
   PageNext: object = { Disabled: true, value : 0, Class: 'PageAction_Disabled'};
   SubLoader = false;
   GoToPage = null;

   ListData: any[] = [];

   FilterFGroup: FormGroup;
   FiltersArray: any[] = [ {Active: false, Key: 'Category', Value: '', DisplayName: 'Category', DBName: 'Category', Type: 'String', Option: '' },
                           {Active: false, Key: 'CFromDate', Value: null, DisplayName: 'Created From', DBName: 'createdAt', Type: 'Date', Option: 'GTE' },
                           {Active: false, Key: 'CToDate', Value: null, DisplayName: 'Created To', DBName: 'createdAt', Type: 'Date', Option: 'LTE' },
                           {Active: false, Key: 'UFromDate', Value: null, DisplayName: 'Last Updated From', DBName: 'updatedAt', Type: 'Date', Option: 'GTE' },
                           {Active: false, Key: 'UToDate', Value: null, DisplayName: 'Last Updated From', DBName: 'updatedAt', Type: 'Date', Option: 'LTE' }];
   FilterFGroupStatus = false;
   THeaders: any[] = [ { Key: 'Category', ShortKey: 'CategorySort', Name: 'Category', If_Short: false, Condition: '' },
                        { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date/Time', If_Short: false, Condition: '' },
                        { Key: 'updatedAt', ShortKey: 'updatedAt', Name: 'Last Updated Date/Time', If_Short: false, Condition: '' } ];

   bsModalRef: BsModalRef;

   Loader = true;
   List: any[] = [];
   UserId: any;

   constructor(   private modalService: BsModalService,
                  private Service: CategoriesService,
                  private Toaster: ToasterService,
                  public LService: LoginService
               ) {
                  this.UserId = this.LService.LoginUser_Info()._id;
                  // Get Categories List
                  const Data = {User_Id: this.UserId };
                  let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  InfoData = InfoData.toString();
                  this.Loader = true;
                  this.Service.Category_List({Info: InfoData}).subscribe(response => {
                     const ResponseData = JSON.parse(JSON.stringify(response));
                     this.Loader = false;
                     if (ResponseData.Status ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData.Response, 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.List = DecryptedData;
                     } else if (!ResponseData.Status) {
                        this.Toaster.NewToasterMessage({ Type: 'Error', Message: ResponseData.Message });
                     } else {
                        this.Toaster.NewToasterMessage({ Type: 'Error', Message: 'Category List Getting Error!, But not Identify!' });
                     }
                  });
               }

   ngOnInit() {
   }

   // Create New Category
   CreateCategory() {
      const initialState = { Type: 'Create' };
      this.bsModalRef = this.modalService.show(CategoriesModelComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: '' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         const ResponseData = JSON.parse(JSON.stringify(response));
         if (ResponseData.Status) {
            this.List.splice(0, 0, ResponseData.Response);
         }
      });
   }
   // Edit Category
   EditCategory(index: any) {
      const initialState = { Type: 'Edit', Data: this.List[index] };
      this.bsModalRef = this.modalService.show(CategoriesModelComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: '' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         const ResponseData = JSON.parse(JSON.stringify(response));
         if (ResponseData.Status) {
            this.List[index] = ResponseData.Response;
         }
      });
   }
   // View Category
   ViewCategory(index: any) {
      const initialState = { Type: 'View', Data: this.List[index] };
      this.bsModalRef = this.modalService.show(CategoriesModelComponent, Object.assign({initialState}, { class: '' }));
   }
   // Delete Category
   DeleteCategory(index: any) {
      const initialState = { Text: ' Category ' };
      this.bsModalRef = this.modalService.show(DeleteModelComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            const Data = { Category_Id: this.List[index]._id, Modified_By: this.UserId };
            let InfoData = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            InfoData = InfoData.toString();
            this.Service.Category_Delete({Info: InfoData}).subscribe( returnResponse => {
               const ResponseData = JSON.parse(JSON.stringify(returnResponse));
               if (ResponseData.Status) {
                  this.List.splice(index, 1);
                  this.Toaster.NewToasterMessage( { Type: 'Warning', Message: 'Category Successfully Deleted'} );
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
