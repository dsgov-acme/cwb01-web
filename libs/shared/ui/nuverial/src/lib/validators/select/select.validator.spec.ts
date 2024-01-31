import { FormControl } from '@angular/forms';
import { INuverialSelectOption } from '../../components/select';
import { MatchOptions } from './select.validator';

describe('MatchOptions Validator', () => {
  let selectOptions: INuverialSelectOption[];

  beforeEach(() => {
    selectOptions = [
      {
        disabled: false,
        displayChipValue: 'CA',
        displayTextValue: 'California',
        key: 'CA',
        selected: false,
      },
    ];
  });

  it('should return null when the control value matches one of the options', () => {
    const control = new FormControl('CA', MatchOptions(selectOptions));

    expect(control.errors).toBeNull;
  });

  it('should return validation error when the control value does not match any option', () => {
    const control = new FormControl('invalidOption');

    expect(control.errors).not.toBeNull;
    expect(control.errors?.['doesNotMatchOptions']).toBeTruthy;
  });
});
