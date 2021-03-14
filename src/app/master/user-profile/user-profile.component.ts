import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { OneColumnLayoutComponent } from '../../@theme/layouts/one-column/one-column.layout';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
    private OneColumnLayout: OneColumnLayoutComponent
  ) { }

  UserUrl: any;
  NextPosition: any = "MANAGER";
  NeedSell: any = "200CC";

  UserName : any;
  DName : any;
  MailId : any;
  MobileNo : any;
  City : any;
  PUserName : any;
  PDName : any;
  PMailId : any;
  PMobileNo : any;
  PCity : any;

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
            let ArrayUserProfileData = [];
            ArrayUserProfileData = await res;
            if(ArrayUserProfileData.length != 0)
            {
              this.UserName = ArrayUserProfileData[0].Name;
              this.DName = ArrayUserProfileData[0].CurrentDName;
              this.MailId = ArrayUserProfileData[0].EmailId
              this.MobileNo = ArrayUserProfileData[0].MobileNo;
              this.City = ArrayUserProfileData[0].City;
              await this.GetUserPerentData(ArrayUserProfileData[0].PerentId);
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
          p_Condition: " AND CurrDId = " + parseInt( GetDId)
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('GetUserProfileDesignationData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.length != 0) {
            let ArrayUserDesignationData = [];
            ArrayUserDesignationData = await res;
            if(ArrayUserDesignationData.length > 0)
            {
              this.NDesignationName = ArrayUserDesignationData[0].NextDName;
              this.CDesignationName = ArrayUserDesignationData[0].CurrDName;
              this.PDesignationName = ArrayUserDesignationData[0].PreDName
              
              if(this.NDesignationName == "")
              {
                this.NDesignationName = "-";
              }
              if(this.PDesignationName == "")
              {
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
            if(ArrayUserPerentData.length != 0)
            {
              this.PUserName = ArrayUserPerentData[0].Name;
              this.PDName = ArrayUserPerentData[0].CurrentDName;
              this.PMailId = ArrayUserPerentData[0].EmailId
              this.PMobileNo = ArrayUserPerentData[0].MobileNo;
              this.PCity = ArrayUserPerentData[0].City;
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
      let url = GetOrgUrl[0] + '#/master/Register/' + refId;
      this.UserUrl = url;
      if (openNewTabFalg) {
        window.open(url, '_blank');
      }
    }
  }


}
