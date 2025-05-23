import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormModel, FormApiService } from '../../../core/api/form-api.service.ts.service';
import { FormResponseApiService } from '../../../core/api/form-response-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../../shared/loading-dialog/loading-dialog.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-form-submission',
  templateUrl: './form-submission.component.html'
})
export class FormSubmissionComponent implements OnInit {
  formDefinition!: FormModel;
  formGroup!: FormGroup;
  formSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private formApi: FormApiService,
    private fb: FormBuilder,
    private responseApi: FormResponseApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const publicId = this.route.snapshot.paramMap.get('publicId');
    this.formApi.getFormByPublicId(publicId!).subscribe(def => {
      this.formDefinition = def;
      this.buildForm(def);
    });
  }

  buildForm(def: FormModel) {
    const group: any = {};
    def.fields.forEach(f => {
      if (f.type === 'dropdown') {
        group[f.label!] = [null, f.isRequired ? Validators.required : null];
      } else if (f.type === 'checkbox') {
        const controls = f.options.map(() => this.fb.control(false));
        const arr = this.fb.array(controls);
        if (f.isRequired) arr.setValidators(this.minSelectedCheckboxes(1));
        group[f.label!] = arr;
      } else if (f.type === 'text') {
        const label = f.label!.toLowerCase();
        const validators = [];

        if (f.isRequired) validators.push(Validators.required);

        if (label.includes('email')) {
          validators.push(Validators.email);
        }

        if (this.isMobileNumberField(label)) {
          validators.push(Validators.pattern(/^[0-9]{10}$/)); // 10-digit numeric pattern
        }
        //
        switch (f.validationMode) {
          case 'alpha':
            validators.push(Validators.pattern(/^[\p{L}\s]+$/u));
            break;
          case 'alpha-special':
            const specialChars = f.customSpecialChars ?? '';
            const escapedChars = specialChars.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
            const regex = new RegExp(`^[A-Za-z\\s${escapedChars}]+$`);
            validators.push(Validators.pattern(regex));
            break;
          case 'alpha-numeric':
            validators.push(Validators.pattern(/^[A-Za-z0-9\s]+$/));
            break;
          case 'open':
          default:
            break; // no pattern
        }

        group[f.label!] = ['', validators];

      }
      else if (f.type === 'numeric') {
        const validators = [];

        if (f.isPhoneNumber) {
          validators.push(Validators.pattern(/^[6-9]\d{9}$/));
        } else {

          if (f.isRequired) validators.push(Validators.required);
          if (f.min != null) validators.push(Validators.min(f.min));
          if (f.max != null) validators.push(Validators.max(f.max));
        }


        group[f.label!] = [null, validators];
      }
    });
    this.formGroup = this.fb.group(group);


  }

  isMobileNumberField(label: string): boolean {
    return false;
    const lower = label.toLowerCase();
    return lower.includes('phone') || lower.includes('mobile') || lower.includes('number');
  }

  submit() {
    if (this.formGroup.invalid || !this.formDefinition?.id) return;


    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    const transformed = this.transformFormValues();
    const payload = {
      formId: this.formDefinition.id,
      responseJson: JSON.stringify(transformed)
    };

    this.responseApi.submitResponse(payload).subscribe({
      next: res => {
        dialogRef.close();
        this.snackBar.open('Response submitted!', 'Close', { duration: 3000 });
        this.formSubmitted = true;
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error submitting response', 'Close');
      }
    });
  }

  getOptionValue(opt: string | { value: string }): string {
    return typeof opt === 'string' ? opt : opt.value;
  }

  getInputType(label: string): string {
    const lower = label.toLowerCase();
    if (lower.includes('email')) return 'email';
    if (lower.includes('phone') || lower.includes('mobile') || lower.includes('number')) return 'tel';
    return 'text';
  }

  isPhoneField(label: string): boolean {
    const lower = label.toLowerCase();
    return lower.includes('phone') || lower.includes('mobile') || lower.includes('number');
  }


  getFormArrayControls(label: string) {
    return (this.formGroup.get(label) as FormArray).controls;
  }

  minSelectedCheckboxes(min = 1) {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls
        .map(c => c.value)
        .reduce((acc, selected) => acc + (selected ? 1 : 0), 0);

      return totalSelected >= min ? null : { required: true };
    };
  }


  transformFormValues() {
    const result: any = {};
    const raw = this.formGroup.value;

    this.formDefinition.fields.forEach(field => {
      const val = raw[field.label!];

      if (field.type === 'checkbox' && Array.isArray(val)) {
        // Convert true/false array to selected option labels
        result[field.label!] = field.options
          .map((opt: any, i: number) => (val[i] ? (typeof opt === 'string' ? opt : opt.value) : null))
          .filter(v => v !== null);
      } else {
        result[field.label!] = val;
      }
    });

    return result;
  }

  getBannerUrl(fileName: string | undefined): string {
    if (!fileName) return '';
    return `${environment.apiUrl}/Image/${fileName}`;
  }

  getPatternErrorMessage(field: any): string {
    switch (field.validationMode) {
      case 'alpha': return 'Only letters are allowed.';
      case 'alpha-special': return 'Only letters, spaces, and these special characters are allowed: ' + (field.customSpecialChars || '(none)');
      case 'alpha-numeric': return 'Letters and digits only. No special characters.';
      default: return 'Invalid characters used.';
    }

  }
}
