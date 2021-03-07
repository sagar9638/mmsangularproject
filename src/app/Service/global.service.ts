import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Http } from "@angular/http";
import { NbDialogService, NbToastrService } from '@nebular/theme';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { EditorValidator, EditorArgs } from 'angular-slickgrid';
import { Router } from '@angular/router';


const myCustomGSTValidator: EditorValidator = (value: any, args: EditorArgs) => {

  //let isValidGst = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value);

  if (!/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(value)) {
    document.getElementById('gridErrorMsg').style.backgroundColor = '#dc1e1e';
    document.getElementById('gridErrorMsg').innerText = '*  Invalid GST number please enter valid GST number..!';
    return { valid: false, msg: 'This is a required field' };
  }
  else {
    document.getElementById('gridErrorMsg').style.backgroundColor = '';
    document.getElementById('gridErrorMsg').innerText = '';
    return { valid: true, msg: '', value: value };
  }
};


const myCustomIntPhoneValidator: EditorValidator = (value: any, args: EditorArgs) => {
  const grid = args && args.grid;
  const columnEditor = args && args.column && args.column.internalColumnEditor;
  let isnum1 = /^[7-9][0-9]{9}$/.test(value);

  if (value.length > 0) {
    if (!isnum1 || value.length != 10) {
      document.getElementById('gridErrorMsg').style.backgroundColor = '#dc1e1e';
      document.getElementById('gridErrorMsg').innerText = '*  Invalid mobile number please enter valid mobile number..!';
      return { valid: false, msg: 'This field is not valid' };
    }
    else {
      document.getElementById('gridErrorMsg').style.backgroundColor = '';
      document.getElementById('gridErrorMsg').innerText = '';
      return { valid: true, msg: '' };
    }
  }
  else {
    document.getElementById('gridErrorMsg').style.backgroundColor = '';
    document.getElementById('gridErrorMsg').innerText = '';
    return { valid: true, msg: '' };
  }
};

// you can create custom validator to pass to an inline editor
const myCustomTitleValidator: EditorValidator = (value: any, args: EditorArgs) => {
  const grid = args && args.grid;
  const columnEditor = args && args.column && args.column.internalColumnEditor;
  if (value == null || value === undefined || !value.length) {
    document.getElementById('gridErrorMsg').style.backgroundColor = '#dc1e1e';
    document.getElementById('gridErrorMsg').innerText = '* This is required..!';
    return { valid: false, msg: 'This is a required field' };
  } else {
    document.getElementById('gridErrorMsg').style.backgroundColor = '';
    document.getElementById('gridErrorMsg').innerText = '';
    return { valid: true, msg: '' };
  }
};

const myCustomFloatValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  let isnum1 = /^\d+$/.test(value);
  var num = /^[0-9]+\.[0-9]+$/.test(value);

  if (value == null || value === undefined || value == '0' || !value.length || (!isnum1 && !num)) {
    document.getElementById('gridErrorMsg').style.backgroundColor = '#dc1e1e';
    document.getElementById('gridErrorMsg').innerText = '* Enter number only..!';
    return { valid: false, msg: 'This is a required field' };
  } else {
    document.getElementById('gridErrorMsg').style.backgroundColor = '';
    document.getElementById('gridErrorMsg').innerText = '';
    return { valid: true, msg: '', value: value };
  }
};



@Injectable({
  providedIn: 'root'
})
export class GlobalService {


  constructor(private http: HttpClient,
    public https: Http,
    private router: Router,
    private toastrService: NbToastrService,
    private datePipe: DatePipe) {
  }

  tokenFromUI: string = "0123456789123456";
  //baseUrl: any = 'http://localhost:8585/api/'; local url 
  baseUrl: any = 'https://mmsnodejsapi.herokuapp.com/api/'; // live url
  _global = [
    { keyName: "dd-MM-YYYY", keyValue: "dd-MM-YYYY" },
    { keyName: "yyyy-MM-dd", keyValue: "yyyy-MM-dd" },
  ];

  _arrSessionStorage = [
    { keyName: "LoginFlg", keyValue: "" },
    { keyName: "RefId", keyValue: "" },
    { keyName: "UserName", keyValue: "" },
    { keyName: "UserId", keyValue: "" },
  ];

