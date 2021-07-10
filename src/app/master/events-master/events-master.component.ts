import { Ng2CompleterModule } from '@akveo/ng2-completer';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-events-master',
  templateUrl: './events-master.component.html',
  styleUrls: ['./events-master.component.scss']
})
export class EventsMasterComponent implements OnInit {
  @ViewChild('EventDate', { static: false }) EventDate: ElementRef;
  @ViewChild('EventTime', { static: false }) EventTime: ElementRef;
  @ViewChild('myInput') myInputVariable: ElementRef;
  @ViewChild('myInputImage') myInputImageVariable: ElementRef;


  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
    private af: AngularFireStorage,
    private sanitizer: DomSanitizer
  ) { }

  FilePath: any;

  fb;
  downloadURL: Observable<string>;
  Category: any;

  ArrayEVideoData: any;
  ArrayEImageData: any = [];
  ArrayEImageCategoryData = [];
  ArrayCategoryData: any = [];
  DisplayStatusData = [];
  checkValidation: boolean = false;

  LeaderName: any;
  EVenue: any;
  EDate: any;
  ETime: any;
  EDetail: any;

  settings = {};

  source: LocalDataSource = new LocalDataSource();


  async ngOnInit(): Promise<void> {
    
    this.service.Authentication();

    let _EventMasterData = await this.GetEventMasterData("");
    console.log('_EventMasterData', _EventMasterData);
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'EventHighLight'   ORDER BY Id DESC", "EventHighLight");
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'UserDisplayEventImage'   ORDER BY Id DESC", "UserDisplayEventImage");
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'EventCategoryWiseImage'   ORDER BY Id DESC", "EventCategoryWiseImage");
    let _TempDisplayStatusData = [
      { title: 'Active', value: "Y" },
      { title: 'DeActive', value: "N" },
      { title: 'Recent', value: "R" }
    ]
  _EventMasterData.forEach(async element => {
      let _Temp = await _TempDisplayStatusData.filter(item => item.value == element.EDisplayFlag)[0];
      let obj = {
        title: _Temp.title,
        value: _Temp.value,
        EDisplayFlag: element.EDisplayFlag
      };
      await this.DisplayStatusData.push(obj);
    });
    await this.gridColumnSet();
  }

  gridColumnSet() {
    this.settings = {
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
        EName: {
          title: 'Leader Name',
          type: 'string',
        },
        EVenue: {
          title: 'Venue',
          type: 'string',
        },
        EDate: {
          title: 'Event Date',
          type: 'date',
        },
        ETime: {
          title: 'Event Time',
          type: 'string',
        },
        EDisplayFlag: {
          title: 'Display Status',
          type: 'string',
          // valuePrepareFunction: (cell, row, test) => {
          //   var t = test.column.dataSet.columns[4].settings.editor.config.list.find(x => x.value === cell)
          //   if (t)
          //     return t.title
          // },
          // filter: {
          //   type: 'list',
          //   config: {
          //     selectText: '',
          //     list: this.DisplayStatusData
          //   }
          // },
          // width: '250px',
          // type: 'html',
          // editor: {
          //   type: 'list',
          //   config: {
          //     list: this.DisplayStatusData,
          //   },
          // }
        },
        // EDisplayFlag1: {
        //   title: 'Display Flag',
        //   type: 'string',
        // },
        EDetail: {
          title: 'Event Detail',
          type: 'string',
        },
      }
    };
  }

  async GetEventMasterData(Condition) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetEventMasterData', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        this.source.load(res);
        this.ArrayCategoryData = await this.service.getUniqArrBy(['EVenue'], res);
        return res;
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
        { FieldValue: this.LeaderName, FieldTitle: "Leader Name" },
        { FieldValue: this.EVenue, FieldTitle: "Venue" },
        { FieldValue: this.EDate, FieldTitle: "Date" },
        { FieldValue: this.ETime, FieldTitle: "Time" },
        { FieldValue: this.EDetail, FieldTitle: "Detail" }
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
    let _EventDate = null;
