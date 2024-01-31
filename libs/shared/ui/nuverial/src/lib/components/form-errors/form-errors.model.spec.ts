import { FormControl, FormGroup } from '@angular/forms';
import { FormErrorsFromGroup, GetAllFormErrors, MarkAllControlsAsTouched } from './form-errors.model';

const form = new FormGroup({
  nestedForm: new FormGroup({
    nestedTestControl: new FormControl({ required: true }),
  }),
  testControl: new FormControl({ required: true }),
});

const formConfigs = {
  'nestedForm.nestedTestControl': {
    id: 'nestedForm.nestedTestControl',
    label: 'Nested Control',
  },
  'testControl': {
    id: 'testControl',
    label: 'Test',
  },
};

describe('GetAllFormErrors', () => {
  test('should get form errors from group', () => {
    form.get('testControl')?.setErrors({ required: true });
    form.get('nestedForm.nestedTestControl')?.setErrors({ required: true });

    const errors = GetAllFormErrors(form);

    expect(errors).toEqual({ 'nestedForm.nestedTestControl': 'required', 'testControl': 'required' });
  });
});

describe('MarkAllControlsAsTouched', () => {
  test('should mark all controls as touched', () => {
    MarkAllControlsAsTouched(form);

    expect(form.touched).toBeTruthy();
    expect(form.get('testControl')?.touched).toBeTruthy();
    expect(form.get('nestedForm.nestedTestControl')?.touched).toBeTruthy();
  });
});

describe('FormErrorsFromGroup', () => {
  test('should get all form errors from group with form configs provided', () => {
    form.get('testControl')?.setErrors({ required: true });
    form.get('nestedForm.nestedTestControl')?.setErrors({ required: true });

    const errors = FormErrorsFromGroup(form, formConfigs);

    expect(errors).toEqual([
      {
        controlName: 'nestedForm.nestedTestControl',
        errorName: 'required',
        id: 'nestedForm.nestedTestControl',
        label: 'Nested Control',
      },
      {
        controlName: 'testControl',
        errorName: 'required',
        id: 'testControl',
        label: 'Test',
      },
    ]);
  });
});
