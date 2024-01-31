import { NgModule } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyAddressComponent } from './components/advanced/address';
import { FormlyFileUploadComponent, FormlyFileUploaderComponent, FormlyMultipleFileUploadComponent } from './components/advanced/file-upload';
import { FormlyFormListComponent } from './components/advanced/form-list/formly/formly-form-list.component';
import { FormlyLogicValidatorComponent } from './components/advanced/logic-validator';
import { FormlyCheckboxComponent } from './components/checkbox';
import { FormlyCheckboxCardComponent } from './components/checkbox-card';
import { FormlyDatePickerComponent } from './components/date-picker';
import { FormlyDateRangePickerComponent } from './components/date-range-picker';
import { FormlySectionHeaderComponent } from './components/section-header';
import { FormlySelectComponent } from './components/select';
import { FormlySimpleChoiceQuestionsComponent } from './components/simple-choice-questions';
import { FormlyStepsComponent } from './components/steps';
import { FormlyTextAreaComponent } from './components/text-area';
import { FormlyTextContentComponent } from './components/text-content';
import { FormlyTextInputComponent } from './components/text-input';

@NgModule({
  declarations: [],
  imports: [
    FormlyMaterialModule,
    MatNativeDateModule,
    MatDialogModule,
    FormlyModule.forRoot({
      types: [
        { component: FormlyAddressComponent, name: 'nuverialAddress' },
        { component: FormlyCheckboxCardComponent, name: 'nuverialCheckboxCard' },
        { component: FormlyCheckboxComponent, name: 'nuverialCheckbox' },
        { component: FormlyDatePickerComponent, name: 'nuverialDatePicker' },
        { component: FormlyDateRangePickerComponent, name: 'nuverialDateRangePicker' },
        { component: FormlyFileUploadComponent, name: 'nuverialFileUpload' },
        { component: FormlyMultipleFileUploadComponent, name: 'nuverialMultipleFileUpload' },
        { component: FormlyFileUploaderComponent, name: 'nuverialFileUploader' },
        { component: FormlyLogicValidatorComponent, name: 'nuverialLogicValidator' },
        { component: FormlyFormListComponent, name: 'nuverialFormList' },
        { component: FormlySectionHeaderComponent, name: 'nuverialSectionHeader' },
        { component: FormlySelectComponent, name: 'nuverialSelect' },
        { component: FormlySimpleChoiceQuestionsComponent, name: 'nuverialRadioCards' },
        { component: FormlyStepsComponent, name: 'nuverialSteps' },
        { component: FormlyTextAreaComponent, name: 'nuverialTextArea' },
        { component: FormlyTextContentComponent, name: 'nuverialTextContent' },
        { component: FormlyTextInputComponent, name: 'nuverialTextInput' },
      ],
      validators: [{ name: 'email', validation: Validators.email }],
    }),
  ],
})
export class FormRendererModule {}
