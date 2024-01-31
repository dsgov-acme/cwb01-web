import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialDatePickerComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormlyBaseComponent } from '../../base';
import { DatePickerFieldProperties } from '../models/formly-date-picker.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialDatePickerComponent, NgxMaskPipe],
  providers: [provideNgxMask()],
  selector: 'dsg-formly-date-picker',
  standalone: true,
  styleUrls: ['./formly-date-picker.component.scss'],
  templateUrl: './formly-date-picker.component.html',
})
export class FormlyDatePickerComponent extends FormlyBaseComponent<DatePickerFieldProperties> {}
