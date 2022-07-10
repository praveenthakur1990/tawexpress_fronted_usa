import { TestBed } from '@angular/core/testing';

import { CartService2Service } from './cart-service2.service';

describe('CartService2Service', () => {
  let service: CartService2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
