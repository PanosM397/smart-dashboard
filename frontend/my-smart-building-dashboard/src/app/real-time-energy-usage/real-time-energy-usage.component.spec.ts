import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeEnergyUsageComponent } from './real-time-energy-usage.component';

describe('RealTimeEnergyUsageComponent', () => {
  let component: RealTimeEnergyUsageComponent;
  let fixture: ComponentFixture<RealTimeEnergyUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealTimeEnergyUsageComponent]
    });
    fixture = TestBed.createComponent(RealTimeEnergyUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
