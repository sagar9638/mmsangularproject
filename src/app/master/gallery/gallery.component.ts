import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Service/global.service';

@Component({
  selector: 'ngx-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  constructor(
    private service: GlobalService,
  ) { }

  ngOnInit(): void {
    this.service.Authentication();
  }

}
