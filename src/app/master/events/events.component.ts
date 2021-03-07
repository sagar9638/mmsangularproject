import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  constructor(
    private service: GlobalService,
  ) { }

  ngOnInit(): void {
    this.service.Authentication();
  }

}
