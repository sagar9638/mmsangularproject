import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NewsPost } from '../../pages/layout/news.service';
import { GlobalService } from '../../Service/global.service';


@Component({
  selector: 'ngx-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private http: HttpClient
  ) { }
  resNews : any = [];
  async ngOnInit(): Promise<void> {
    this.service.Authentication();
     this.resNews = await this.http.get<NewsPost[]>('assets/data/news.json').toPromise().then((response: any) => response);
  }

}
