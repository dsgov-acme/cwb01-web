import { FormControl } from '@angular/forms';
import { AlphaNumericValidator } from './alpha-numeric.validator';
describe('AlphaNumericValidator', () => {
  it('should return null if the control value is alphanumeric', () => {
    const control = new FormControl('abc123');
    expect(AlphaNumericValidator()(control)).toBeNull();
  });

  it('should return an error object if the control value is not alphanumeric', () => {
    const control = new FormControl('abc123!');
    expect(AlphaNumericValidator()(control)).toEqual({ alphaNumeric: true });
  });

  it('should return null if the control value is an empty string', () => {
    const control = new FormControl('');
    expect(AlphaNumericValidator()(control)).toBeNull();
  });

  it('should return null if the control value is null', () => {
    const control = new FormControl(null);
    expect(AlphaNumericValidator()(control)).toBeNull();
  });
});
