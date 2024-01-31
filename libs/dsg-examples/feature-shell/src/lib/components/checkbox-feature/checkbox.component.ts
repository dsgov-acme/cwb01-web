import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCheckboxComponent, NuverialFormFieldErrorComponent } from '@dsg/shared/ui/nuverial';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, NuverialCheckboxComponent, NuverialFormFieldErrorComponent],
  selector: 'dsg-examples-checkbox',
  standalone: true,
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
})
export class ExampleCheckboxComponent {
  public formGroup = this._formBuilder.group({
    testGroupControl1: [false, Validators.required],
    testGroupControl2: [false, Validators.min(10)],
  });

  public formControl = new FormControl(null);
  public formModel = { isValid: false };
  public validationMessages = { email: 'Local invalid email address', required: 'Local card required' };

  constructor(private readonly _formBuilder: FormBuilder) {}
}
