import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActionCellComponent } from './form-action-cell.component';

describe('FormActionCellComponent', () => {
  let component: FormActionCellComponent;
  let fixture: ComponentFixture<FormActionCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormActionCellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormActionCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
