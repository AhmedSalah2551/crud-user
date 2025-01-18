import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { userStatus } from '../context/dtos';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userData = new BehaviorSubject({})
  constructor(private http:HttpClient) { }
  getUsers(model:any){
    let params = new HttpParams()
    if(model){
      Object.entries(model).forEach(([key, value]:any)=>{
        if(value){
          params = params.append(key, value);
        }
      })
    }
    return this.http.get(environment.baseApi.replace("tasks","auth") + "users", {params})
  }
  getAllUsers(model?:any){
    this.getUsers(model).subscribe((res:any)=>{
      this.userData.next({
        total : res.totalItems,
        data : res.users,
        loading : true
      })
    })
  }

  deleteUsers(id:any){
    return this.http.delete(environment.baseApi.replace("tasks","auth") + "user/"+ id)
  }
  changeStatus(model:userStatus){
    return this.http.put(environment.baseApi.replace("tasks","auth") + "user-status", model)
  }
}
