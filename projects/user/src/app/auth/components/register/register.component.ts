import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { register } from '../context/dtos';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!:FormGroup;
  language:any;
  constructor(private services:LoginService,
              private fb:FormBuilder,
              private toaster:ToastrService,
              private translate:TranslateService,
              private router:Router,
              private spinner:NgxSpinnerService) {
                this.language = localStorage.getItem("language");
                    if("language" in localStorage){
                      translate.use(this.language);
                    }
              }

  ngOnInit(): void {
    this.createUser()
  }
  createUser(){
    this.registerForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required],
      confirmPass:['',Validators.required],
      username:['',Validators.required],
      role:['user']
    },{validators: this.checkPass})
  }
  checkPass:ValidatorFn = (group:AbstractControl): ValidationErrors | null=>{
    let pass = group.get("password")?.value;
    let confirmPass = group.get("confirmPass")?.value;
    return pass === confirmPass? null : {notmatched : true};
  }
  register(){
    this.spinner.show();
    const model:register = {
      email:this.registerForm.get('email')?.value,
      password:this.registerForm.get('password')?.value,
      username:this.registerForm.get('username')?.value,
      role:this.registerForm.get('role')?.value,
    }
    this.services.createUser(model).subscribe(res=>{
        this.toaster.success("Register Successfuly", "succes");
        this.router.navigate(["/auth/login"]);
        this.spinner.hide();
    },Error=>{
      this.spinner.hide();
    })
  }

}
