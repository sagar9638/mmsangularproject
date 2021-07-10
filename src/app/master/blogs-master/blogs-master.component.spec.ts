import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsMasterComponent } from './blogs-master.component';

describe('BlogsMasterComponent', () => {
  let component: BlogsMasterComponent;
  let fixture: ComponentFixture<BlogsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