if(!!this.EventDate.nativeElement.value)
{
    let dateString = this.EventDate.nativeElement.value; 
    _EventDate = new Date(dateString);
}
    let GetVal = [];
    let obj = {
      p_ECategory: 'CommonEvent',
      p_EStatus: 'Active',
      p_EName: this.LeaderName,
      p_EVenue: this.EVenue,
      p_EDetail: this.EDetail,
      p_EUrl: null,
      p_EImagePath: null,
      p_EDate: _EventDate,
      p_ETime: this.EventTime.nativeElement.value,
      p_IsActive: 'Y',
      p_Ord: null,
      p_Remark: null,
      p_EntDate: null,
      p_EntUser: GetUserName,
      p_EDisplayFlag: 'N'
    }

    for (var i in obj) {
      if (obj[i] === undefined) {
        obj[i] = null;
      }
    }
    GetVal.push(obj);

    let res = await this.service.GetDataAPIS('AddEventMasterData', 'Post', GetVal);
    if (res != null && res != undefined && res != "") {
      if (res.flag == true) {
        this.service.AlertSuccess('success', res.mesg);
        this.ClearData();
        await this.GetEventMasterData("");
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
            { FieldValue: reqObj.EName, FieldTitle: "Leader Name" },
            { FieldValue: reqObj.EVenue, FieldTitle: "Venue" },
            { FieldValue: reqObj.EDetail, FieldTitle: "Event Detail" },
            { FieldValue: reqObj.EDate, FieldTitle: "Event Date" },
            { FieldValue: reqObj.ETime, FieldTitle: "Event Time" },
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
          p_ECategory: 'CommonEvent',
          p_EStatus: 'Active',
          p_EName: reqObj.EName,
          p_EVenue: reqObj.EVenue,
          p_EDetail: reqObj.EDetail,
          p_EUrl: null,
          p_EImagePath: null,
          p_EDate: reqObj.EDate,
          p_ETime: reqObj.ETime,
          p_IsActive: 'Y',
          p_Ord: null,
          p_Remark: null,
          p_EntDate: null,
          p_EntUser: GetUserName,
          p_EDisplayFlag: reqObj.EDisplayFlag
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('UpdEventMasterData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetEventMasterData("");
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

        let res = await this.service.GetDataAPIS('DeleteEventMasterData', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            await this.GetEventMasterData("");
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
    this.LeaderName = null;
    this.EVenue = null;
    this.EDate = null;
    this.ETime = null;
    this.EDetail = null;
  }

  Cancle() {
    this.ClearData();
  }

  /**********************************************************************************/
  /* Event Upload Video All Method                                                  */
  /**********************************************************************************/


  upload($event) {
    if ($event.target.files && $event.target.files.length) {
      this.FilePath = $event.target.files[0];
    }
  }

  async AddImage(PageFlag) {
    let obj1 = {
      required: [
        { FieldValue: this.FilePath, FieldTitle: "Video Upload" }
      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

    this.spinner.show();
    var FileName = Date.now() + this.FilePath.name;
    const file = this.FilePath;
    let filePath = `Event/` + PageFlag + `/${FileName}`;
    let fileRef = this.af.ref(filePath);
    let task = this.af.upload(`Event/` + PageFlag + `/${FileName}`, file);

    if (PageFlag == "EventCategoryWiseImage") {
      filePath = `Event/Category/` + this.Category + `/` + PageFlag + `/${FileName}`;
      task = this.af.upload(`Event/Category/` + this.Category + `/` + PageFlag + `/${FileName}`, file);
    }

    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          this.downloadURL = await fileRef.getDownloadURL();
          this.downloadURL.subscribe(async url => {
            if (url) {
              this.fb = await url;
              let GetUserName = this.service.GetSessionStorage("UserName");
              if (!!GetUserName) {
                GetUserName = GetUserName.replace(/["']/g, "")
              }
              else {
                GetUserName = null;
              }

              let GetVal = [];
              let obj = {
                p_FileName: FileName,
                p_FileType: this.FilePath.type,
                p_FileSize: this.FilePath.size,
                p_Path: this.fb,
                p_SrcPath: null,
                p_PageName: 'Events',
                p_Category: '',
                p_Ord: 0,
                p_Remark: '',
                p_DeleteFlag: 'Y',
                p_EntUser: GetUserName
              }

              if (PageFlag == "EventHighLight") {
                obj.p_Category = PageFlag;
              }
              else if (PageFlag == "UserDisplayEventImage") {
                obj.p_Category = PageFlag;
                obj.p_SrcPath = PageFlag + `/${FileName}`;
              }
              else if (PageFlag == "EventCategoryWiseImage") {
                obj.p_Category = PageFlag;
                obj.p_SrcPath = this.Category + `/` + PageFlag + `/${FileName}`;
              }

              for (var i in obj) {
                if (obj[i] === undefined) {
                  obj[i] = null;
                }
              }
              GetVal.push(obj);

              let res = await this.service.GetDataAPIS('AddGalleryMaster', 'Post', GetVal);
              if (res != null && res != undefined && res != "") {
                if (res.flag == true) {
                  this.service.AlertSuccess('success', res.mesg);
                  //this.ClearData();
                  this.myInputVariable.nativeElement.value = null;
                  this.myInputImageVariable.nativeElement.value = null;
                  if (PageFlag == "EventHighLight") {
                    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'EventHighLight'   ORDER BY Id DESC", "EventHighLight");
                  }
                  if (PageFlag == "UserDisplayEventImage") {
                    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'UserDisplayEventImage'   ORDER BY Id DESC", "UserDisplayEventImage");
                  }
                  if (PageFlag == "EventCategoryWiseImage") {
                    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'EventCategoryWiseImage'   ORDER BY Id DESC", "EventCategoryWiseImage");
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
        })
      )
      .subscribe(url => {
      });
  }

  async GetGallaryMasterData(Condition, PageFlag) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]
    if (PageFlag == "EventHighLight") {
      this.ArrayEVideoData = [];
      let res = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
      if (!!res) {
        if (res.length > 0) {
          this.ArrayEVideoData = await this.sanitizer.bypassSecurityTrustResourceUrl(res[0].Path);
          //this.ArrayEVideoData = [...this.ArrayEVideoData];
        }
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    }


    if (PageFlag == "UserDisplayEventImage") {
      this.ArrayEImageData = [];
      let res1 = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
      if (!!res1) {
        if (res1.length > 0) {
          this.ArrayEImageData = await res1;
          this.ArrayEImageData = [...this.ArrayEImageData];
        }
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    }

    if (PageFlag == "EventCategoryWiseImage") {
      this.ArrayEImageCategoryData = [];
      let res2 = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
      if (!!res2) {
        if (res2.length > 0) {
          let _ArrayEImageCategoryData = await res2;
          _ArrayEImageCategoryData.forEach(element => {
            var _splitData = element.SrcPath.split('/');
            element.EVenue = _splitData[0]
            this.ArrayEImageCategoryData.push(element);
          });
          this.ArrayEImageCategoryData = [...this.ArrayEImageCategoryData];
        }
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    }
  }


}
