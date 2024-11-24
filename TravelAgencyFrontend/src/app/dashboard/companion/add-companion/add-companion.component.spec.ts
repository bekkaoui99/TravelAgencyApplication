import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanionComponent } from './add-companion.component';

describe('AddCompanionComponent', () => {
  let component: AddCompanionComponent;
  let fixture: ComponentFixture<AddCompanionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanionComponent]
    });
    fixture = TestBed.createComponent(AddCompanionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
