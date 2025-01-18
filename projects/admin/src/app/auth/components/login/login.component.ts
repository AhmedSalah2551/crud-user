import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm !:FormGroup;
  language:any;
  constructor(private fb:FormBuilder,
              private services:LoginService,
              private toaster:ToastrService,
              private router:Router,
              private spinner: NgxSpinnerService,
              private translate : TranslateService
            ) {
                this.language = localStorage.getItem("language");
                if("language" in localStorage){
                  translate.use(this.language);
                }else{
                  localStorage.setItem("language","en");
                  this.language = localStorage.getItem("language");
                  translate.use(this.language);
                }
              }

  ngOnInit(): void {
    this.createLog();
  }
  createLog(){
    this.loginForm =this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
      role:['admin']
    })
  }

  login(){
    this.spinner.show();
    this.services.login(this.loginForm.value).subscribe((res:any)=>{
      localStorage.setItem("token",res.token);
      this.toaster.success("Success Login");
      this.router.navigate(['/tasks']);
      this.spinner.hide();
    },error=>{
      this.spinner.hide();
    })
  }
}
