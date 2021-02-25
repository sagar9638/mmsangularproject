import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagemantComponent } from './team-managemant.component';

describe('TeamManagemantComponent', () => {
  let component: TeamManagemantComponent;
  let fixture: ComponentFixture<TeamManagemantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamManagemantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamManagemantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
