import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OneColumnLayoutComponent } from '../../@theme/layouts/one-column/one-column.layout';
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
    private OneColumnLayout: OneColumnLayoutComponent
  ) { }

  ArrayBestLeaderData = [];
  RefId: any;

  today= new Date();
  Leader: any;
  Venue: any;
  Date: any;

  async ngOnInit(): Promise<void> {
    if (this.OneColumnLayout) {
      this.OneColumnLayout.headerDisplayFlag = true;
    }
    this.Venue = "Pune";
    this.Leader = "Dinesh VP";
    this.Date = formatDate(this.today, 'dd-MM-yyyy', 'en-US', '+0530');
    this.service.Authentication();
    this.ArrayBestLeaderData = [];
    let objBody = [
      {
        p_Condition: ''
      }
    ]
    let res = await this.service.GetDataAPIS('GetUser', 'Post', objBody);
    if (!!res) {
      for (let index = 0; index < 4; index++) {
        this.ArrayBestLeaderData.push(res[index]);
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
}
