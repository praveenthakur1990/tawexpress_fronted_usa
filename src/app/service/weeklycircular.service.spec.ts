import { TestBed } from '@angular/core/testing';

import { WeeklycircularService } from './weeklycircular.service';

describe('WeeklycircularService', () => {
  let service: WeeklycircularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklycircularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
