import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { ToasterService } from './services/common-services/toaster/toaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  UserLoggedIn: boolean;

  ToasterList: any[] = [];
  HiddenToasterCount = 0;

   constructor(private router: Router, public Toaster: ToasterService) {
      // Find Page Url
      router.events.subscribe(event => {
         if (event instanceof NavigationEnd ) {
            if (event.url === '/Login' || event.url === '/' ) {
               this.UserLoggedIn = false;
            } else {
               this.UserLoggedIn = true;
            }
         }
      });
      // Toaster Message
      this.Toaster.WaitingToaster.subscribe(Message => {
         setTimeout(() => {
            this.ToasterList.push(Message);
            this.RefreshToasterPosition();
            setTimeout(() => {
               this.ToasterList.splice(0, 1);
               this.RefreshToasterPosition();
            }, 4000);
         }, 100);
      });
   }

   HideToaster(index: any) {
      this.ToasterList[index].Type = 'Hidden';
      this.RefreshToasterPosition();
   }

   RefreshToasterPosition() {
      let Count = 0;
      this.ToasterList.map(toaster => {
         if (toaster.Type !== 'Hidden') {
            toaster.Top = Count * 80 + 10 ; Count = Count + 1;
         }
      });
   }
}
