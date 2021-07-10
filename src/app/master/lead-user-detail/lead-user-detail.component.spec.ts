import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadUserDetailComponent } from './lead-user-detail.component';

describe('LeadUserDetailComponent', () => {
  let component: LeadUserDetailComponent;
  let fixture: ComponentFixture<LeadUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadUserDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
