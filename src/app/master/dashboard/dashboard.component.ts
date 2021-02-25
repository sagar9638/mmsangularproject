import { Component, OnInit } from '@angular/core';
import { OneColumnLayoutComponent } from '../../@theme/layouts/one-column/one-column.layout';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private OneColumnLayout: OneColumnLayoutComponent
  ) { }

  
  nodes = [
    { id: 1, name: "Sagar", title: "Chairman and CEO", email: "amber@domain.com", img: "https://cdn.balkan.app/shared/1.jpg" },
    { id: 2, pid: 1, name: "Lexie Cole", title: "QA Lead", email: "ava@domain.com", img: "https://cdn.balkan.app/shared/2.jpg" },
    { id: 3, pid: 1, name: "Janae Barrett", title: "Technical Director", img: "https://cdn.balkan.app/shared/3.jpg" },
    { id: 4, pid: 1, name: "Aaliyah Webb", title: "Manager", email: "jay@domain.com", img: "https://cdn.balkan.app/shared/4.jpg" },
    { id: 5, pid: 2, name: "Elliot Ross", title: "QA", img: "https://cdn.balkan.app/shared/5.jpg" },
    { id: 6, pid: 2, name: "Anahi Gordon", title: "QA", img: "https://cdn.balkan.app/shared/6.jpg" },
    { id: 7, pid: 2, name: "Knox Macias", title: "QA", img: "https://cdn.balkan.app/shared/7.jpg" },
    { id: 8, pid: 3, name: "Nash Ingram", title: ".NET Team Lead", email: "kohen@domain.com", img: "https://cdn.balkan.app/shared/8.jpg" },
    { id: 9, pid: 3, name: "Sage Barnett", title: "JS Team Lead", img: "https://cdn.balkan.app/shared/9.jpg" },
    { id: 10, pid: 8, name: "Alice Gray", title: "Programmer", img: "https://cdn.balkan.app/shared/10.jpg" },
    { id: 11, pid: 8, name: "Anne Ewing", title: "Programmer", img: "https://cdn.balkan.app/shared/11.jpg" },

  ];

  ArrayBestLeaderData = [];
  RefId: any;
  async ngOnInit(): Promise<void> {
    if (this.OneColumnLayout) {
      this.OneColumnLayout.headerDisplayFlag = true;
    }

    this.ArrayBestLeaderData = [];
    let res = await this.service.GetDataAPIS('GetUser', 'Get', {});
    if (!!res) {
      for (let index = 0; index < 3; index++) {
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

}
