import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDayTripComponent } from './add-day-trip.component';

describe('AddDayTripComponent', () => {
  let component: AddDayTripComponent;
  let fixture: ComponentFixture<AddDayTripComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDayTripComponent]
    });
    fixture = TestBed.createComponent(AddDayTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
