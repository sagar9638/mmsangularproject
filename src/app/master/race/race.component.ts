import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  constructor(
    private service: GlobalService,
  ) { }

  ngOnInit(): void {
    this.service.Authentication();
  }

}
