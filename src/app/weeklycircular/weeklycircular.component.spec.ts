import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklycircularComponent } from './weeklycircular.component';

describe('WeeklycircularComponent', () => {
  let component: WeeklycircularComponent;
  let fixture: ComponentFixture<WeeklycircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklycircularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklycircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
