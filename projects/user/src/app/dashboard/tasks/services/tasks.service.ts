import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { status } from '../context/dtos';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http:HttpClient) { }
  getTasks(id:string, model:any){
    let params = new HttpParams();
    Object.entries(model).forEach(([key,value]:any)=>{
      params = params.append(key, value);
    })
    return this.http.get(environment.baseApi+ 'user-tasks/'+id, {params})
  }

  changeStatus(model:object){
    return this.http.put(environment.baseApi + "complete", model)
  }

  getTaskDetails(id:any){
    return this.http.get(environment.baseApi+"task/"+id)
  }

}
