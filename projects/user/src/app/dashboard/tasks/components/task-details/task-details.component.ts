import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  id:any
  data:any
  loading=false
  language:any
  constructor(private services:TasksService,
              private router:Router,
              private spinner:NgxSpinnerService,
              private toaster:ToastrService,
              private translate : TranslateService,
              private route:ActivatedRoute) {
                route.paramMap.subscribe((res:any)=>{
                  this.id=res.params["id"];
                });
                this.language = localStorage.getItem("language");
                    if("language" in localStorage){
                      translate.use(this.language);
                    }
              }
  ngOnInit(): void {
    this.getDetails()
  }
  getDetails(){
    this.services.getTaskDetails(this.id).subscribe((res:any)=>{
      this.loading=true
      this.data=res.tasks;
    })
  }
  changeStatus(){
    this.spinner.show();
    let model ={
      id:this.data._id,
    }
    this.services.changeStatus(model).subscribe(res=>{
      this.router.navigate(["/tasks"])
      this.spinner.hide();
      this.toaster.success("status changed successfuly","success");
    })
  }
}
