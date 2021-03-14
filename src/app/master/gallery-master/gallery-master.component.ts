import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-gallery-master',
  templateUrl: './gallery-master.component.html',
  styleUrls: ['./gallery-master.component.scss']
})
export class GalleryMasterComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private spinner: NgxSpinnerService,
    private af: AngularFireStorage,
  ) { }

  checkValidation: boolean = false;

  FilePath: any;
  ImageUpload: any;

  ArrayGallaryData = [];

  async ngOnInit(): Promise<void> {
    this.service.Authentication();
    await this.GetGallaryMasterData(" AND DeleteFlag = 'Y'  ORDER BY Id DESC");
  }

  async GetGallaryMasterData(Condition) {
    this.ArrayGallaryData = [];
    let objBody = [
      {
        p_Condition: Condition
      }
    ]

    let res = await this.service.GetDataAPIS('GetGalleryMasterData', 'Post', objBody);
    if (!!res) {
      if (res.length > 0) {
        this.ArrayGallaryData = res;
        this.ArrayGallaryData = [...this.ArrayGallaryData];
      } else {
        this.service.AlertSuccess('error', "No Data Found..!!");
      }
    } else {
      this.service.AlertSuccess('error', "No Data Found..!!");
    }
  }

  upload($event) {
    this.FilePath = $event.target.files[0];
  }

  async AddImage() {
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

    let ImageName = Math.random() + this.FilePath.name
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
        await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' ORDER BY Id DESC");
        this.spinner.hide();
      }
      else {
        this.service.AlertSuccess('error', res.mesg);
        this.spinner.hide();
      }
    }
  }

  ClearData() {
    this.ImageUpload = null;
  }

  DeleteData(Id) {
    alert(Id);
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
            await this.GetGallaryMasterData(" AND DeleteFlag = 'Y' ORDER BY Id DESC");
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
