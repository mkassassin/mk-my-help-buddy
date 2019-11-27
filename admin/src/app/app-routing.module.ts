import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Authentication/auth.guard';
import { NotAuthGuard } from './Authentication/not-auth.guard';

import { LoginComponent } from './components/login/login.component';
import { CategoriesManagementComponent } from './components/settings/categories-management/categories-management.component';
import { SubCategoriesManagementComponent } from './components/settings/sub-categories-management/sub-categories-management.component';

const routes: Routes = [
   {
      path: '',
      component: LoginComponent,
      canActivate: [NotAuthGuard],
      data: {}
   },
   // Login
   {
      path: 'Login',
      component: LoginComponent,
      canActivate: [NotAuthGuard],
      data: {}
   },
   // Categories
   {
      path: 'Categories',
      component: CategoriesManagementComponent,
      canActivate: [AuthGuard],
      data: {}
   },
   // SubCategories
   {
      path: 'SubCategories',
      component: SubCategoriesManagementComponent,
      canActivate: [AuthGuard],
      data: {}
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
