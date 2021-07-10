import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, createStorageRef } from '@angular/fire/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-gallery-master',
  templateUrl: './gallery-master.component.html',
  styleUrls: ['./gallery-master.component.scss']
})
export class GalleryMasterComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  
  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
    private af: AngularFireStorage,
  ) { }

  checkValidation: boolean = false;

  FilePath: any;
  ImageUpload: any;

  ArrayGallaryData = [];
  ArrayRecentEventData = [];

  fb;
  downloadURL: Observable<string>;
  
  async ngOnInit(): Promise<void> {
    this.service.Authentication();
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'GALLARY'   ORDER BY Id DESC", "GALLARY");
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'RECENT_EVENT'   ORDER BY Id DESC", "RECENT_EVENT");
  }

  async GetGallaryMasterData(Condition, PageFlag) {
    let objBody = [
      {
        p_Condition: Condition
      }
    ]
    if (PageFlag == "GALLARY") {
      this.ArrayGallaryData = [];
      let res = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
      if (!!res) {
        if (res.length > 0) {
          this.ArrayGallaryData = await res;
          this.ArrayGallaryData = [...this.ArrayGallaryData];
        }
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    }
    
    
    if (PageFlag == "RECENT_EVENT") {
      this.ArrayRecentEventData = [];
      let res1 = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
      if (!!res1) {
        if (res1.length > 0) {

          this.ArrayRecentEventData = await res1;
          this.ArrayRecentEventData = [...this.ArrayRecentEventData];
        }
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    }
    
  }

  upload($event) {
    if ($event.target.files && $event.target.files.length) {
    this.FilePath = $event.target.files[0];
    }
  }


  async AddImage(PageFlag){
    let obj1 = {
      required: [
        { FieldValue: this.FilePath, FieldTitle: "Image Upload" }
      ]
    }

    this.checkValidation = await this.service.CheckValidation(obj1);
    if (this.checkValidation == false) {
      return
    }

    this.spinner.show();
    var FileName = Date.now() + this.FilePath.name;
    const file = this.FilePath;
    const filePath = `Galler/${FileName}`;
    const fileRef = this.af.ref(filePath);
    const task = this.af.upload(`Galler/${FileName}`, file);
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
                p_PageName:'',
                p_Category: '',
                p_Ord: 0,
                p_Remark: '',
                p_DeleteFlag: 'Y',
                p_EntUser: GetUserName
              }
          
              if (PageFlag == "GALLARY") {
                obj.p_Category = "GALLARY";
                obj.p_PageName = "GALLARY";
              }
              else if (PageFlag == "RECENT_EVENT") {
                obj.p_Category = "RECENT_EVENT";
                obj.p_PageName = "RECENT_EVENT";
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
                  this.ClearData();
          
                  if (PageFlag == "GALLARY") {
                    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'GALLARY'   ORDER BY Id DESC", "GALLARY");
                  }
                  if (PageFlag == "RECENT_EVENT") {
                    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'RECENT_EVENT'   ORDER BY Id DESC", "RECENT_EVENT");
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
        if (url) {
          console.log(url);
        }
      });
  }

  async AddImage1(PageFlag) {
    let obj1 = {
      required: [
        { FieldValue: this.FilePath, FieldTitle: "Image Upload" }
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

    let ImageName = Math.random() + this.FilePath.name;
    let GetVal = [];
    let obj = {
      p_FileName: ImageName,
      p_FileType: this.FilePath.type,
      p_FileSize: this.FilePath.size,
      p_Path: 'https://firebasestorage.googleapis.com/v0/b/webmmstemp.appspot.com/o/Galler%2F' + ImageName + '?alt=media&token=ecabe17e-d884-467e-bb90-6e9c49f2f193',
      p_Category: '',
      p_Ord: 0,
      p_Remark: '',
      p_DeleteFlag: 'Y',
      p_EntUser: GetUserName
    }

    if (PageFlag == "GALLARY") {
      obj.p_Category = "GALLARY";
    }
    else if (PageFlag == "RECENT_EVENT") {
      obj.p_Category = "RECENT_EVENT";
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
        this.af.upload('/Galler/' + ImageName, this.FilePath);
        this.service.AlertSuccess('success', res.mesg);
        this.ClearData();

        if (PageFlag == "GALLARY") {
          await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'GALLARY'   ORDER BY Id DESC", "GALLARY");
        }
        if (PageFlag == "RECENT_EVENT") {
          await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'RECENT_EVENT'   ORDER BY Id DESC", "RECENT_EVENT");
        }

        this.spinner.hide();
      }
      else {
        this.service.AlertSuccess('error', res.mesg);
        this.spinner.hide();
      }
    }
  }

  ClearData() {
    this.myInputVariable.nativeElement.value = null;
  }

  DeleteData(Id,PageFlag) {
    this.service.AlertConfirm('Are you sure?', "You won't be Delete this!", "Yes, Delete it!").then(async (Resualt) => {
      if (Resualt.isConfirmed) {
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
          p_Id: Id,
          p_UpdUser: GetUserName
        }

        for (var i in obj) {
          if (obj[i] === undefined) {
            obj[i] = null;
          }
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('DeleteGalleryMaster', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            this.service.AlertSuccess('success', res.mesg);
            if (PageFlag == "GALLARY") {
              await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'GALLARY'   ORDER BY Id DESC", "GALLARY");
            }
            
            if (PageFlag == "RECENT_EVENT") {
              await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' AND Category = 'RECENT_EVENT'   ORDER BY Id DESC", "RECENT_EVENT");
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
