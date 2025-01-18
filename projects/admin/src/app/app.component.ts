import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  language:any;
  constructor(
    private translate: TranslateService)
  {
    this.language = localStorage.getItem("language");
    if("language" in localStorage){
      translate.use(this.language);
    }else{
      localStorage.setItem("language","en");
      this.language = localStorage.getItem("language");
      translate.use(this.language);
    };
  }
}
