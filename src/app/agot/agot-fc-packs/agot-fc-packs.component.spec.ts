import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgotFcPacksComponent } from './agot-fc-packs.component';

describe('AgotFcPacksComponent', () => {
  let component: AgotFcPacksComponent;
  let fixture: ComponentFixture<AgotFcPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgotFcPacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgotFcPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
