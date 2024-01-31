import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NuverialDatePickerComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { DatePickerFieldProperties } from '../../date-picker/models/formly-date-picker.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialDatePickerComponent],
  selector: 'dsg-date-input',
  standalone: true,
  styleUrls: ['./date-input.component.scss'],
  templateUrl: './date-input.component.html',
})
export class DateInputComponent extends FormioBaseCustomComponent<string, DatePickerFieldProperties> implements OnInit {
  public ngOnInit() {
    this._handleFormControlChanges();
  }
}
