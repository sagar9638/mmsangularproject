import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss']
})
export class CategoryMasterComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
  ) { }

  checkValidation: boolean = false;

  CName: any;
  CShortName: any;
  Remark: any;

  settings = {
    actions: {
      add: false,
      delete: false,
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
      // Id: {
      //   title: 'Designation Id',
      //   type: 'int',
      //   show: true,
      //   editable: false
      // },
       CName: {
        title: 'Name',
        type: 'string',
      },
      CShortName: {
        title: 'Short Name',
        type: 'string',
      },
      Remark: {
        title: 'Remark',
        type: 'string',
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    this.service.Authentication();
    this.GetCategoryMasterData("");
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
        { FieldValue: this.CName, FieldTitle: "Name" }
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
      p_CName: this.CName,
      p_CShortName: this.CShortName,
      p_CType: 'UserConfirmStatus',
      p_CPageName: 'LeadUser',
      p_CPageType: null,
      p_CDetail: null,
      p_CStatusFlag: null,
      p_CConfirmFlag: null,
      p_IsActive: 'Y',
      p_Ord: null,
      p_Remark: this.Remark,
      p_EntUser: GetUserName
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('AddCategoryMasterData', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        this.ClearData();
        await this.GetCategoryMasterData("");
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
            { FieldValue: reqObj.CName, FieldTitle: "Name" }
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
          p_Id: reqObj.Id,
          p_CName: reqObj.CName,
          p_CShortName: reqObj.CShortName,
          p_CType: reqObj.CType,
          p_CPageName: reqObj.CPageName,
          p_CPageType: reqObj.CPageType,
          p_CDetail: reqObj.CDetail,
          p_CStatusFlag: reqObj.CStatusFlag,
          p_CConfirmFlag: reqObj.CConfirmFlag,
          p_IsActive: reqObj.IsActive,
          p_Ord: reqObj.Ord,
          p_Remark: reqObj.Remark,
          p_UpdUser: GetUserName
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('UpdCategoryMasterData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetCategoryMasterData("");
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
    this.CName = null;
    this.CShortName = null;
    this.Remark = null;
  }

  Cancle() {
    this.ClearData();
  }


}
