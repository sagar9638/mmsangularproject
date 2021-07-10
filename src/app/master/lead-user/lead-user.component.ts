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

  CategoryData = [];

  settings = {};
  checkValidation: boolean = false;

  source: LocalDataSource = new LocalDataSource();

  async ngOnInit(): Promise<void> {
    this.service.Authentication();
    if (this.service) {
      let refId = this.service.GetSessionStorage("RefId");

      if (refId) {
        if (refId != "" && refId != null && refId != undefined) {
          refId = refId.replace(/["']/g, "");
        }
        //this.GetLeadUserData(" and RefId like '" + refId + ".%' And ConfirmFlag in ('N','P') ");
        let _CategoryData = await this.GetCategoryMasterData("");
        _CategoryData.forEach(element => {
          let obj = {
            title: element.CName,
            value: element.Id,
            CConfirmFlag: element.CConfirmFlag
          };
          this.CategoryData.push(obj);
        });

        this.gridColumnSet();
        this.GetLeadUserData(" and RefId like '" + refId + ".%' And ConfirmFlag in ('N','P') ");

      }
      else {
        refId = "";
      }
    }
  }

  async GetCategoryMasterData(Condition) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetCategoryMasterData', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        return res;
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  gridColumnSet() {
    this.settings = {
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
        ConfirmStatusId: {
          title: 'Status',
          valuePrepareFunction: (cell, row, test) => {
            var t = test.column.dataSet.columns[0].settings.editor.config.list.find(x => x.value === cell)
            if (t)
              return t.title
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Select ID',
              list: this.CategoryData
            }
          },
          width: '250px',
          type: 'html',
          editor: {
            type: 'list',
            config: {
              list: this.CategoryData,
            },
          }
        },
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
  }


  async GetLeadUserData(Condition) {
    this.spinner.show();
    this.source.load([]);
    let objBody = [
      {
        p_Condition: Condition
      }
    ]
    let res = [];
    res = await this.service.GetDataAPIS('GetUser', 'Post', objBody);
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

  async onUpdateConfirm(event): Promise<void> {

    let obj1 = {
      required: [
        { FieldValue: event.newData.ConfirmStatusId, FieldTitle: "Status" },

      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

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

        let refId = this.service.GetSessionStorage("RefId");

        if (refId) {
          if (refId != "" && refId != null && refId != undefined) {
            refId = refId.replace(/["']/g, "");
          }
        }

        let GetVal = [];
        let obj = {
          p_ConfirmFlag: null,
          p_ConfirmStatusId: reqObj.ConfirmStatusId,
          p_ConfirmUser: GetUserName,
          p_Id: reqObj.Id,
          p_RefId: refId
        }
        let GetConfirmFlagData = this.CategoryData.filter(item => item.CConfirmFlag == 'Y');
        if (!!GetConfirmFlagData) {
          if (GetConfirmFlagData.length > 0) {
            if (GetConfirmFlagData[0].value.toString() == reqObj.ConfirmStatusId) {
              obj.p_ConfirmFlag = 'Y';
            } else {
              obj.p_ConfirmFlag = 'P';
            }
          } else {
            obj.p_ConfirmFlag = 'P';
          }
        } else {
          obj.p_ConfirmFlag = 'P';
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
                this.GetLeadUserData(" and RefId like '" + refId + "%' And ConfirmFlag in ('N','P') ");
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
                this.GetLeadUserData(" and RefId like '" + refId + "%' And ConfirmFlag in ('N','P') ");
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
