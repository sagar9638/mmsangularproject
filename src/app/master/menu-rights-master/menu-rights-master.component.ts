import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-menu-rights-master',
  templateUrl: './menu-rights-master.component.html',
  styleUrls: ['./menu-rights-master.component.scss']
})
export class MenuRightsMasterComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
  ) { }

  checkValidation: boolean = false;

  DId: any;
  MId: any;

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
      Id: {
        title: 'Id',
        type: 'int',
        show: true,
        editable: false
      },
      DId: {
        title: 'Designation Id',
        type: 'int',
        show: true,
        editable: false

      },
      MId: {
        title: 'Menu Id',
        type: 'int',
        show: true,
        editable: false

      },
     
    }
  };

  source: LocalDataSource = new LocalDataSource();


  ngOnInit(): void {
    this.service.Authentication();
    this.GetMenuRightsMasterData("");
  }

  async GetMenuRightsMasterData(Condition) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetMenuRightsMasterData', 'Post', objBody);
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
        { FieldValue: this.DId, FieldTitle: "DId" },
        { FieldValue: this.MId, FieldTitle: "MId" }
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
      p_DId: this.DId,
      p_MId: this.MId,
      p_EntUser: GetUserName
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('AddMenuRightsMaster', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        this.ClearData();
        await this.GetMenuRightsMasterData("");
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
          p_Id: reqObj.DId,
          p_DId: reqObj.DName,
          p_MId: reqObj.DShortName,
          p_UpdUser: GetUserName
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('UpdMenuRightsMaster', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetMenuRightsMasterData("");
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
          p_Id: reqObj.Id,
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('DeleteMenuRightsMaster', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetMenuRightsMasterData("");
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
    this.DId = null;
    this.MId = null;
  }

  Cancle() {
    this.ClearData();
  }

}
