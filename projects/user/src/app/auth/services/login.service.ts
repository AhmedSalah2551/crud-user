import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { login, register } from '../components/context/dtos';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }
  userLogin(model:login){
    return this.http.post(environment.baseApi.replace("tasks","auth") +'login', model )
  }
  createUser(model:register){
    return this.http.post(environment.baseApi.replace("tasks","auth") +'createAccount', model )
  }
}
