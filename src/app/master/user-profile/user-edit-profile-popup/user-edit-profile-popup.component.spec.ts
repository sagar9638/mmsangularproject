import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditProfilePopupComponent } from './user-edit-profile-popup.component';

describe('UserEditProfilePopupComponent', () => {
  let component: UserEditProfilePopupComponent;
  let fixture: ComponentFixture<UserEditProfilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEditProfilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
