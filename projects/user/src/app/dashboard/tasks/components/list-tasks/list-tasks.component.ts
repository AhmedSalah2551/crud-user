import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'deadLineDate','status', 'actions'];
  dataSource :any;
  tasksFilter!:FormGroup;
  page:any=1;
  totalItems:any;
  userData:any;
  selectedStatus:any='In-Progress';
  loading=false;
  language:any;
  status:any = [
    {name:"Complete" , id:1},
    {name:"In-Progress" , id:2},
  ]
  constructor(public dialog: MatDialog ,
              private fb:FormBuilder,
              private services:TasksService,
              private router:Router,
              private toaster:ToastrService,
              private translate : TranslateService) {
                this.language = localStorage.getItem("language");
                    if("language" in localStorage){
                      translate.use(this.language);
                    }
              }

  ngOnInit(): void {
    this.loading=false;
    this.getUser()
    this.getAllTasks()
    this.createform()
  }

  createform() {
    this.tasksFilter = this.fb.group({
      title:[''],
      userId:[''],
      fromDate:[''],
      toDate:['']
    })
  }
  getUser(){
    let token = JSON.stringify(localStorage.getItem("token"));
    this.userData = JSON.parse(window.atob(token.split(".")[1]));
  }
  pageChange(event:any){
    this.page = event;
  }
  getAllTasks() {
    let params ={
      page:this.page,
      limit:10,
      status:this.selectedStatus
    }
    this.loading=false;
    this.dataSource=[]
    this.services.getTasks(this.userData.userId, params).subscribe((res:any)=>{
      this.dataSource = res.tasks;
      this.totalItems=  res.totalItems;
      this.loading=true
    },error=>{
      this.dataSource=[];
      this.loading=true
    })
  }
  changeStatus(item:any){
      let model ={
        id:item._id,
      }
      this.services.changeStatus(model).subscribe(res=>{
        this.toaster.success("status changed successfuly","success");
        this.getAllTasks();
      })
    }
}
