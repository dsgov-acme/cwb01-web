import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NuverialTextAreaComponent, NuverialValidationErrorType } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NuverialTextAreaComponent],
  selector: 'dsg-examples-text-area',
  standalone: true,
  styleUrls: ['./text-area.component.scss'],
  templateUrl: './text-area.component.html',
})
export class ExampleTextAreaComponent {
  public inputTextValidationMessages = { email: 'Local invalid email address', required: 'Email address is required' };
  public inputTextModel = '';
  public inputTextFormControl = new FormControl({ disabled: false, value: null }, [Validators.email]);
  public inputTextFormGroup = new FormGroup({
    testGroupControl1: new FormControl({ disabled: false, value: null }, [Validators.email, Validators.min(10)]),
    testGroupControl2: new FormControl({ disabled: false, value: null }, [Validators.min(10)]),
  });

  public onValidationErrors(_event: NuverialValidationErrorType[]) {
    // for debug purposes
  }
}
