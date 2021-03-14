import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OneColumnLayoutComponent } from '../../@theme/layouts/one-column/one-column.layout';
import { GlobalService } from '../../Service/global.service';

declare function myfunction(params1, params2): any;
declare function myfunction1(params1, params2): any;
declare function callHandler(): any;

@Component({
  selector: 'ngx-team-managemant',
  templateUrl: './team-managemant.component.html',
  styleUrls: ['./team-managemant.component.scss']
})
export class TeamManagemantComponent implements OnInit {

  constructor(
    private router: Router,
    private service: GlobalService,
    private OneColumnLayout: OneColumnLayoutComponent
  ) { }

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
    if (get != null && get != undefined && get != "") {
      if (this.service) {
        let GetLoginRefId = this.service.GetSessionStorage("RefId");
        if (GetLoginRefId != null && GetLoginRefId != "" && GetLoginRefId != undefined) {
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
                this.nodesChaild.forEach(element => {
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
  }

  Back() {
    this.router.navigate(['master/Home']);
  }

}
