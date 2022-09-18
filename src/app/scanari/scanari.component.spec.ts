import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanariComponent } from './scanari.component';

describe('ScanariComponent', () => {
  let component: ScanariComponent;
  let fixture: ComponentFixture<ScanariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanariComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
