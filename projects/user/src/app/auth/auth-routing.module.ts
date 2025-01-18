import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginGuard } from '../core/guards/login.guard';

const routes: Routes = [
  {
    path:'login',
    canActivate:[LoginGuard],
    component:LoginComponent,
  },
  {
    path:'register',
    canActivate:[LoginGuard],
    component:RegisterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
