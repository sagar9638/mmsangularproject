import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';
import { GlobalService } from '../../Service/global.service';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'ngx-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  constructor(
    private service: GlobalService,
    public datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private dialogService: NbDialogService
  ) { }

  EventData: any = [];
  EventAllData: any = [];
  EDate: any;
  EVenue: any;
  ETime: any;
  EDetail: any;

  ArrayEVideoData: any ;
  ArrayEImageData: any = [];

  async ngOnInit(): Promise<void> {
    this.service.Authentication();
    this.GetEventMasterData("");
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'EventHighLight'   ORDER BY Id DESC", "EventHighLight");
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'UserDisplayEventImage'   ORDER BY Id DESC", "UserDisplayEventImage");

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
        this.EventAllData = await this.service.getUniqArrBy(['EVenue'], res);
        this.EventData = res;
        if (this.EventData.length > 0) {
          let SetEData = this.EventData.filter(item => item.EDisplayFlag == 'Y' )[0];

          this.EDate = this.datepipe.transform(SetEData.EDate, 'dd/MM/yyyy') ;
          this.EVenue = SetEData.EVenue;
          this.ETime = SetEData.ETime;
          this.EDetail = SetEData.EDetail;
        }
        console.log('this.EventAllData', this.EventAllData);
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  async GetGallaryMasterData(Condition, PageFlag) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]
    if (PageFlag == "EventHighLight") {
      this.ArrayEVideoData = [];
      let res = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
      if (!!res) {
        if (res.length > 0) {
          this.ArrayEVideoData = await this.sanitizer.bypassSecurityTrustResourceUrl(res[0].Path);
        }
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    }
    
    
    if (PageFlag == "UserDisplayEventImage") {
      this.ArrayEImageData = [];
      let res1 = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
      if (!!res1) {
        if (res1.length > 0) {

          this.ArrayEImageData = await res1;
          this.ArrayEImageData = [...this.ArrayEImageData];
        }
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    }
    
  }

  EventCategoryOpen(CategoryName) {
    this.dialogService.open(GalleryComponent, {
      context: {
        CategoryName: CategoryName,
      },
    });
  }

}
