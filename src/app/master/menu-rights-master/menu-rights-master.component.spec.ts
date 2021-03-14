import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRightsMasterComponent } from './menu-rights-master.component';

describe('MenuRightsMasterComponent', () => {
  let component: MenuRightsMasterComponent;
  let fixture: ComponentFixture<MenuRightsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuRightsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuRightsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