  _arrLocalStorage = [
    { keyName: "LoginFlg", keyValue: "" },
    { keyName: "UserName", keyValue: "" },
  ];

  SetSessionStorage(key, value) {
    let ChkValue = this._arrSessionStorage.findIndex(item => item.keyName == key);
    if (ChkValue !== -1) {
      window.sessionStorage.setItem(key, this.encryptUsingAES256(value));
    }
  }

  GetSessionStorage(key) {
    return this.decryptUsingAES256(window.sessionStorage.getItem(key));//.replace(/"/g,'');
  }

  SetLocalStorage(key, value) {
    let ChkValue = this._arrLocalStorage.findIndex(item => item.keyName == key);
    if (ChkValue !== -1) {
      window.localStorage.setItem(key, this.encryptUsingAES256(value));
    }
  }

  GetLocalStorage(key) {
    return this.decryptUsingAES256(window.localStorage.getItem(key));//.replace(/"/g,'');
  }

  ClearSessionStorage() {
    this._arrLocalStorage.forEach(ele => {
      window.localStorage.removeItem(ele.keyName);
    });

    this._arrSessionStorage.forEach(ele => {
      window.sessionStorage.removeItem(ele.keyName);
    });
  }

  encryptData(value) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(this._arrSessionStorage), value).toString();
    } catch (e) {
    }
  }

  encryptUsingAES256(value) {
    let encrypted = null;
    if (value != null && value != undefined && value != "") {

      if (value[0] == '"' && value[value.length - 1] == '"') {
        value = value.substr(1, value.length - 2);
      }
      let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
      let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
      encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    }
    return encrypted;
  }

  decryptUsingAES256(value) {

    if (value != null && value != undefined && value != "") {
      let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
      let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

      return CryptoJS.AES.decrypt(
        value, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
    }

  }

  objSessionStorage(keyData, valueData) {
    try {
      let objSession = ["userName", "userPass", "coid"];
      if (objSession.indexOf(keyData) !== -1) {
        window.sessionStorage.setItem(keyData, valueData);
      }
      // if (objSession.includes(keyData)) {
      //     window.localStorage.setItem(keyData,valueData);
      //  }
      // else {
      //       return false;
      //   }  
      // return false;
    }
    catch (e) { }
  }

  // async GetDataAPI(url, obj) {
  //   try {
  //     return await this.https.post(this.baseUrl + url, obj).toPromise().then(response => response.json());
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async GetDataAPIS(route: string, method: string, data?: any) {
    try {
      let header = null;
      if (!!this.GetSessionStorage("Token")) {
        let Token = this.GetSessionStorage("Token").replace(/"/g, '');
        header = { Authorization: `Bearer ${Token}` };
      }
      return await this.http.request(method, this.baseUrl + route, {
        body: data,
        responseType: 'json',
        observe: 'body',
        headers: header
      }).toPromise().then((response: any) => response);
    } catch (error) {
      if (error.statusText == "Unauthorized" && error.status == 401) {
        this.AlertSuccess('error', error.statusText + " User.!! ");
        this.ClearSessionStorage();
        this.router.navigate(['/Register']);
      }
      return error;
    }
  }

  async getIPAddress() {
    try {
      return await this.https.get("https://jsonip.com/").toPromise();
    } catch (error) {
      return error;
    }

  }

  AlertSuccess(_icontype, _title) {
    // return Swal.fire({
    //   position: 'center',
    //   icon: _icontype,
    //   title: _title,
    //   showConfirmButton: true,
    // });

    const config = {
      status: _icontype
    };
    this.toastrService.show(_title, _icontype, config)
  }


  AlertConfirm(_title, _text, _conBtnText) {
    return Swal.fire({
      title: _title, //'Are you sure?',
      text: _text, //"You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: _conBtnText,//'Yes, delete it!'
    })
  }

  async CheckValidation(obj): Promise<boolean> {
    if (obj != undefined && obj != null && obj != "") {
      var _strMsgTitle =
        "-------------------------------\n" +
        "Below fields is required..!!\n" +
        "-------------------------------\n";
      var _strMsg = ""
      obj.required.forEach(ele => {
        if (ele.FieldValue == "" || ele.FieldValue == undefined || ele.FieldValue == null) {
          _strMsg += ele.FieldTitle + '\n';
        }
      });

      if (obj.CheckMobileNumber != undefined && obj.CheckMobileNumber != null && obj.CheckMobileNumber != "") {
        obj.CheckMobileNumber.forEach(ele => {
          let checkNo = this.CheckPhoneNumber(ele.FieldValue);
          if (checkNo == false) {
            _strMsg += '\n' + ele.FieldTitle + ' is not valid..!!\n';
          }
        });
      }

      if (_strMsg.length > 0) {
        await this.open(_strMsgTitle + _strMsg);
        return false;
      }
      else {
        return true;
      }
    }
  }

  open(strMsg) {
    // this.dialogService.open(ValidationComponent, {
    //   context: {
    //     title: 'Below fields is required..!!',
    //     _strMsg: strMsg
    //   },
    // });
    this.AlertSuccess('info', strMsg);
  }

  CheckPhoneNumber(input) {
    try {
      let ISD_CODES = [93, 355, 213, 1684, 376, 244, 1264, 672, 1268, 54, 374, 297, 61, 43, 994, 1242, 973, 880, 1246, 375, 32, 501, 229, 1441, 975, 591, 387, 267, 55, 246, 1284, 673, 359, 226, 257, 855, 237, 1, 238, 1345, 236, 235, 56, 86, 61, 61, 57, 269, 682, 506, 385, 53, 599, 357, 420, 243, 45, 253, 1767, 1809, 1829, 1849, 670, 593, 20, 503, 240, 291, 372, 251, 500, 298, 679, 358, 33, 689, 241, 220, 995, 49, 233, 350, 30, 299, 1473, 1671, 502, 441481, 224, 245, 592, 509, 504, 852, 36, 354, 91, 62, 98, 964, 353, 441624, 972, 39, 225, 1876, 81, 441534, 962, 7, 254, 686, 383, 965, 996, 856, 371, 961, 266, 231, 218, 423, 370, 352, 853, 389, 261, 265, 60, 960, 223, 356, 692, 222, 230, 262, 52, 691, 373, 377, 976, 382, 1664, 212, 258, 95, 264, 674, 977, 31, 599, 687, 64, 505, 227, 234, 683, 850, 1670, 47, 968, 92, 680, 970, 507, 675, 595, 51, 63, 64, 48, 351, 1787, 1939, 974, 242, 262, 40, 7, 250, 590, 290, 1869, 1758, 590, 508, 1784, 685, 378, 239, 966, 221, 381, 248, 232, 65, 1721, 421, 386, 677, 252, 27, 82, 211, 34, 94, 249, 597, 47, 268, 46, 41, 963, 886, 992, 255, 66, 228, 690, 676, 1868, 216, 90, 993, 1649, 688, 1340, 256, 380, 971, 44, 1, 598, 998, 678, 379, 58, 84, 681, 212, 967, 260, 263],
        //extract numbers from string
        thenum = input.match(/[0-9]+/g).join(""),
        totalnums = thenum.length,
        last10Digits = parseInt(thenum) % 10000000000,
        ISDcode = thenum.substring(0, totalnums - 10);

      //phone numbers are generally of 8 to 16 digits
      if (totalnums >= 8 && totalnums <= 16) {
        if (ISDcode) {
          if (ISD_CODES.includes(parseInt(ISDcode))) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    } catch (e) { }
    return false;
  }

  //Added By Dipika Patel on 15/06/2020 4.00 pm
  async GlobalDateFormat(input, _dateFormat) {
    const result = await this.datePipe.transform(input, _dateFormat);

    return await result;
  }

  //Added By Sagar J Patel On Date 06/20/2020 04:22 PM For Get Global Value 
  GetGlobalValue(_keyName) {
    return this._global.filter(item => item.keyName == _keyName)[0].keyValue;
  }

  // //Added By Dipika Patel on 15/06/2020 5.25 pm
  //  GetDecimal(value,locale)
  //  {
  //     let result;
  //     result = this.decimalPipe.transform(value,'2', locale);
  //     return result;
  //  }

  //=========Added By Dipika Patel on 19/06/2020 10.36 am
  GetCurrnetDate() {
    let CurrentDate = new Date();
    return this.datePipe.transform(CurrentDate, 'yyyy-MM-dd');
  }

  GetCurrnetDateTime() {
    let CurrentDate = new Date();
    let CurrentDateFinal = this.datePipe.transform(CurrentDate, 'dd-MM-yyyy hh:mm:ss');
    return CurrentDateFinal;
  }
  //======Added By Dipika Patel on 19/06/2020 10.36 am




  change(val) {
    var inputvalues = val;
    var gstinformat = new RegExp('/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/');
    if (gstinformat.test(inputvalues)) {
      return true;
    } else {
      alert('Please Enter Valid GSTIN Number');

    }
  };

  GetGridData(DataSource: any = []) {
    var _retStrCondition = "";
    if (DataSource != null && DataSource != undefined && DataSource.length > 0) {
      DataSource.forEach(ele => {
        var _strCondition = "";
        for (var i in ele) {
          if (i != "id") {
            _strCondition += i + " == \"\" && ";
          }
        }
        _strCondition = _strCondition.slice(0, -3);

        if (_retStrCondition == "") {
          _retStrCondition = _strCondition;
          console.log("_getIfStr", _retStrCondition);
        }
      });

    }
  }

  validation() {

    $(".ReqiredTextBox").each(function () {
      $(this).blur(function () {
        let GetID = $(this)[0].id;
        // console.log('$(this).val()',$(this));
        // console.log('GetID',GetID);

        // if($(this)[0].nodeName == 'NB-SELECT')
        // {
        //   if ($(this)[0].innerText == "")
        //   {
        //     document.getElementById(GetID).style.border = "1px solid red";
        //   }
        //   else
        //   {
        //     document.getElementById(GetID).style.border = "1px solid green";
        //   }
        // }
        // else{
        if ($(this).val() == "") {
          document.getElementById(GetID).style.borderColor = "red";
          document.getElementById(GetID).focus();
          document.getElementById('ErrorMsg').style.backgroundColor = '#dc1e1e';
          document.getElementById('ErrorMsg').style.display = 'flex';
          document.getElementById('ErrorMsg').innerText = '* This is required..!';
        }
        else {
          document.getElementById(GetID).style.borderColor = "#141414";
          document.getElementById('ErrorMsg').style.backgroundColor = '';
          document.getElementById('ErrorMsg').style.display = 'none';
          document.getElementById('ErrorMsg').innerText = '';

        }
      });
    });


    $(".ReqiredComboBox").each(function () {

      $(this).focusout(function () {
        let GetID = $(this)[0].id;
        if ($(this).attr('ng-reflect-model') == undefined) {
          document.getElementById(GetID).style.border = '1px solid red';
          document.getElementById('ErrorMsg').style.backgroundColor = '#dc1e1e';
          document.getElementById('ErrorMsg').style.display = 'flex';
          document.getElementById('ErrorMsg').innerText = '* This is required..!';
        }
        else {
          document.getElementById(GetID).style.border = "0px solid #141414";
          document.getElementById('ErrorMsg').style.backgroundColor = '';
          document.getElementById('ErrorMsg').style.display = 'none';
          document.getElementById('ErrorMsg').innerText = '';
        }
      });
    });


    $(".MobailNoCheck").each(function () {
      $(this).keypress(function (event) {
        return /\d/.test(String.fromCharCode(event.keyCode));
      });
      $(this).attr('maxlength', '10');
      $(this).attr('minlength', '10');
      $(this).blur(function () {
        let GetID = $(this)[0].id;
        let aa = $(this).val();
        let filter = /^[7-9][0-9]{9}$/;
        if (aa != "") {
          if (filter.test(aa.toString())) {
            document.getElementById(GetID).style.borderColor = "#141414";
            document.getElementById('ErrorMsg').style.backgroundColor = '';
            document.getElementById('ErrorMsg').style.display = 'none';
            document.getElementById('ErrorMsg').innerText = '';
          }
          else {
            document.getElementById(GetID).style.borderColor = "red";
            document.getElementById(GetID).focus();
            document.getElementById('ErrorMsg').style.backgroundColor = '#dc1e1e';
            document.getElementById('ErrorMsg').style.display = 'flex';
            document.getElementById('ErrorMsg').innerText = '*  Invalid mobile number please enter valid mobile number..!';
          }
        }
        else {
          document.getElementById(GetID).style.borderColor = "#141414";
          document.getElementById('ErrorMsg').style.backgroundColor = '';
          document.getElementById('ErrorMsg').style.display = 'none';
          document.getElementById('ErrorMsg').innerText = '';
        }
      });
    });

    $(".GSTNoCheck").each(function () {
      $(this).attr('maxlength', '15');
      $(this).attr('minlength', '15');
      $(this).keyup(function () {
        $(this).val($(this).val().toString().toUpperCase());
      });
      $(this).blur(function () {
        let GetID = $(this)[0].id;
        let aa = $(this).val();
        let filter = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
        if (aa != "") {
          if (filter.test(aa.toString())) {
            document.getElementById(GetID).style.borderColor = "#141414";
            document.getElementById('ErrorMsg').style.backgroundColor = '';
            document.getElementById('ErrorMsg').innerText = '';
          }
          else {
            document.getElementById(GetID).style.borderColor = "red";
            document.getElementById(GetID).focus();
            document.getElementById('ErrorMsg').style.backgroundColor = '#dc1e1e';
            document.getElementById('ErrorMsg').innerText = '*  Invalid GST number please enter valid GST number..!';
          }
        }
        else {
          document.getElementById(GetID).style.borderColor = "#141414";
          document.getElementById('ErrorMsg').style.backgroundColor = '';
          document.getElementById('ErrorMsg').innerText = '';
        }
      });


    });

    $(".DateCheck").each(function () {
      $(this)[0].addEventListener('keydown', function (e) {
        if (e.which != 8 && e.which != 9) {
          e.preventDefault();
          return false;
        }
      }, false);
    });


    $(".TextUpperCase").each(function () {
      $(this).keyup(function () {
        $(this).val($(this).val().toString().toUpperCase());
      });
    });

    $('.DecimalCheck').keypress(function (event) {
      var $this = $(this);
      if ((event.which != 46 || $this.val().toString().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
          (event.which != 0 && event.which != 8))) {
        event.preventDefault();
      }
      var text = $(this).val();
      if ((event.which == 46) && (text.toString().indexOf('.') == -1)) {
        setTimeout(function () {
          if ($this.val().toString().substring($this.val().toString().indexOf('.')).length > 3) {
            $this.val($this.val().toString().substring(0, $this.val().toString().indexOf('.') + 3));
          }
        }, 1);
      }
      if ((text.toString().indexOf('.') != -1) &&
        (text.toString().substring(text.toString().indexOf('.')).length > 2) &&
        (event.which != 0 && event.which != 8)) {
        event.preventDefault();
      }
    });

    $('.DecimalCheck').bind("paste", function (e) {
      var $this = $(this);
      var text = $this.val();
      if ($.isNumeric(text)) {
        if ((text.toString().substring(text.toString().indexOf('.')).length > 3) && (text.toString().indexOf('.') > -1)) {
          e.preventDefault();
          $(this).val(text.toString().substring(0, text.toString().indexOf('.') + 3));
        }
      }
      else {
        e.preventDefault();
      }
    });

    $(".panCheck").each(function () {
      $(this).attr('maxlength', '10');
      $(this).attr('minlength', '10');
      $(this).keyup(function () {
        $(this).val($(this).val().toString().toUpperCase());
      });
      $(this).blur(function () {
        let GetID = $(this)[0].id;
        let aa = $(this).val();
        let filter = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (aa != "") {
          if (filter.test(aa.toString())) {
            document.getElementById(GetID).style.borderColor = "#141414";
            document.getElementById('ErrorMsg').style.backgroundColor = '';
            document.getElementById('ErrorMsg').innerText = '';
          }
          else {
            document.getElementById(GetID).style.borderColor = "red";
            document.getElementById(GetID).focus();
            document.getElementById('ErrorMsg').style.backgroundColor = '#dc1e1e';
            document.getElementById('ErrorMsg').innerText = '*  Invalid PAN number please enter valid GST number..!';
          }
        }
        else {
          document.getElementById(GetID).style.borderColor = "#141414";
          document.getElementById('ErrorMsg').style.backgroundColor = '';
          document.getElementById('ErrorMsg').innerText = '';
        }
      });
    });



    $(".panCheckReq").each(function () {
      $(this).attr('maxlength', '10');
      $(this).attr('minlength', '10'); 3
      $(this).keyup(function () {
        $(this).val($(this).val().toString().toUpperCase());
      });
      $(this).blur(function () {
        let GetID = $(this)[0].id;
        let aa = $(this).val();
        let filter = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (aa != "") {
          if (filter.test(aa.toString())) {
            document.getElementById(GetID).style.borderColor = "#141414";
            document.getElementById('ErrorMsg').style.backgroundColor = '';
            document.getElementById('ErrorMsg').innerText = '';
          }
          else {
            document.getElementById(GetID).style.borderColor = "red";
            document.getElementById(GetID).focus();
            document.getElementById('ErrorMsg').style.backgroundColor = '#dc1e1e';
            document.getElementById('ErrorMsg').innerText = '*  Invalid PAN number please enter valid PAN number..!';
          }
        }
        else {
          document.getElementById(GetID).style.borderColor = "red";
          document.getElementById(GetID).focus();
          document.getElementById('ErrorMsg').style.backgroundColor = '#dc1e1e';
          document.getElementById('ErrorMsg').innerText = '* PAN is required ';

        }
      });
    });

  }

  clearValidationMsg() {
    document.getElementById('ErrorMsg').style.backgroundColor = '';
    document.getElementById('ErrorMsg').innerText = '';
    document.getElementById('gridErrorMsg').style.backgroundColor = '';
    document.getElementById('gridErrorMsg').innerText = '';
  }

  gridGSTnoValidation() {
    return myCustomGSTValidator;
  }

  gridMobileNoCheckValidation() {
    return myCustomIntPhoneValidator;
  }

  gridReqiredValidation() {
    return myCustomTitleValidator;
  }

  getmyCustomFloatValidator() {
    return myCustomFloatValidator;
  }

  getFormName() {
    return this.GetSessionStorage("FormName").replace(/"/g, '');
  }

  async checkUserCrudRights(FormName, CrudFlg): Promise<boolean> {
    try {
      let obj = {
        p_criteria: " UPPER(u.user_id) =  UPPER(''" + this.GetSessionStorage("User_ID").replace(/"/g, '') + "'') and mm.obj_title = ''" + FormName + "'' ",
      }
      let getResualt = await this.GetDataAPIS('global/FetchUserRightsData', 'Post', obj);

      if (getResualt.length != 0) {
        if (CrudFlg == 'I') {
          let flgVal = getResualt[0].i_flg;
          if (flgVal == "Y") {
            return true;
          } else {
            return false;
          }
        } else if (CrudFlg == 'U') {
          let flgVal = getResualt[0].u_flg;
          if (flgVal == "Y") {
            return true;
          } else {
            return false;
          }
        } else if (CrudFlg == 'D') {
          let flgVal = getResualt[0].d_flg;
          if (flgVal == "Y") {
            return true;
          } else {
            return false;
          }
        } else if (CrudFlg == 'V') {
          let flgVal = getResualt[0].v_flg;
          if (flgVal == "Y") {
            return true;
          } else {
            return false;
          }
        }

      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  checkUserCrudErrorMsg(CrudMsgFlg) {
    if (CrudMsgFlg == "I") {
      this.AlertSuccess('warning', 'You have no rights for insert record..!');
    } else if (CrudMsgFlg == "U") {
      this.AlertSuccess('warning', 'You have no rights for update record..!');
    } else if (CrudMsgFlg == "D") {
      this.AlertSuccess('warning', 'You have no rights for delete record..!');
    } else if (CrudMsgFlg == "V") {
      this.AlertSuccess('warning', 'You have no rights for view..!');
    }
  }

  SetheaderDisplayFlag(_SetheaderDisplayFlag: boolean = true) {
    return _SetheaderDisplayFlag;
  }

  Authentication() {
    let GetLoginFlag = this.GetSessionStorage("LoginFlg");
    if (GetLoginFlag == undefined && GetLoginFlag == null) {
          this.router.navigate(['master/login']);
      }
    
  }

}
