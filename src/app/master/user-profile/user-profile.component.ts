import { Component, OnInit } from '@angular/core';
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
    private OneColumnLayout: OneColumnLayoutComponent
  ) { }

  UserUrl: any;
  NextPosition: any = "MANAGER";
  NeedSell: any = "200CC";


  ngOnInit(): void {
    this.service.Authentication();
    this.openNewWindow(false);
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
