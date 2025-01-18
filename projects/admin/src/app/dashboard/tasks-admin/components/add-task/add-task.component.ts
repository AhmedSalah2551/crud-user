import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { UsersService } from '../../../manage-users/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  form!:FormGroup;
  language:any;
  fileNmae:any;
  newForm:any;
  constructor(
              @Inject(MAT_DIALOG_DATA) public data:any,
              private fb:FormBuilder ,
              public dialog: MatDialogRef<AddTaskComponent> ,
              public matDialog:MatDialog ,
              private services:TasksService,
              private toaster:ToastrService,
              private userService:UsersService,
              private spinner:NgxSpinnerService,
              private translate:TranslateService) {
                this.getDataFromSubject();
                this.language = localStorage.getItem("language");
                if("language" in localStorage){
                  translate.use(this.language);
                }
              }

  users:any = []
  ngOnInit(): void {
    this.createForm();
  }
  createForm(){
    this.form = this.fb.group({
      title:[this.data?.title||'', [Validators.required,Validators.minLength(5)]],
      userId:[this.data?.userId||'',Validators.required],
      image:[this.data?.image||'',Validators.required],
      description:[this.data?.description||'',Validators.required],
      deadline:[this.data?.deadline.split("-").reverse().join("-")||'',Validators.required],
    })
    this.newForm=this.form.value;
  }
  closeDialog(){
    let diff = false;
    Object.keys(this.newForm).forEach(item=>{
      if(this.newForm[item] !== this.form.value[item]){
        diff = true
      }
    })
    if(diff){
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
      });
      dialogRef.afterClosed().subscribe(res=>{
        if(res == true){
        }
      })
    }else{
      this.dialog.close();
    }
  }
  selectImage(event:any){
    this.fileNmae = event.target.value;
    this.form.get('image')?.setValue(event.target.files[0]);
  }
  createFormData(){
    let newdate = moment(this.form.value['deadline']).format('DD-MM-YYYY');
    let taskForm = new FormData();
    Object.entries(this.form.value).forEach(([key ,value] : any) =>{
      if(key=='deadline'){
        taskForm.append(key, newdate);
      }else{
        taskForm.append(key, value)
      }
    })
    return taskForm;
  }
  createTask(){
    this.spinner.show();
    let model =this.createFormData();
    this.services.createTasks(model).subscribe(res=>{
      this.toaster.success("Task Created Successfuly","Success");
      this.dialog.close(true);
      this.spinner.hide();
    })
  }
  updateTask(){
    this.spinner.show();
    let model = this.createFormData();
    this.services.updateTasks(model, this.data.ID).subscribe(res=>{
      this.toaster.success("Task Updated Successfuly","Success");
      this.dialog.close(true);
      this.spinner.hide();
    })
  }
  getDataFromSubject(){
    this.userService.userData.subscribe((res:any)=>{
      this.users = this.userMaping(res.data);
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
}
