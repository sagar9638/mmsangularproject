import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-lead-user-detail',
  templateUrl: './lead-user-detail.component.html',
  styleUrls: ['./lead-user-detail.component.scss']
})
export class LeadUserDetailComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
  ) { }

  @Input() Flag: string;

  settings = {

    actions: {
      add: false,
      edit: false,
      delete: false  
    },
    columns: {
      Name: {
        title: 'Name',
        type: 'string',
        editable: false
      },
      EmailId: {
        title: 'Email',
        type: 'string',
        editable: false
      },
      DOB: {
        title: 'DOB',
        type: 'string',
        editable: false
      },
      City: {
        title: 'City',
        type: 'string',
        editable: false
      },
      MobileNo: {
        title: 'MobileNo',
        type: 'string',
        editable: false
      },
      EntDate: {
        title: 'Date',
        type: 'date',
        editable: false
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();


  ngOnInit(): void {
    this.service.Authentication();
    if (this.service) {
      let refId = this.service.GetSessionStorage("RefId");

      if (refId) {
        if (refId != "" && refId != null && refId != undefined) {
          refId = refId.replace(/["']/g, "");
        }

       let PerentId = refId.split(/\.(?=[^\.]+$)/)[0];

        if(this.Flag == "ThisMonth")
        {
          this.GetLeadUserData(" AND LEFT(RefId, LEN(RefId) - CHARINDEX('.', REVERSE(RefId))) LIKE '"+PerentId+"' AND MONTH(ConfirmDate) =  MONTH(GETDATE()) AND ConfirmFlag = 'Y' ");
        }
        else if(this.Flag == "PreviousMonth"){
          this.GetLeadUserData(" AND LEFT(RefId, LEN(RefId) - CHARINDEX('.', REVERSE(RefId))) LIKE '"+PerentId+"' AND MONTH(ConfirmDate) =  MONTH(GETDATE()) - 1 AND ConfirmFlag = 'Y' ");
        }
        else if(this.Flag == "TillNow"){
          this.GetLeadUserData(" and RefId LIKE '" + PerentId + ".%' And ConfirmFlag = 'Y' ");
        }
        
      }
      else {
        refId = "";
      }
    }
  }

  async GetLeadUserData(Condition) {
    console.log(Condition);
    this.spinner.show();
    let objBody = [
      {
        p_Condition: Condition
      }
    ]
    let res = await this.service.GetDataAPIS('GetUser', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        this.source.load(res);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.source.load([]);
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.spinner.hide();
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

}
