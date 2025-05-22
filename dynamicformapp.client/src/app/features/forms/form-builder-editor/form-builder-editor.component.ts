import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { FormApiService, FormField } from '../../../core/api/form-api.service.ts.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingDialogComponent } from '../../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-form-builder-editor',
  templateUrl: './form-builder-editor.component.html'
})
export class FormBuilderEditorComponent {
  @Input() form!: FormGroup;
  activeIndex: number | null = null;

  constructor(private fb: FormBuilder, private formApi: FormApiService, private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  get fields(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  addField(type: 'dropdown' | 'checkbox' | 'text' | 'numeric') {
    this.fields.push(this.fb.group({
      label: ['', Validators.required],
      type: [type],
      isRequired: [false],
      options: (type === 'dropdown' || type === 'checkbox')
        ? this.fb.array([
          this.fb.control('Option 1'),
          this.fb.control('Option 2')
        ])
        : this.fb.array([]),
      min: [null],
      max: [null],
      allowAlphabetOnly: [false],
      validationMode: ['open'],
      customSpecialChars: [''],
    }));
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  addOption(fieldIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  getOptions(index: number): FormArray {
    return this.fields.at(index).get('options') as FormArray;
  }

  getOptionControl(fieldIndex: number, optionIndex: number): FormControl {
    return (this.fields.at(fieldIndex).get('options') as FormArray).at(optionIndex) as FormControl;
  }

  removeOption(fieldIndex: number, optionIndex: number) {
    const options = this.getOptions(fieldIndex);
    if (options.length > 2) {
      options.removeAt(optionIndex);
    }
  }


  setActive(index: number) {
    this.activeIndex = index;
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  onDrop(event: CdkDragDrop<any[]>) {
    const fieldsArray = this.fields;
    moveItemInArray(fieldsArray.controls, event.previousIndex, event.currentIndex);
    fieldsArray.updateValueAndValidity(); // Optional, but good to call
  }

  submitForm() {
    if (this.form.invalid) {
      this.snackBar.open('Please complete all required fields.', 'Close', { duration: 3000 });
      return;
    }
    console.log('Form submitted:', this.form.value);
    const invalidDropdowns = this.fields.controls.filter(field => {

      const type = field.get('type')?.value;
      const options = field.get('options')?.value || [];
      return type === 'dropdown' && options.filter((o: string) => o?.trim()).length < 2;
    });

    if (invalidDropdowns.length > 0) {
      this.snackBar.open('All dropdowns must have at least 2 non-empty options.', 'Close', { duration: 4000 });
      return;
    }

    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    const payload = {
      ...this.form.value,
      fields: (this.form.value.fields as FormField[]).map((f: FormField) => ({
        ...f,
        options: f.type === 'dropdown'
          ? f.options.map(opt => ({ value: opt }))
          : [] // checkbox doesn't use options
      }))
    };

    this.formApi.createForm(payload).subscribe({
      next: () => {
        dialogRef.close();
        this.snackBar.open('Form saved successfully!', 'Close', { duration: 3000 });
      },
      error: err => {
        dialogRef.close();
        console.error('Form save failed', err);
        this.snackBar.open('Something went wrong. Try again.', 'Close', { duration: 3000 });
      }
    });
  }

  onBannerSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.formApi.uploadBanner(formData).subscribe({
      next: res => this.form.patchValue({ bannerUrl: res.url }),
      error: () => this.snackBar.open('Image upload failed', 'Close', { duration: 3000 })
    });
  }


}
