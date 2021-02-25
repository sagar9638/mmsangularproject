import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../Service/global.service';

@Component({
  selector: 'ngx-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {

  constructor(
    private service: GlobalService,
  ) { }

  dataset: any[];
  async ngOnInit(): Promise<void> {
    this.dataset = [];
    let res = await this.service.GetDataAPIS('GetUser', 'Get', {});
    if (!!res) {
      this.dataset = res;
    }else{
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

}
