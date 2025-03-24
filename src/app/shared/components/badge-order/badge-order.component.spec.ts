import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeOrderComponent } from './badge-order.component';

describe('BadgeOrderComponent', () => {
  let component: BadgeOrderComponent;
  let fixture: ComponentFixture<BadgeOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
