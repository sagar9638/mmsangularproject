import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../../Service/global.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private af: AngularFireStorage,

  ) { }

  @Input() CategoryName: string = "";

  ArrayGallaryData = [];
  PageName: string = "";

  async ngOnInit(): Promise<void> {
    this.service.Authentication();
    if (this.CategoryName != "") {
      this.PageName = this.CategoryName;
      await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'EventCategoryWiseImage' AND SrcPath Like '" + this.CategoryName + "/%'   ORDER BY Id DESC");
    } else {
      await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'GALLARY'   ORDER BY Id DESC");
    }
  }

  async GetGallaryMasterData(Condition) {
    this.ArrayGallaryData = [];
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        this.ArrayGallaryData = res;
        this.ArrayGallaryData = [...this.ArrayGallaryData];
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  Back() {
   let ref: NbDialogRef<GalleryComponent>
    if(!!ref)
    {
      ref.close();
    }
    
  }

}
