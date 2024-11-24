import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTripComponent } from './day-trip.component';

describe('DayTripComponent', () => {
  let component: DayTripComponent;
  let fixture: ComponentFixture<DayTripComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayTripComponent]
    });
    fixture = TestBed.createComponent(DayTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
