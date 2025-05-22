import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderEditorComponent } from './form-builder-editor.component';

describe('FormBuilderEditorComponent', () => {
  let component: FormBuilderEditorComponent;
  let fixture: ComponentFixture<FormBuilderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormBuilderEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBuilderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
