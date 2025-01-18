import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  language:any;
  loginForm!:FormGroup;
  constructor(private services:LoginService,
              private fb:FormBuilder,
              private translate:TranslateService,
              private toaster:ToastrService,
              private router:Router,
              private spinner:NgxSpinnerService) {
                this.language = localStorage.getItem("language");
                    if("language" in localStorage){
                      translate.use(this.language);
                    }
              }

  ngOnInit(): void {
    this.createLoginForm()
  }
  createLoginForm(){
    this.loginForm = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',Validators.required],
      role:['user'],
    })
  }
  login(){
    this.spinner.show()
    this.services.userLogin(this.loginForm.value).subscribe((res:any)=>{
      localStorage.setItem("token",res.token)
      this.toaster.success("Login Successfuly", "succes");
      this.router.navigate(["/tasks"]);
      this.spinner.hide();
    },Error=>{
      this.spinner.hide();
    })
  }
}
