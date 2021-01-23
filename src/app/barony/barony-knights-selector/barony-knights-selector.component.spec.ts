import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaronyKnightsSelectorComponent } from './barony-knights-selector.component';

describe('BaronyKnightsSelectorComponent', () => {
  let component: BaronyKnightsSelectorComponent;
  let fixture: ComponentFixture<BaronyKnightsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaronyKnightsSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaronyKnightsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
