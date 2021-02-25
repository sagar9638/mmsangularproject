import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../Service/global.service';
import { OneColumnLayoutComponent } from '../../@theme/layouts';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private router: Router,
    private OneColumnLayout: OneColumnLayoutComponent,
    private spinner: NgxSpinnerService
  ) { }

  checkValidation: boolean = false;
  UserName: any;
  Password: any;

  ngOnInit(): void {
    if (this.OneColumnLayout) {
      this.OneColumnLayout.headerDisplayFlag = false;
    }

    if (this.service) {
      let GetLoginFlag = this.service.GetSessionStorage("LoginFlg");
      if (!!GetLoginFlag) {
        if (GetLoginFlag == "true") {
         // this.router.navigate(['master/dashboard']);--SAG
         this.router.navigate(['master/Home']);
        }
      }
    }
  }

  async Login() {

    let obj1 = {
      required: [
        { FieldValue: this.UserName, FieldTitle: "UserName" },
        { FieldValue: this.Password, FieldTitle: "Password" },
      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

    this.spinner.show();
    let GetVal = [];
    let obj = {
      p_UserName: this.UserName,
      p_Password: this.Password
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('ValidLogin', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        if (res.recordset.length != 0) {
          this.service.SetSessionStorage("UserName", res.recordset[0].UserName);
          this.service.SetSessionStorage("UserId", res.recordset[0].Id);
          this.service.SetSessionStorage("RefId", res.recordset[0].RefId);
          this.service.SetSessionStorage("LoginFlg", true);
          this.ClearData();
          this.OneColumnLayout.headerDisplayFlag = true;
          //this.router.navigate(['master/dashboard']);--SAG
          this.router.navigate(['master/Home']);
          this.spinner.hide();
        } else {
          this.router.navigate(['master/login']);
          this.spinner.hide();
        }

      }
      else {
        this.service.AlertSuccess('error', res.mesg);
        this.ClearData();
        this.spinner.hide();
      }
    }
  }

  RagisterPage() {
    this.router.navigate(['master/Register']);
  }

  ClearData() {
    this.UserName = "";
    this.Password = "";
  }


}
