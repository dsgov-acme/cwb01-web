/* istanbul ignore file */

import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class DateRangeErrorStateMatcher implements ErrorStateMatcher {
  public parentControl!: FormControl;
  public isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return this.parentControl?.invalid && control?.touched ? true : !!(control?.invalid && (control?.dirty || control?.touched));
  }
}
