import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerInterceptor } from './interceptor/spinner.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { AuthInterceptor } from './interceptor/auth.interceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    {
      provide:HTTP_INTERCEPTORS,
      multi:true,
      useClass:SpinnerInterceptor
    },
    {
      provide:HTTP_INTERCEPTORS,
      multi:true,
      useClass:ErrorInterceptor
    },
    {
      provide:HTTP_INTERCEPTORS,
      multi:true,
      useClass:AuthInterceptor
    },
  ]
})
export class CoreModule { }
