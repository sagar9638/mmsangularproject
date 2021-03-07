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
    let objBody = [
      {
        p_Condition: " and RefId like '1.5%' "
      }
    ]
    let res = await this.service.GetDataAPIS('GetUser', 'Post', objBody);
    if (!!res) {
      this.dataset = res;
    }else{
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

}
