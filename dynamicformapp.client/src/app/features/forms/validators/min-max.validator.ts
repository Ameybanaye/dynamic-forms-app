import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minMaxValidator: ValidatorFn = (group: AbstractControl) => {
  const min = group.get('min')?.value;
  const max = group.get('max')?.value;
  const invalid = min != null && max != null && max < min;

  const maxCtrl = group.get('max');
  if (maxCtrl) {
    if (invalid) {
      maxCtrl.setErrors({ ...(maxCtrl.errors || {}), minGreaterThanMax: true });
    } else {
      // remove only our error key
      const errs = maxCtrl.errors;
      if (errs) {
        delete errs['minGreaterThanMax'];
        Object.keys(errs).length
          ? maxCtrl.setErrors(errs)
          : maxCtrl.setErrors(null);
      }
    }
  }

  return invalid ? { minGreaterThanMax: true } : null;
};
