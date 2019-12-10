import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from './../../services/login-management/login.service';

const API_URL = 'http://localhost:3000/API/CategoryManagement/';
const Stage_API_URL = 'http://68.183.212.161:3000/API/CategoryManagement/';


const httpOptions = {
   headers: new HttpHeaders({  'Content-Type':  'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

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


   // Category
      public Category_AsyncValidate(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_AsyncValidate', Info).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_Create(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_Create', Info).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_List(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_List', Info).pipe( map(response => response), catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_SimpleList(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_SimpleList', Info ).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_Update(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_Update', Info ).pipe( map(response => response), catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_Delete(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_Delete', Info).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }

}
