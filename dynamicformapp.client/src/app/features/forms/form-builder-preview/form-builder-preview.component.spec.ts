import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderPreviewComponent } from './form-builder-preview.component';

describe('FormBuilderPreviewComponent', () => {
  let component: FormBuilderPreviewComponent;
  let fixture: ComponentFixture<FormBuilderPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormBuilderPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBuilderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
