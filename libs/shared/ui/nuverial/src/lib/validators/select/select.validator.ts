import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { INuverialSelectOption } from '../../components/select';

export function MatchOptions(selectOptions: INuverialSelectOption[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && selectOptions && !selectOptions.some(item => item.key === control.value)) {
      return { doesNotMatchOptions: true };
    }

    return null;
  };
}
