import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { UsersService } from '../../../manage-users/services/users.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'user' ,'deadLineDate','status', 'actions'];
  dataSource : any;
  tasksFilter !: FormGroup
  page:any=1;
  filteration:any={
    page:this.page,
    limit:10
  };
  loading = false;
  timeOut:any;
  fromDate:string="fromDate";
  toDate:string="toDate";
  totalItems:any;
  users:any = []
  language:any;
  theme:boolean = false;
  status:any = [
    {name:""},
    {name:"Complete"},
    {name:"In-Progress"},
  ];
  constructor(
              private services:TasksService,
              public MatDialog:MatDialog,
              private userService : UsersService,
              private translate:TranslateService) {
                this.getDataFromSubject();
                this.language = localStorage.getItem("language");
                if("language" in localStorage){
                  translate.use(this.language);
                }
              }

  ngOnInit(): void {
    this.loading=false;
    this.getAllTasks();
    this.getUsers();
  }
  getUsers(){
    this.userService.getAllUsers();
  }
  getDataFromSubject(){
    this.userService.userData.subscribe((res:any)=>{
      this.users = this.userMaping(res.data);
      this.loading=true
    })
  }
  userMaping(data:any[]){
    let newData = data?.map(item=>{
      return{
        name:item.username,
        id:item._id
      }
    })
    return newData;
  }
  filter(event:any, type:any){
    this.page=1;
    this.filteration['page']=1;
    switch (type) {
      case "keyword":
      this.filteration["keyword"]=event.value;
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.getAllTasks();
        }, 2000);
        break;
      case "userId":
        this.filteration["userId"]=event.value;
        this.getAllTasks()
        break;
      case "status":
        this.filteration["status"]=event.value.trim();
        this.getAllTasks()
        break;
      default:
        this.filteration[type]=moment(event.value).format("DD-MM-YYYY");
        if(type =='toDate' && this.filteration['toDate'] !== 'Invalid date'){
          this.getAllTasks();
        }
        break;
    }
  }
  getAllTasks() {
    this.loading =false;
    this.dataSource=[];
    this.services.getTasks(this.filteration).subscribe((res:any)=>{
      this.loading = true;
      this.totalItems = res.totalItems;
      this.tasksInfo(res.tasks);
      this.dataSource = this.tasksInfo(res.tasks);
    })
  }
  tasksInfo(data:any[]){
    let tasks = data.map((item) =>
    {
        return{
          ...item,
          username:item.userId.username,
          userId:item.userId._id,
          ID:item._id
        }
      }
    )
    return tasks;
  }
  addTask(){
    const dialogRef = this.MatDialog.open(AddTaskComponent, {
      width : '650px',
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      if(res == true){
        this.getAllTasks()
      }
    })
  }
  deleteTask(id:any){
    this.services.deleteTasks(id).subscribe(_res=>{
      this.getAllTasks();
    })
  }
  updateTask(element:any){
    const dialogRef = this.MatDialog.open(AddTaskComponent, {
      width : '650px',
      data:element
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res == true){
        this.getAllTasks()
      }
    })
  }
  pageChange(event:any){
    this.page=event;
    this.filteration['page']=event;
    this.getAllTasks();
  }
}
