/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EnergyDataService } from './energy-data.service';

describe('Service: EnergyData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnergyDataService]
    });
  });

  it('should ...', inject([EnergyDataService], (service: EnergyDataService) => {
    expect(service).toBeTruthy();
  }));
});
