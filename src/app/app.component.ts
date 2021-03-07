/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
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
  <nb-menu [items]="menu" #myDiv (click)="toggleSidebar()"  ></nb-menu>
  <router-outlet></router-outlet>
  </ngx-one-column-layout>
`,
})
export class AppComponent implements OnInit {
  @ViewChild('myDiv') myDiv: ElementRef;
  menu = MENU_ITEMS;
  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private service: GlobalService,
    private router: Router,
    private sidebarService: NbSidebarService,
    private layoutService: LayoutService,

  ) {

  }

  async ngOnInit(): Promise<void> {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();

    if (this.service) {
      let GetLoginFlag = this.service.GetSessionStorage("LoginFlg");
      if (!!GetLoginFlag) {
        if (GetLoginFlag == "true") {
          let GetCurrentUrl = window.location.href;
          if (!GetCurrentUrl.includes('master/Register')) {
            this.router.navigate(['master/Home']);
          }
        }
      }
      else {
        this.router.navigate(['master/login']);
      }
    }
  }


  toggleSidebar(): boolean {
    this.sidebarService.toggle(false, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

}
