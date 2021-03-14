import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss']
})
export class MenuMasterComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
  ) { }

  checkValidation: boolean = false;

  MenuName: any;
  MenuTitle: any;
  MenuPath: any = "master/";
  MenuIcon: any;
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
      MId: {
        title: 'Menu Id',
        type: 'int',
        show: true,
        editable: false
      },
      MTitle: {
        title: 'Menu Title',
        type: 'string',
      },
      MName: {
        title: 'Menu Name',
        type: 'string',
      },
      MPath: {
        title: 'Menu Path',
        type: 'string',
      },
      MIcon: {
        title: 'Menu Icon',
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
      EntDates: {
        title: 'Date',
        type: 'date',
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  async ngOnInit(): Promise<void> {
    this.service.Authentication();
    this.GetMenuMasterData("");
  }

  async GetMenuMasterData(Condition) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]
    let res = await this.service.GetDataAPIS('GetMenuData', 'Post', objBody);
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
        { FieldValue: this.MenuName, FieldTitle: "Menu Name" },
        { FieldValue: this.MenuPath, FieldTitle: "Menu Path" }
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
      p_MTitle: this.MenuTitle,
      p_MName: this.MenuName,
      p_MPath: this.MenuPath,
      p_MIcon: this.MenuIcon,
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

    let res = await this.service.GetDataAPIS('AddMenuData', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        this.ClearData();
        this.MenuPath = "master/";
        await this.GetMenuMasterData("");
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
            { FieldValue: reqObj.MName, FieldTitle: "Menu Name" },
            { FieldValue: reqObj.MPath, FieldTitle: "Menu Path" }
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
          p_MId: reqObj.MId,
          p_MTitle: reqObj.MTitle,
          p_MName: reqObj.MName,
          p_MPath: reqObj.MPath,
          p_MIcon: reqObj.MIcon,
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

        let res = await this.service.GetDataAPIS('UpdMenuData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetMenuMasterData("");
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
          p_MId: reqObj.MId,
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('DeleteMenuData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetMenuMasterData("");
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
    this.MenuName = null;
    this.MenuTitle = null;
    this.MenuPath = "master/";
    this.MenuIcon = null;
    this.Remark = null;
    this.IsActive = null;
  }

  Cancle() {
    this.ClearData();
  }

}
