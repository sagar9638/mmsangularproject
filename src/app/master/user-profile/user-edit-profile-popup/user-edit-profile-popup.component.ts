import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NbDialogRef } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalService } from '../../../Service/global.service';

@Component({
  selector: 'ngx-user-edit-profile-popup',
  templateUrl: './user-edit-profile-popup.component.html',
  styleUrls: ['./user-edit-profile-popup.component.scss']
})
export class UserEditProfilePopupComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<UserEditProfilePopupComponent>,
    private service: GlobalService,
    private spinner: NgxSpinnerService,
    private af: AngularFireStorage
  ) { }

  @Input() UserDetail = [];

  FilePath: any;
  ImageUpload: any;
  fb;
  downloadURL: Observable<string>;

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
    this.service.Authentication();
    if (this.UserDetail.length > 0) {
      this.Name = this.UserDetail[0].Name;
      this.City = this.UserDetail[0].City;
      this.MobileNo = this.UserDetail[0].MobileNo;
      this.Email = this.UserDetail[0].EmailId;
    }
    else {
      this.ref.close();
    }
  }


  async SaveData() {
    if(this.FilePath != undefined)
    {
    let obj1 = {
      required: [
        { FieldValue: this.FilePath, FieldTitle: "Image Upload" },
        { FieldValue: this.Name, FieldTitle: "Name" },
        { FieldValue: this.Email, FieldTitle: "Email" },
        { FieldValue: this.City, FieldTitle: "City" },
        { FieldValue: this.MobileNo, FieldTitle: "Mobile No" }
      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

    this.spinner.show();
    var FileName = Date.now() + this.FilePath.name;
    const file = this.FilePath;
    const filePath = `UserProfile/`+this.UserDetail[0].Id+`/${FileName}`;
    const fileRef = this.af.ref(filePath);
    const task = this.af.upload(`UserProfile/`+this.UserDetail[0].Id+`/${FileName}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          this.downloadURL = await fileRef.getDownloadURL();
          this.downloadURL.subscribe(async url => {
            if (url) {
              this.fb = await url;
              let GetUserName = this.service.GetSessionStorage("UserName");
              if (!!GetUserName) {
                GetUserName = GetUserName.replace(/["']/g, "")
              }
              else {
                GetUserName = null;
              }

              let GetVal = [];
              let obj = {
                p_Id: this.UserDetail[0].Id,
                p_Name: this.Name,
                p_City: this.City,
                p_MobileNo: this.MobileNo,
                p_EmailId: this.Email,
                p_UserProfileUrl: this.fb,
                p_UserProtfilePath: filePath
              }

              for (var i in obj) {
                if (obj[i] === undefined) {
                  obj[i] = null;
                }
              }
              GetVal.push(obj);

              let res = await this.service.GetDataAPIS('UpdateUserDetail', 'Post', GetVal);
              if (res != null && res != undefined && res != "") {
                if (res.flag == true) {
                  this.service.AlertSuccess('success', res.mesg);
                  this.ref.close();
                  this.spinner.hide();
                }
                else {
                  this.service.AlertSuccess('error', res.mesg);
                  this.spinner.hide();
                }
              }
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
    }
    else {

      let obj1 = {
        required: [
          { FieldValue: this.Name, FieldTitle: "Name" },
          { FieldValue: this.Email, FieldTitle: "Email" },
          { FieldValue: this.City, FieldTitle: "City" },
          { FieldValue: this.MobileNo, FieldTitle: "Mobile No" }
        ]
      }
  
      this.checkValidation = await this.service.CheckValidation(obj1);
      if (this.checkValidation == false) {
        return
      }
  
      this.spinner.show();
  
  
      let GetVal = [];
      let obj = {
        p_Id: this.UserDetail[0].Id,
        p_Name: this.Name,
        p_City: this.City,
        p_MobileNo: this.MobileNo,
        p_EmailId: this.Email,
        p_UserProfileUrl: this.UserDetail[0].UserProfileUrl,
        p_UserProtfilePath: this.UserDetail[0].UserProtfilePath
      }
  
      for (var i in obj) {
        if (obj[i] === undefined) {
          obj[i] = null;
        }
      }
      GetVal.push(obj);
  
      let res = await this.service.GetDataAPIS('UpdateUserDetail', 'Post', GetVal);
      if (res != null && res != undefined && res != "") {
        if (res.flag == true) {
          this.service.AlertSuccess('success', res.mesg);
          this.ref.close();
          this.spinner.hide();
        }
        else {
          this.service.AlertSuccess('error', res.mesg);
          this.spinner.hide();
        }
      }
    }

  }


  async SaveData1() {

    let obj1 = {
      required: [
        { FieldValue: this.Name, FieldTitle: "Name" },
        { FieldValue: this.Email, FieldTitle: "Email" },
        { FieldValue: this.City, FieldTitle: "City" },
        { FieldValue: this.MobileNo, FieldTitle: "Mobile No" }
      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

    this.spinner.show();


    let GetVal = [];
    let obj = {
      p_Id: this.UserDetail[0].Id,
      p_Name: this.Name,
      p_City: this.City,
      p_MobileNo: this.MobileNo,
      p_EmailId: this.Email,
      p_UserProfileUrl: null,
      p_UserProtfilePath: null
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('UpdateUserDetail', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        this.ref.close();
        this.spinner.hide();
      }
      else {
        this.service.AlertSuccess('error', res.mesg);
        this.spinner.hide();
      }
    }
  }


  upload($event) {
    if ($event.target.files && $event.target.files.length) {
      this.FilePath = $event.target.files[0];
    }
  }

  Cancle() {
    this.ref.close();
  }

}
