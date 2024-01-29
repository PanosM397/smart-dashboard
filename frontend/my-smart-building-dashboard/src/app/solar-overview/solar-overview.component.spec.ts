import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarOverviewComponent } from './solar-overview.component';

describe('SolarOverviewComponent', () => {
  let component: SolarOverviewComponent;
  let fixture: ComponentFixture<SolarOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolarOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
