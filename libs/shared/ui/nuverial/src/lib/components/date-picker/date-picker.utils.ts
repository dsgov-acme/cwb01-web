import { ValidationErrors } from '@angular/forms';

export const convertMaterialErrors = (errors: ValidationErrors | null): ValidationErrors | null => {
  if (!errors) {
    return errors;
  }
  const nuvErrors: ValidationErrors = {};
  Object.keys(errors).forEach(key => {
    switch (key) {
      case 'matDatepickerFilter':
        nuvErrors['daterPickerFilter'] = { ...errors[key] };
        break;
      case 'matDatepickerParse':
        nuvErrors['datePickerParse'] = { ...errors[key] };
        break;
      case 'matDatepickerMax':
        nuvErrors['datePickerMax'] = { ...errors[key] };
        break;
      case 'matDatepickerMin':
        nuvErrors['datePickerMin'] = { ...errors[key] };
        break;
      default:
        nuvErrors[key] = { ...errors[key] };
    }
  });

  return nuvErrors;
};
