import { TestBed } from '@angular/core/testing';

import { SpecialofferService } from './specialoffer.service';

describe('SpecialofferService', () => {
  let service: SpecialofferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialofferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
