import { TestBed } from '@angular/core/testing';

import { StoreAuthGuard } from './store-auth.guard';

describe('StoreAuthGuard', () => {
  let guard: StoreAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StoreAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
