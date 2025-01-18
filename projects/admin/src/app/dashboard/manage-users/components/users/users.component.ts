import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  displayedColumns: string[] = ['position', 'name', 'email' ,'tasksAssigned', 'actions'];
  dataSource:any;
  loading = false;
  page:any=1;
  filteration:any={
    limit:8,
    page:this.page,
  }
  totalItems:any;
  timeOut:any
  language:any
  theme:boolean=false
  constructor(private services:UsersService,
              private toaster:ToastrService,
              private spinner:NgxSpinnerService,
              private translate:TranslateService) {
                this.getDataFromSubject();
                this.language = localStorage.getItem("language");
                if("language" in localStorage){
                  translate.use(this.language);
                }
              }

  ngOnInit(): void {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.theme = JSON.parse(savedDarkMode);
    }
    this.loading = false;
    this.getUser();
  }
  getUser(){
    this.loading = false;
    this.dataSource=[]
    this.services.getAllUsers(this.filteration);
  }
  getDataFromSubject(){
    this.loading = false;
    this.dataSource = [];
    this.services.userData.subscribe((res:any)=>{
      this.dataSource = res.data;
      this.totalItems = res.total;
      this.loading = res.loading;
    })
  }
  filter(name:any){
    this.page=1;
    this.filteration["page"]=1;
    clearTimeout;
    this.filteration["name"]=name.value;
    this.timeOut =setTimeout(() => {
      this.getUser();
    }, 2000);

  }
  deleteUser(id:string,index:number){
    this.spinner.show()
    if(this.dataSource[index].assignedTasks > 0){
      this.toaster.error("you can't delete this user","user has tasks")
      this.spinner.hide()
    }else{
      this.services.deleteUsers(id).subscribe(res=>{
        this.toaster.success("User Deleted Successfuly","Success");
        this.getUser();
        this.spinner.hide()
      })
    }
  }
  changeStatus(status:string,id:string,index:number){
    this.spinner.show();
    const model={
      id:id,
      status:status
    }
    if(this.dataSource[index].assignedTasks > 0){
      this.toaster.error("you can't delete this user","user has tasks")
      this.spinner.hide();
    }else{
      this.services.changeStatus(model).subscribe(res=>{
        this.getUser();
        this.spinner.hide();
        this.toaster.success("User Status Changed Successfuly","Success");
      })
    }
  }
  pageChange(event:any){
    this.dataSource=[]
    this.page = event;
    this.filteration["page"]=event;
    this.getUser()
  }
}
