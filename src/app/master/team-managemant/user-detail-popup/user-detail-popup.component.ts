import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-user-detail-popup',
  templateUrl: './user-detail-popup.component.html',
  styleUrls: ['./user-detail-popup.component.scss']
})
export class UserDetailPopupComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<UserDetailPopupComponent>
  ) { }

  @Input() UserDetail = [];


  ngOnInit(): void {
    console.log('UserDetail', this.UserDetail);
    if (this.UserDetail.length > 0) {

    }
  }

  Back() {
    if (!!this.ref) {
      this.ref.close();
    }
  }

}
