import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OneColumnLayoutComponent } from '../../@theme/layouts';
import { GlobalService } from '../../Service/global.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private OneColumnLayout: OneColumnLayoutComponent,
    private spinner: NgxSpinnerService
  ) { }


  checkValidation: boolean = false;

  MobileNo: any;
  City: any;
  DOB: any;
  RePassword: any;
  Password: any;
  UserName: any;
  Email: any;
  Name: any;


  ngOnInit(): void {
    if (this.OneColumnLayout) {
      this.OneColumnLayout.headerDisplayFlag = false;
    }

    // if (this.service) {
    //   let GetLoginFlag = this.service.GetSessionStorage("LoginFlg");
    //   if (!!GetLoginFlag) {
    //     if (GetLoginFlag == true) {
    //       this.router.navigate(['master/dashboard']);
    //     }
    //   }
    // }

    this.service.validation();
  }


  async SaveData() {

    if (this.Password != this.RePassword) {
      this.service.AlertSuccess('info', 'Password  Not Match..!');
      return;
    }

    let obj1 = {
      required: [
        { FieldValue: this.Name, FieldTitle: "Name" },
        { FieldValue: this.Email, FieldTitle: "Email" },
        { FieldValue: this.UserName, FieldTitle: "UserName" },
        { FieldValue: this.Password, FieldTitle: "Password" },
        { FieldValue: this.RePassword, FieldTitle: "RePassword" },
        { FieldValue: this.DOB, FieldTitle: "DOB" },
        { FieldValue: this.City, FieldTitle: "City" },
        { FieldValue: this.MobileNo, FieldTitle: "Mobile No" }
      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

    this.spinner.show();

    let GetValidUserNameCheck = this.ValidUserNameCheck();
    if(!GetValidUserNameCheck)
    {
      return
    }
    let GetRefId = this.route.snapshot.paramMap.get("RefId")

    if (GetRefId != null && GetRefId != "" && GetRefId != undefined) {
      GetRefId = GetRefId
    } else {
      GetRefId = null;
    }


    let GetVal = [];
    let obj = {
      RefId: GetRefId,
      Name: this.Name,
      City: this.City,
      DOB: this.DOB,
      MobileNo: this.MobileNo,
      EmailId: this.Email,
      EntUser: this.UserName,
      UserName: this.UserName,
      Password: this.Password
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('AddUser', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        this.ClearData();
        //     this.OneColumnLayout.headerDisplayFlag = true;
        this.router.navigate(['Master/login']);
        this.spinner.hide();
      }
      else {
        this.service.AlertSuccess('error', res.mesg);
        this.spinner.hide();
      }
    }
  }

  async ValidUserNameCheck(): Promise<boolean> {


    let GetVal = [];
    let obj = {
      p_UserName: this.UserName,
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('ValidUserNameCheck', 'Post', GetVal);
    console.log('res', res);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        return true;
      }
      else {
        this.service.AlertSuccess('info', res.mesg);
        this.spinner.hide();
        return false;
      }
    }
  }

  LoginPage() {
    this.router.navigate(['Master/login']);
  }

  ClearData() {
    this.MobileNo = "";
    this.City = "";
    this.DOB = "";
    this.RePassword = "";
    this.Password = "";
    this.UserName = "";
    this.Email = "";
    this.Name = "";

  }

}
