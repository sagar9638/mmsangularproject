import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OneColumnLayoutComponent } from '../../@theme/layouts/one-column/one-column.layout';
import { AppComponent } from '../../app.component';
import { GlobalService } from '../../Service/global.service';
declare function myfunction(params1, params2): any;
declare function myfunction1(params1, params2): any;
declare function callHandler(): any;

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private router: Router,
    private OneColumnLayout: OneColumnLayoutComponent,
    private App: AppComponent,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
  ) { }

  ArrayBestLeaderData = [];
  ArrayRecentEventData = [];
  ArrayAchievementData = [];
  EventData = [];
  RefId: any;

  today = new Date();
  Leader: any;
  Venue: any;
  Date: any;

  EDay : any;
  EMonth : any;
  EVenue : any;
  ETime : any;
  EDetail : any;


  async ngOnInit(): Promise<void> {
    this.spinner.show();
    if (this.OneColumnLayout) {
      this.OneColumnLayout.headerDisplayFlag = true;
    }
    this.Venue = "Pune";
    this.Leader = "Dinesh VP";
    this.Date = formatDate(this.today, 'dd-MM-yyyy', 'en-US', '+0530');
    this.service.Authentication();
    await this.App.ngOnInit();
    await this.App.toggleSidebar();
    this.ArrayBestLeaderData = [];
    let objBody = [
      {
        p_Condition: ''
      }
    ]
    let res = await this.service.GetDataAPIS('GetUser', 'Post', objBody);
    if (!!res) {
      if (res.length >= 4) {
        for (let index = 0; index < 4; index++) {
          this.ArrayBestLeaderData.push(res[index]);
        }
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
    await this.GetRecentEventData(" AND DeleteFlag = 'Y' AND Category = 'RECENT_EVENT'   ORDER BY Id DESC");
    await this.GetAchievementData("");
    await this.GetEventMasterData("");
    this.spinner.hide();
  }

  async GetEventMasterData(Condition) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetEventMasterData', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        this.EventData = res;
        if (this.EventData.length > 0) {
          let SetEData = this.EventData.filter(item => item.EDisplayFlag == 'Y' )[0];
          let RecentSetEData = this.EventData.filter(item => item.EDisplayFlag == 'R' )[0];
          
          if(!!SetEData)
          {
          this.EDay = this.datepipe.transform(SetEData.EDate, 'dd') ;
          this.EMonth = this.datepipe.transform(SetEData.EDate, 'MMM') ;
          this.EVenue = SetEData.EVenue;
          this.ETime = SetEData.ETime;
          this.EDetail = SetEData.EDetail;
          }

          if(!!RecentSetEData)
          {
          this.Venue = RecentSetEData.EVenue;
          this.Leader = RecentSetEData.EName;
          this.Date = formatDate(RecentSetEData.EDate, 'dd-MM-yyyy', 'en-US', '+0530');
          }
        }
        
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  async GetRecentEventData(Condition) {
    this.ArrayRecentEventData = [];
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        this.ArrayRecentEventData = res;
        this.ArrayRecentEventData = [...this.ArrayRecentEventData];
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  async GetAchievementData(Condition) {
    this.ArrayAchievementData = [];
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetAchievementData', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        this.ArrayAchievementData = res;
        this.ArrayAchievementData = [...this.ArrayAchievementData];
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  openNewWindow() {
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
      window.open(url, '_blank');
    }
  }


  openEvent() {
    this.router.navigate(['master/Event']);
  }

  openGallary(){
    this.router.navigate(['master/Gallery']);
  }
}
