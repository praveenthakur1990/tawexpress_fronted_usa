import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreWeeklyCircularComponent } from './store-weekly-circular.component';

describe('StoreWeeklyCircularComponent', () => {
  let component: StoreWeeklyCircularComponent;
  let fixture: ComponentFixture<StoreWeeklyCircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreWeeklyCircularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreWeeklyCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
