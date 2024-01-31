import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NuverialContentDirective,
  CardChange,
  NuverialCheckboxCardComponent,
  NuverialFormFieldErrorComponent,
  NuverialValidationErrorType,
} from '@dsg/shared/ui/nuverial';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NuverialContentDirective,
    NuverialCheckboxCardComponent,
    NuverialFormFieldErrorComponent,
  ],
  selector: 'dsg-examples-checkbox-card',
  standalone: true,
  styleUrls: ['./checkbox-card.component.scss'],
  templateUrl: './checkbox-card.component.html',
})
export class ExampleCheckboxCardComponent {
  public checkboxHeader = 'Lorem Ipsum dolor';
  public checkboxContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit';
  public formErrorContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit';

  public formGroup = this._formBuilder.group({
    testGroupControl1: [false, Validators.required],
    testGroupControl2: [false, Validators.min(10)],
  });

  public formControl = new FormControl(null);
  public formModel = { isValid: false };
  public imageFormControl = new FormControl(null);
  public validationMessages = { email: 'Local invalid email address', required: 'Local card required' };

  constructor(private readonly _formBuilder: FormBuilder) {}

  public onCardChange(_event: CardChange): void {
    // for debug purposes
  }
  public onValidationErrors(_event: NuverialValidationErrorType[]): void {
    // for debug purposes
  }
}
