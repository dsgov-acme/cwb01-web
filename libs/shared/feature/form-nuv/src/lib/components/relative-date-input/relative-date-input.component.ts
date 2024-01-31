import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { INuverialSelectOption, NuverialSelectComponent, NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';

import { FormioBaseCustomComponent } from '../base';

import { FormlyTextInputFieldProperties } from '../text-input/formly/formly-text-input.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTextInputComponent, NuverialSelectComponent],
  selector: 'dsg-relative-date-input',
  standalone: true,
  styleUrls: ['./relative-date-input.component.scss'],
  templateUrl: './relative-date-input.component.html',
})
export class RelativeDateInputComponent extends FormioBaseCustomComponent<string, FormlyTextInputFieldProperties> implements OnChanges {
  public formGroup = new FormGroup({
    dateUnit: new FormControl({ disabled: false, value: null }),
    numberOfUnit: new FormControl({ disabled: false, value: null }),
  });
  public get numberOfUnit(): FormControl {
    return this.formGroup.get('numberOfUnit') as FormControl;
  }

  public get dateUnit(): FormControl {
    return this.formGroup.get('dateUnit') as FormControl;
  }

  public selectOption: INuverialSelectOption[] = [
    {
      disabled: false,
      displayTextValue: 'Days',
      key: 'day',
      selected: false,
    },
    {
      disabled: false,
      displayTextValue: 'Weeks',
      key: 'week',
      selected: false,
    },
    {
      disabled: false,
      displayTextValue: 'Months',
      key: 'month',
      selected: false,
    },
    {
      disabled: false,
      displayTextValue: 'Years',
      key: 'year',
      selected: false,
    },
  ];

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      if (changes['value'].currentValue) {
        let isNegative = false;
        let value = changes['value'].currentValue;

        if (changes['value'].currentValue.startsWith('-')) {
          isNegative = true;
          value = changes['value'].currentValue.substring(1);
        }

        const splitValues = value.split('-');
        if (isNegative) {
          splitValues[0] = `-${splitValues[0]}`;
        }
        this.numberOfUnit.setValue(splitValues[0]);
        this.dateUnit.setValue(splitValues[1]);
      }
    }
  }

  public updateValueFromControl() {
    const dateUnitControl = this.formGroup.get('dateUnit')?.value;
    const numberOfUnitControl = this.formGroup.get('numberOfUnit')?.value;

    if (dateUnitControl && numberOfUnitControl) {
      const key = `${String(numberOfUnitControl)}-${String(dateUnitControl)}`;
      this.updateValue(key);
    } else {
      this.updateValue('');
    }
  }
}
