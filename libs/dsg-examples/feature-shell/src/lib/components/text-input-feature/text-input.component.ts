import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NuverialValidationErrorType, NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NuverialTextInputComponent],
  selector: 'dsg-examples-text-input',
  standalone: true,
  styleUrls: ['./text-input.component.scss'],
  templateUrl: './text-input.component.html',
})
export class ExampleTextInputComponent {
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
