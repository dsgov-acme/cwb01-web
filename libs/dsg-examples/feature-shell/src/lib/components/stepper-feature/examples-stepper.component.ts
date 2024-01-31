import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import {
  IStep,
  NuverialButtonComponent,
  NuverialFooterComponent,
  NuverialSectionHeaderComponent,
  NuverialStepperComponent,
  NuverialStepperKeyDirective,
  NuverialTextInputComponent,
} from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatStepperModule,
    NuverialStepperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NuverialStepperKeyDirective,
    NuverialTextInputComponent,
    NuverialSectionHeaderComponent,
    NuverialFooterComponent,
    NuverialButtonComponent,
  ],
  selector: 'dsg-examples-stepper',
  standalone: true,
  styleUrls: ['./examples-stepper.component.scss'],
  templateUrl: './examples-stepper.component.html',
})
export class ExampleStepperComponent {
  @ViewChild('stepTemplate') public stepTemplate!: TemplateRef<unknown>;
  @ViewChild(NuverialStepperComponent) public nuvStepper!: NuverialStepperComponent;

  public userInfo = this._formBuilder.group({
    firstName: new FormControl({ disabled: false, value: null }, [Validators.maxLength(26), Validators.required]),
    lastName: new FormControl({ disabled: false, value: null }, [Validators.maxLength(26), Validators.required]),
    middleName: new FormControl({ disabled: false, value: null }),
  });

  public addressInfo = this._formBuilder.group({
    city: new FormControl({ disabled: false, value: null }, [Validators.maxLength(26), Validators.required]),
    country: new FormControl({ disabled: false, value: null }, [Validators.maxLength(26), Validators.required]),
    state: new FormControl({ disabled: false, value: null }, [Validators.maxLength(26), Validators.required]),
    street: new FormControl({ disabled: false, value: null }, [Validators.maxLength(26), Validators.required]),
  });

  public steps: IStep[] = [
    { form: this.userInfo, label: 'User Information', stepKey: 'userInfo' },
    { form: this.addressInfo, label: 'Address Information', stepKey: 'addressInfo' },
    { label: 'Done', stepKey: 'confirmation' },
  ];

  public submit() {
    // form submitted
  }

  constructor(private readonly _formBuilder: FormBuilder, protected readonly _changeDetectorRef: ChangeDetectorRef) {}
}
