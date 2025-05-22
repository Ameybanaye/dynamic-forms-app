import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-builder-preview',
  templateUrl: './form-builder-preview.component.html'
})
export class FormBuilderPreviewComponent {
  @Input() formData: any;
}
