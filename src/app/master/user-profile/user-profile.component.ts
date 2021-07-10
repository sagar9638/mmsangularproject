import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { OneColumnLayoutComponent } from '../../@theme/layouts/one-column/one-column.layout';
import { GlobalService } from '../../Service/global.service';
import { LeadUserDetailComponent } from '../lead-user-detail/lead-user-detail.component';
import { UserEditProfilePopupComponent } from './user-edit-profile-popup/user-edit-profile-popup.component';

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
    private OneColumnLayout: OneColumnLayoutComponent,
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  UserUrl: any;
  NextPosition: any = "MANAGER";
  NeedSell: any = "";

  ArrayUserProfileData: any = [];
  UserName: any;
  DName: any;
  MailId: any;
  MobileNo: any;
  City: any;
  UrlDisplayFlag: boolean;
  UserProfileUrl: any;
  PUserName: any;
  PDName: any;
  PMailId: any;
  PMobileNo: any;
  PCity: any;
  PUserProfileUrl: any;

  NDesignationName: any;
  CDesignationName: any;
  PDesignationName: any;

  async ngOnInit(): Promise<void> {
    this.service.Authentication();
    this.openNewWindow(false);
    this.spinner.show();
    await this.GetUserProfileData();
    await this.GetUserDesignationData();
    this.spinner.hide();
  }

  async GetUserProfileData() {
    if (this.service) {
      let GetLoginRefId = this.service.GetSessionStorage("RefId");
      if (GetLoginRefId != null && GetLoginRefId != "" && GetLoginRefId != undefined) {
        let GetLoginUserId = this.service.GetSessionStorage("UserId").replace(/["']/g, "");
        let GetVal = [];
        let obj = {
          p_Condition: " AND Id = " + GetLoginUserId
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('GetUserProfileData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.length != 0) {
            this.ArrayUserProfileData = [];
            this.ArrayUserProfileData = await res;
            if (this.ArrayUserProfileData.length != 0) {
              this.UserName = this.ArrayUserProfileData[0].Name;
              this.DName = this.ArrayUserProfileData[0].CurrentDName;
              this.MailId = this.ArrayUserProfileData[0].EmailId
              this.MobileNo = this.ArrayUserProfileData[0].MobileNo;
              this.City = this.ArrayUserProfileData[0].City;
              this.UrlDisplayFlag = this.ArrayUserProfileData[0].ConfirmFlag == "Y"?true:false;
              
              if(!!this.ArrayUserProfileData[0].UserProfileUrl)
              {
              this.UserProfileUrl = this.ArrayUserProfileData[0].UserProfileUrl
              }
              else{
                this.UserProfileUrl = 'https://i.ibb.co/P97BxG9/person-1.png';
              }
              await this.GetUserPerentData(this.ArrayUserProfileData[0].PerentId);
            }
          }
        }

      } else {
        this.service.AlertSuccess('info', 'Please first join our team..!!')
      }
    }

  }

  async GetUserDesignationData() {
    if (this.service) {
      let GetLoginRefId = this.service.GetSessionStorage("RefId");
      if (GetLoginRefId != null && GetLoginRefId != "" && GetLoginRefId != undefined) {
        let GetDId = this.service.GetSessionStorage("DId").replace(/["']/g, "");
        let GetVal = [];
        let obj = {
          p_Condition: " AND CurrDId = " + parseInt(GetDId)
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('GetUserProfileDesignationData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.length != 0) {
            let ArrayUserDesignationData = [];
            ArrayUserDesignationData = await res;
            if (ArrayUserDesignationData.length > 0) {
              this.NDesignationName = ArrayUserDesignationData[0].NextDName;
              this.CDesignationName = ArrayUserDesignationData[0].CurrDName;
              this.PDesignationName = ArrayUserDesignationData[0].PreDName
              this.NeedSell = (ArrayUserDesignationData[0].NextAchiveCount - ArrayUserDesignationData[0].CurrAchiveCount) * 2 + "CC";
              if (this.NDesignationName == "") {
                this.NDesignationName = "-";
              }
              if (this.PDesignationName == "") {
                this.PDesignationName = "-";
              }

            }
          }
        }

      } else {
        this.service.AlertSuccess('info', 'Please first join our team..!!')
      }
    }

  }

  async GetUserPerentData(RefId) {
    if (this.service) {
      let GetLoginRefId = this.service.GetSessionStorage("RefId");
      if (GetLoginRefId != null && GetLoginRefId != "" && GetLoginRefId != undefined) {
        let GetLoginUserId = this.service.GetSessionStorage("UserId").replace(/["']/g, "");
        let GetVal = [];
        let obj = {
          p_Condition: " AND RefId = '" + RefId + "'"
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('GetUserProfileData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.length != 0) {
            let ArrayUserPerentData = [];
            ArrayUserPerentData = await res;
            if (ArrayUserPerentData.length != 0) {
              this.PUserName = ArrayUserPerentData[0].Name;
              this.PDName = ArrayUserPerentData[0].CurrentDName;
              this.PMailId = ArrayUserPerentData[0].EmailId
              this.PMobileNo = ArrayUserPerentData[0].MobileNo;
              this.PCity = ArrayUserPerentData[0].City;
              if(!!ArrayUserPerentData[0].UserProfileUrl)
              {
              this.PUserProfileUrl = ArrayUserPerentData[0].UserProfileUrl
              }
              else{
                this.PUserProfileUrl = 'https://i.ibb.co/P97BxG9/person-1.png';
              }
            }
          }
        }

      } else {
        this.service.AlertSuccess('info', 'Please first join our team..!!')
      }
    }

  }
  openNewWindow(openNewTabFalg: boolean) {
    let refId = this.service.GetSessionStorage("RefId");
    let GetCurrentUrl = window.location.href;
    if (GetCurrentUrl) {
      let GetOrgUrl = GetCurrentUrl.split('#');
      if (refId) {
        if (refId != "" && refId != null && refId != undefined) {
          refId = refId.replace(/["']/g, "");
        }
      }
      else {
        refId = "";
      }
      //let url = GetOrgUrl[0] + '#/master/Register/' + this.service.encryptUsingAES256(refId);
      let url = GetOrgUrl[0] + '#/master/Register?RefId=' + this.service.encryptUsingAES256(refId);
      this.UserUrl = url;
      if(openNewTabFalg)
      {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.UserUrl;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.service.AlertSuccess('info', 'Copy URL Successfully..!!')
      //this.router.navigate(['/master/Register/'], { queryParams: { RefId: refId } });
      }
      // if (openNewTabFalg) {
      //   window.open(url, '_blank');
      // }
    }
  }

  LeadUserDetail(Flag) {
    this.dialogService.open(LeadUserDetailComponent, {
      context: {
        Flag: Flag,
      },
    });
  }

  UserEditProfilePopupOpen() {
    
    this.dialogService.open(UserEditProfilePopupComponent, {
      context: {
        UserDetail: this.ArrayUserProfileData,
      },
    });
  }


}
