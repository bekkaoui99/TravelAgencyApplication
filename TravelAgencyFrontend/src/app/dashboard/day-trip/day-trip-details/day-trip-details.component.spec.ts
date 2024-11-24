import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTripDetailsComponent } from './day-trip-details.component';

describe('DayTripDetailsComponent', () => {
  let component: DayTripDetailsComponent;
  let fixture: ComponentFixture<DayTripDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayTripDetailsComponent]
    });
    fixture = TestBed.createComponent(DayTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
