import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor(
    private service: GlobalService,
  ) { }

  ngOnInit(): void {
    this.service.Authentication();
  }

}
