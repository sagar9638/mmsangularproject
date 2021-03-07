import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
  ) { }

  checkValidation: boolean = false;

  DName: any;
  DShortName: any;
  DAchiveCount: any;
  Remark: any;
  IsActive: any;

  settings = {
    actions: {
      add: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      DName: {
        title: 'Name',
        type: 'string',
      },
      DShortName: {
        title: 'Short Name',
        type: 'string',
      },
      DAchiveCount: {
        title: 'Achive Count',
        type: 'string',
      },
      Remark: {
        title: 'Remark',
        type: 'string',
      },
      IsActive: {
        title: 'IsActive',
        type: 'string',
      },
      EntDate: {
        title: 'Date',
        type: 'date',
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    this.service.Authentication();
    this.GetDesignationMasterData("");
  }

  async GetDesignationMasterData(Condition) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetDesignationData', 'Post', objBody);

    if (!!res) {
      if (res.length > 0) {
        this.source.load(res);
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  async SaveData() {
    let obj1 = {
      required: [
        { FieldValue: this.DName, FieldTitle: "Name" }
      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

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
      p_DName: this.DName,
      p_DShortName: this.DShortName,
      p_DAchiveCount: this.DAchiveCount,
      p_Remark: this.Remark,
      p_IsActive: this.IsActive,
      p_EntUser: GetUserName
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('AddDesignationData', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        this.ClearData();
        await this.GetDesignationMasterData("");
        this.spinner.hide();
      }
      else {
        this.service.AlertSuccess('error', res.mesg);
        this.spinner.hide();
      }
    }
  }

  onUpdateConfirm(event): void {

    this.service.AlertConfirm('Are you sure?', "You won't be Update this!", "Yes, Update it!").then(async (Resualt) => {
      if (Resualt.isConfirmed) {

        let reqObj = event.newData;
        let obj1 = {
          required: [
            { FieldValue: reqObj.DName, FieldTitle: "Name" }
          ]
        }

        this.checkValidation = await this.service.CheckValidation(obj1);
        if (this.checkValidation == false) {
          return
        }

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
          p_DId: reqObj.DId,
          p_DName: reqObj.DName,
          p_DShortName: reqObj.DShortName,
          p_DAchiveCount: reqObj.DAchiveCount,
          p_Remark: reqObj.Remark,
          p_IsActive: reqObj.IsActive,
          p_UpdUser: GetUserName
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('UpdDesignationData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetDesignationMasterData("");
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
    this.service.AlertConfirm('Are you sure?', "You won't be Delete this!", "Yes, Delete it!").then(async (Resualt) => {
      if (Resualt.isConfirmed) {
        let reqObj = event.data;
        this.spinner.show();

        let GetVal = [];
        let obj = {
          p_DId: reqObj.DId,
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('DeleteDesignationData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetDesignationMasterData("");
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

  ClearData() {
    this.DName = null;
    this.DShortName = null;
    this.DAchiveCount = null;
    this.Remark = null;
    this.IsActive = null;
  }

  Cancle() {
    this.ClearData();
  }

}
