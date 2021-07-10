/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { from } from 'rxjs';
import { LayoutService } from './@core/utils';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { MENU_ITEMS } from './pages/pages-menu';
import { GlobalService } from './Service/global.service';

@Component({
  selector: 'ngx-app',
  template: `
  <ngx-one-column-layout >
  <nb-menu [items]="menu" #myDiv tag="menu-sidebar" (click)="toggleSidebar()"  ></nb-menu>
  <router-outlet></router-outlet>
  </ngx-one-column-layout>
`,
})
export class AppComponent implements OnInit {
  @ViewChild('myDiv') myDiv: ElementRef;
  menu: NbMenuItem[] = [];

  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private service: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private sidebarService: NbSidebarService,
    private layoutService: LayoutService,

  ) {
    this.toggleSidebar();
  }

  async ngOnInit(): Promise<void> {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    this.toggleSidebar();
    if (this.service) {

      const url = window.location.href;
      let paramValue;
      if (!url.includes('?')) {
        const httpParams = new HttpParams({ fromString: url.split('?')[1] });
        paramValue = httpParams.get("RefId");

        let GetLoginFlag = this.service.GetSessionStorage("LoginFlg");
        if (!!GetLoginFlag) {
          if (GetLoginFlag == "true") {
            let GetCurrentUrl = window.location.href;
            if (!GetCurrentUrl.includes('master/Register')) {
              this.router.navigate(['master/Home']);
            }
          }
          await this.GetMenuRightsData();
        }
        else {
          this.router.navigate(['master/login']);
        }
      }



      let GetLoginFlag = this.service.GetSessionStorage("LoginFlg");
      // if (!!GetLoginFlag) {
      //   if (GetLoginFlag == "true") {
      //     let GetCurrentUrl = window.location.href;
      //     if (!GetCurrentUrl.includes('master/Register')) {
      //       this.router.navigate(['master/Home']);
      //     }
      //   }
      //  await  this.GetMenuRightsData();
      // }
      // else {
      //   this.router.navigate(['master/login']);
      // }
    }


  }

  async GetMenuRightsData() {
    if (this.service) {
      let GetLoginRefId = this.service.GetSessionStorage("RefId");
      if (GetLoginRefId != null && GetLoginRefId != "" && GetLoginRefId != undefined) {
        let GetDId = this.service.GetSessionStorage("DId").replace(/["']/g, "");
        let GetVal = [];
        let obj = {
          p_Condition: " AND MR.DId = " + GetDId
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('GetMenuRightsData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.length != 0) {
            let ArrayMenuRightsData = [];
            //ArrayMenuRightsData = await res;
            if (res.length != 0) {
              await res.forEach(element => {
                let obj = {
                  title: element.MName,
                  icon: 'layout-outline',
                  link: element.MPath,
                }
                ArrayMenuRightsData.push(obj);
              });

              this.menu = await ArrayMenuRightsData;
              this.menu = [...this.menu];
            }
          }
        }

      } else {
        this.service.AlertSuccess('info', 'Please first join our team..!!')
      }
    }

  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(false, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

}
