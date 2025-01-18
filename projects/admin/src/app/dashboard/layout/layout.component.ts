import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  language:any
  isSidenavOpen = true;
  newMode:boolean=false;

  status:any;
  constructor(private translate : TranslateService,
              private router:Router,
            private toaster : ToastrService)
              {
                this.language = localStorage.getItem("language");
                if("language" in localStorage){
                  translate.use(this.language);
                }
              }

ngOnInit(): void {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.newMode = JSON.parse(savedDarkMode);
    }
}

toggleDarkMode() {
    this.newMode = !this.newMode;
    localStorage.setItem('darkMode', JSON.stringify(this.newMode));
    console.log(this.newMode);
}
toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
}

changeLang(){
    // if(this.language == "en"){
    //   window.location.reload();
    //   this.language = "ar";
    // }else{
    //   window.location.reload();
    //   this.language = "en";
    // }
    // localStorage.setItem("language",this.language);
  this.toaster.info("The Website Is Under Development");
}

logOut(){
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
}

}
