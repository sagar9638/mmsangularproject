import { AfterViewInit, ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OneColumnLayoutComponent } from '../../@theme/layouts/one-column/one-column.layout';
import { GlobalService } from '../../Service/global.service';
declare function myfunction(params1, params2): any;
declare function myfunction1(params1, params2): any;
declare function callHandler(): any;


@Component({
  selector: 'ngx-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('treeValue') _tree: ElementRef;

  constructor(
    private router: Router,
    private service: GlobalService,
    private OneColumnLayout: OneColumnLayoutComponent
  ) { }

  // nodes = [
  //   { id: 1, name: "Sagar", title: "Chairman and CEO", email: "amber@domain.com", img: "https://cdn.balkan.app/shared/1.jpg" },
  //   { id: 2, pid: 1, name: "Lexie Cole", title: "QA Lead", email: "ava@domain.com", img: "https://cdn.balkan.app/shared/2.jpg" },
  //   { id: 3, pid: 1, name: "Janae Barrett", title: "Technical Director", img: "https://cdn.balkan.app/shared/3.jpg" },
  //   { id: 4, pid: 1, name: "Aaliyah Webb", title: "Manager", email: "jay@domain.com", img: "https://cdn.balkan.app/shared/4.jpg" },
  //   { id: 5, pid: 2, name: "Elliot Ross", title: "QA", img: "https://cdn.balkan.app/shared/5.jpg" },
  //   { id: 6, pid: 2, name: "Anahi Gordon", title: "QA", img: "https://cdn.balkan.app/shared/6.jpg" },
  //   { id: 7, pid: 2, name: "Knox Macias", title: "QA", img: "https://cdn.balkan.app/shared/7.jpg" },
  //   { id: 8, pid: 3, name: "Nash Ingram", title: ".NET Team Lead", email: "kohen@domain.com", img: "https://cdn.balkan.app/shared/8.jpg" },
  //   { id: 9, pid: 3, name: "Sage Barnett", title: "JS Team Lead", img: "https://cdn.balkan.app/shared/9.jpg" },
  //   { id: 10, pid: 8, name: "Alice Gray", title: "Programmer", img: "https://cdn.balkan.app/shared/10.jpg" },
  //   { id: 11, pid: 8, name: "Anne Ewing", title: "Programmer", img: "https://cdn.balkan.app/shared/11.jpg" },

  // ];

  nodes: any = [];
  nodesChaild: any = [];
  classNameTree = "col-md-12";
  classNameTreeChild = "";
  TreeChildFlag: boolean = true;
  async ngOnInit(): Promise<void> {
    
    if (this.OneColumnLayout) {
      this.OneColumnLayout.headerDisplayFlag = false;
    }
    this.service.Authentication();

    if (this.service) {
      let GetLoginRefId = this.service.GetSessionStorage("RefId");
      if (GetLoginRefId != null && GetLoginRefId != "" && GetLoginRefId != undefined) {
        let GetLoginUserId = this.service.GetSessionStorage("UserId").replace(/["']/g, "");
        let GetVal = [];
        let obj = {
          RefId: GetLoginRefId.replace(/["']/g, "")
        }
        GetVal.push(obj);

        let res = await this.service.GetDataAPIS('MembersHierarchy', 'Post', GetVal);
        if (res != null && res != undefined && res != "") {
          if (res.flag == true) {
            if (res.recordset.length != 0) {
              let _tempNodes = [];
              this.nodes = await res.recordset;
              this.nodes.forEach(element => {
                if (element.id == parseInt(GetLoginUserId)) {
                  delete element.pid;
                  _tempNodes.push(element)
                } else {
                  _tempNodes.push(element)
                }
              });
              await myfunction(_tempNodes, 'tree');
              this.TreeChildFlag = false;
            }
          }
        }

      } else {
        this.service.AlertSuccess('info', 'Please first join our team..!!')
        this.Back();
      }
    }



  }

  async toggle(e) {
    let get = callHandler()
    console.log('get', get);

    if (get != null && get != undefined && get != "") {
      if (this.service) {
        let GetLoginRefId = this.service.GetSessionStorage("RefId");
        if (GetLoginRefId != null && GetLoginRefId != "" && GetLoginRefId != undefined) {
          console.log('this.nodes1111111', this.nodes);
          let GetPNode = this.nodes.filter(item => item.id == get.node.id)[0].RefId;
          let GetVal = [];
          let obj = {
            RefId: GetPNode//get.node.id
          }
          GetVal.push(obj);

          let res = await this.service.GetDataAPIS('MembersHierarchy', 'Post', GetVal);
          if (res != null && res != undefined && res != "") {
            if (res.flag == true) {
              if (res.recordset.length != 0) {
                this.TreeChildFlag = true;
                let _tempNodes = [];
                this.nodesChaild = await res.recordset;
                 this.nodesChaild.forEach(element  => {
                  if (element.id == parseInt(get.node.id)) {
                    delete element.pid;
                    _tempNodes.push(element)
                  } else {
                    _tempNodes.push(element)
                  }
                });
                this.classNameTree = await "col-md-6";
                this.classNameTreeChild = await "col-md-6";

                await myfunction1(_tempNodes, 'treeChild');
              }
            }
          }

        } else {
          this.service.AlertSuccess('info', 'Please first join our team..!!')
          this.classNameTree = "col-md-12";
          this.classNameTreeChild = "";
          this.TreeChildFlag = false;
          this.Back();

        }
      }
    }
  }

  ngAfterViewInit() {
    // if (this._tree.nativeElement.innerHTML == "") {
    //   window.location.reload();
    // }
  }


  Back() {
    //this.router.navigate(['master/dashboard']);--SAG
    this.router.navigate(['master/Home']);
  }

}
