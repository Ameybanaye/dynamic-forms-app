import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormApiService, FormField } from '../../../core/api/form-api.service.ts.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingDialogComponent } from '../../../shared/loading-dialog/loading-dialog.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent {
  constructor(private fb: FormBuilder, private formApi: FormApiService, private route: ActivatedRoute, private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  formId: number | null = null;

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    privacyPolicy: [''],
    bannerUrl: [''],
    fields: this.fb.array([] as FormGroup[])
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formId = +id;
      this.loadForm(this.formId);
    }
  }


  loadForm(id: number) {
    this.formApi.getForm(id).subscribe(form => {
      this.form.patchValue({
        title: form.title,
        description: form.description,
        privacyPolicy: form.privacyPolicy,
        bannerUrl: this.getBannerUrl(form.bannerUrl)
      });

      const fields = form.fields.map(f =>
        this.fb.group({
          label: [f.label, Validators.required],
          type: [f.type],
          isRequired: [f.isRequired],
          min: [f.min ?? null],
          max: [f.max ?? null],
          allowAlphabetOnly: [f.allowAlphabetOnly],
          validationMode: [f.validationMode ?? 'open'],
          customSpecialChars: [f.customSpecialChars ?? ''],
          options: this.fb.array(
            f.type === 'dropdown' || f.type === 'checkbox'
              ? f.options.map(opt =>
                this.fb.control(typeof opt === 'string' ? opt : opt.value, Validators.required)
              )
              : []
          )
        })
      );

      const formArray: FormArray<FormGroup> = this.fb.array(fields) as FormArray<FormGroup>;
      this.form.setControl('fields', formArray);
    });
  }

  get fields() {
    return this.form.get('fields') as FormArray;
  }

  addField(type: 'dropdown' | 'checkbox') {
    this.fields.push(
      this.fb.group({
        label: ['', Validators.required],
        type: [type],
        isRequired: [false],
        options: this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required)
        ])
      })
    );
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  addOption(fieldIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }


  getOptions(fieldIndex: number): FormArray {
    return this.fields.at(fieldIndex).get('options') as FormArray;
  }


  submitForm() {
    if (this.form.invalid) {
      this.snackBar.open('Please complete all required fields.', 'Close', { duration: 3000 });
      return;
    }

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
        options: f.type === 'dropdown' || f.type === 'checkbox'
          ? f.options.map(opt => ({ value: opt }))
          : []
      }))
    };

    const request = this.formId
      ? this.formApi.updateForm(this.formId, payload)
      : this.formApi.createForm(payload);

    request.subscribe({
      next: () => {
        dialogRef.close();
        this.snackBar.open(`Form ${this.formId ? 'updated' : 'saved'} successfully`, 'Close', { duration: 3000 });

      },
      error: (err: any) => {
        dialogRef.close();
        console.error('Form save failed', err);
      }
    });

  }


  getBannerUrl(fileName: string | undefined): string {
    console.log('getBannerUrl', `${environment.apiUrl}/Image/${fileName}`);

    if (!fileName) {
      return '';
    }
    return `${environment.apiUrl}/Image/${fileName}`;
  }
}
