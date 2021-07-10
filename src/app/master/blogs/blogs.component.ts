import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NewsPost } from '../../pages/layout/news.service';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  constructor(
    private service: GlobalService,
    private http: HttpClient
  ) { }
  resBlogs : any = [];
  async ngOnInit(): Promise<void> {
    this.service.Authentication();
     this.resBlogs = await this.http.get<NewsPost[]>('assets/data/blogs.json').toPromise().then((response: any) => response);
  }

}
