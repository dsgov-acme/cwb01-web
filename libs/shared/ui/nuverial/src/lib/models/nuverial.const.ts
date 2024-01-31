import { INuverialSnackBarConfiguration } from './nuverial.models';

// Default Configuration for Nuverial Snackbar
export const NUVERIAL_DEFAULT_SNACKBAR_CONFIGURATION: INuverialSnackBarConfiguration = {
  dismissible: true,
  duration: 5000,
  horizontalPosition: 'left',
  politeness: 'polite',
  type: 'success',
  verticalPosition: 'bottom',
};

export const INFINITE_SCROLL_DEFAULTS = {
  scrollDistance: 1,
  scrollUpDistance: 2,
  throttle: 300,
};

export const FOOTER_ACTIONS_OPEN_CLASS = 'footer-actions-open';

export const DEFAULT_VALIDATION_MESSAGES = {
  alphaNumeric: 'Use only alphanumeric characters',
  datePickerFilter: `Invalid filter`,
  datePickerMax: `Invalid maximum date`,
  datePickerMin: `Invalid minimum date`,
  datePickerParse: `Invalid date format`,
  datePickerRequired: `Required date field`,
  defaultInvalid: `Invalid input field content`,
  defaultRequired: `Required`,
  doesNotMatchOptions: `Does not match options`,
  email: `Invalid email address`,
  fileSize: `File is too large`,
  keyExists: 'Key already exists',
  max: `Invalid maximum value`,
  maxlength: `Invalid maximum length`,
  min: `Invalid minimum value`,
  minlength: `Invalid minimum length`,
  pattern: `Invalid characters`,
  required: `Required`,
  requiredTrue: `Required`,
};
