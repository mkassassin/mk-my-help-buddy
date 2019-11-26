import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:3000/API/AdminManagement/';

const httpOptions = {
   headers: new HttpHeaders({  'Content-Type':  'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class LoginService {

   constructor(private http: HttpClient) { }

   public User_Login_Validate(Info: any): Observable<any[]> {
      return this.http.post<any>(API_URL + 'User_Login_Validate', Info, httpOptions).pipe( map(response => {
         if (response.Status) {
            const Security = (response.Response.slice(0, -2)).slice(-32);
            const encData = (response.Response.slice(0, -34));
            const CryptoBytes  = CryptoJS.AES.decrypt(encData, Security.slice(0, 7));
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            localStorage.setItem('Token', btoa(JSON.stringify(DecryptedData)));
            localStorage.setItem('SessionToken', btoa(DecryptedData._id + Security));
            localStorage.setItem('SessionKey', btoa(Date()));
         }
         return response;
      }), catchError(err => of(err)) );
   }


   public If_LoggedIn() {
      if (localStorage.getItem('Token') && localStorage.getItem('SessionKey') && localStorage.getItem('SessionToken') ) {
         const LastSession = new Date(atob(localStorage.getItem('SessionKey'))).getTime();
         const NowSession = new Date().getTime();
         const SessionDiff: number = NowSession - LastSession;
         const SessionDiffMinutes: number = SessionDiff / 1000 / 60 ;
         if (SessionDiffMinutes < 20 ) { return true;
         } else {
            localStorage.clear();
            return false;
         }
      } else { localStorage.clear(); return false;  }
   }


   public LoginUser_Info() {
      return JSON.parse(atob(localStorage.getItem('Token')));
   }


}
