import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from './../../services/login-management/login.service';

const API_URL = 'http://localhost:3000/API/SubCategoryManagement/';

const httpOptions = {
   headers: new HttpHeaders({  'Content-Type':  'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService {


constructor(private http: HttpClient, public Service: LoginService) { }


   ValidateEveryRequest() {
      let Message = JSON.stringify({Status: false, Message: 'Your Login Expired! Please Login Again'});
      if (sessionStorage.getItem('Token') && sessionStorage.getItem('SessionKey') && sessionStorage.getItem('SessionToken') ) {
         const LastSession = new Date(atob(sessionStorage.getItem('SessionKey'))).getTime();
         const NowSession = new Date().getTime();
         const SessionDiff: number = NowSession - LastSession;
         const SessionDiffMinutes: number = SessionDiff / 1000 / 60 ;
         if (SessionDiffMinutes >= 20 ) {
            Message = JSON.stringify({Status: false, Message: 'Your Session Expired! Please Login Again'});
            sessionStorage.clear();
         }
      }
      return Observable.create(observer => {
         const Response = {status: 401, _body: Message };
         observer.next(Response);
         observer.complete();
      });
   }


   // Sub Category
      public SubCategory_AsyncValidate(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'SubCategory_AsyncValidate', Info).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public SubCategory_Create(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'SubCategory_Create', Info).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public SubCategory_List(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'SubCategory_List', Info).pipe( map(response => response), catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public SubCategory_SimpleList(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'SubCategory_SimpleList', Info ).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public SubCategory_Update(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'SubCategory_Update', Info ).pipe( map(response => response), catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public SubCategory_Delete(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'SubCategory_Delete', Info).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }

}
