import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-lead-user',
  templateUrl: './lead-user.component.html',
  styleUrls: ['./lead-user.component.scss']
})
export class LeadUserComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
  ) { }

  settings = {

    actions: {
      add: false,
    },
    edit: {
      editButtonContent: '<i class="fas fa-check-square"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="fas fa-window-close"></i>',
      confirmDelete: true,
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
        this.GetLeadUserData(" and RefId like '" + refId + "%' And ConfirmFlag = 'N' ");
      }
      else {
        refId = "";
      }
    }
  }

  renderDateTime(tets) {
    console.log('tets', tets)
  }

  async GetLeadUserData(Condition) {
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

  onUpdateConfirm(event): void {

    this.service.AlertConfirm('Are you sure?', "You won't be Confirm this!", "Yes, Confirm it!").then(async (Resualt) => {
      if (Resualt.isConfirmed) {
        let reqObj = event.newData;
        this.spinner.show();
        let GetUserName = this.service.GetSessionStorage("UserName");
        if (!!GetUserName) {
          GetUserName = GetUserName.replace(/["']/g, "")
        }
        else {
          GetUserName = null;
        }
        let GetVal = [];
        let obj = {
          p_ConfirmFlag: 'Y',
          p_ConfirmUser: GetUserName,
          p_Id: reqObj.Id,
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('UpdConfirmFlag', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            if (this.service) {
              let refId = this.service.GetSessionStorage("RefId");

              if (refId) {
                if (refId != "" && refId != null && refId != undefined) {
                  refId = refId.replace(/["']/g, "");
                }
                this.GetLeadUserData(" and RefId like '" + refId + "%' And ConfirmFlag = 'N' ");
              }
              else {
                refId = "";
              }
            }
            this.spinner.hide();
          }
          else {
            this.service.AlertSuccess('error', res.mesg);
            this.spinner.hide();
          }
        }
      }
    });
  }

  onDeleteConfirm(event): void {
    this.service.AlertConfirm('Are you sure?', "You won't be Reject this!", "Yes, Reject it!").then(async (Resualt) => {
      if (Resualt.isConfirmed) {
        let reqObj = event.data;
        this.spinner.show();
        let GetUserName = this.service.GetSessionStorage("UserName");
        if (!!GetUserName) {
          GetUserName = GetUserName.replace(/["']/g, "")
        }
        else {
          GetUserName = null;
        }
        let GetVal = [];
        let obj = {
          p_ConfirmFlag: 'R',
          p_ConfirmUser: GetUserName,
          p_Id: reqObj.Id,
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('UpdConfirmFlag', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            if (this.service) {
              let refId = this.service.GetSessionStorage("RefId");

              if (refId) {
                if (refId != "" && refId != null && refId != undefined) {
                  refId = refId.replace(/["']/g, "");
                }
                this.GetLeadUserData(" and RefId like '" + refId + "%' And ConfirmFlag = 'N' ");
              }
              else {
                refId = "";
              }
            }
            this.spinner.hide();
          }
          else {
            this.service.AlertSuccess('error', res.mesg);
            this.spinner.hide();
          }
        }
      }
    });
  }
}
