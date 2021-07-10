import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallaryPopupComponent } from './gallary-popup.component';

describe('GallaryPopupComponent', () => {
  let component: GallaryPopupComponent;
  let fixture: ComponentFixture<GallaryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallaryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallaryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
