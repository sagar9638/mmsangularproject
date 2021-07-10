import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsMasterComponent } from './events-master.component';

describe('EventsMasterComponent', () => {
  let component: EventsMasterComponent;
  let fixture: ComponentFixture<EventsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
