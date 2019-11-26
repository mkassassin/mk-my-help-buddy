import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

   constructor() { }

   private ToasterMessage =  new Subject<any>();

   WaitingToaster = this.ToasterMessage.asObservable();

   NewToasterMessage(Message: any) {
      this.ToasterMessage.next(Message);
   }
}
