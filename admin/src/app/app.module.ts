// Default Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AuthGuard } from './Authentication/auth.guard';
import { NotAuthGuard } from './Authentication/not-auth.guard';

// Feature Modules
import { ModalModule, AccordionModule} from 'ngx-bootstrap';
import {CalendarModule} from 'primeng/calendar';
import {MatButtonModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatMenuModule} from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';

// Components
import { HeaderComponent } from './components/common-components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { CategoriesManagementComponent } from './components/settings/categories-management/categories-management.component';
import { SubCategoriesManagementComponent } from './components/settings/sub-categories-management/sub-categories-management.component';

// Models
import { DeleteModelComponent } from './models/common-models/delete-model/delete-model.component';
import { CategoriesModelComponent } from './models/settings-models/categories-model/categories-model.component';
import { SubCategoriesModelComponent } from './models/settings-models/sub-categories-model/sub-categories-model.component';

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      LoginComponent,
      CategoriesManagementComponent,
      SubCategoriesManagementComponent,
      DeleteModelComponent,
      CategoriesModelComponent,
      SubCategoriesModelComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      AppRoutingModule,
      ModalModule.forRoot(),
      AccordionModule.forRoot(),
      MatButtonModule,
      CalendarModule,
      NgSelectModule,
      MatFormFieldModule,
      MatSelectModule,
      MatCheckboxModule,
      MatMenuModule,
      MatRadioModule,
      MatDatepickerModule,
      MatNativeDateModule
   ],
   providers: [],
   entryComponents: [
      DeleteModelComponent,
      CategoriesModelComponent,
      SubCategoriesModelComponent
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
