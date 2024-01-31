import { EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export interface FormErrorsConfiguration {
  id: string;
  label: string;
}

export interface IFormError {
  controlName: string;
  errorName: string;
  id: string;
  label: string;
}

/**
 * Gets all form errors from a form group
 */
export const GetAllFormErrors = (formGroup: AbstractControl): Record<string, string> | null => {
  let hasError = false;
  const formErrors: Record<string, string> = {};

  if (formGroup instanceof FormGroup || formGroup instanceof FormArray) {
    Object.entries(formGroup.controls).forEach(([key, control]) => {
      const isFormGroup = control instanceof FormGroup || control instanceof FormArray;
      const errors = isFormGroup ? GetAllFormErrors(control) : control?.errors;

      if (!errors) return;

      Object.entries(errors).forEach(([errorKey, errorValue]) => {
        if (isFormGroup) {
          formErrors[`${key}.${errorKey}`] = errorValue;
        } else {
          formErrors[key] = errorKey;
        }
      });
      hasError = true;
    });
  }

  return hasError ? formErrors : null;
};

/**
 * Mark all formGroup controls as touched
 */
export const MarkAllControlsAsTouched = (formGroup: AbstractControl | null): void => {
  if (!formGroup) return;

  if (formGroup instanceof FormGroup || formGroup instanceof FormArray) {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      // Emit new event with same status instead of revalidation to prevent frontend from overriding backend validation
      (<EventEmitter<unknown>>control.statusChanges).emit(control.status);

      if ((control instanceof FormGroup || control instanceof FormArray) && control.controls) {
        MarkAllControlsAsTouched(control);
      }
    });
  }
};

/**
 * Used by the hardcoded forms to get all form errors from a form group and map them to a form errors configuration
 */
export const FormErrorsFromGroup = (formGroup: AbstractControl | null, formErrorsConfig: Record<string, FormErrorsConfiguration>): IFormError[] => {
  if (!formGroup) return [];

  const formErrors = Object.entries(GetAllFormErrors(formGroup) || []).map(([controlName, errorName]) => {
    return {
      controlName,
      errorName,
      id: formErrorsConfig[controlName].id || '',
      label: formErrorsConfig[controlName].label || '',
    };
  });

  return formErrors;
};
