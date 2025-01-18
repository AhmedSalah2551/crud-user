import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogModel } from '../context/log-model';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  login(model:LogModel){
    return this.http.post(environment.baseApi.replace("tasks","auth") +"login",model)
  }

}
