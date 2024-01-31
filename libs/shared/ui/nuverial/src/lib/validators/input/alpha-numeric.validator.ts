import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AlphaNumericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    const valid = alphanumericRegex.test(control.value);

    return valid ? null : { alphaNumeric: true };
  };
}
