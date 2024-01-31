import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { FormlyTextInputFieldProperties } from '../formly/formly-text-input.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTextInputComponent],
  selector: 'dsg-formio-text-input',
  standalone: true,
  styleUrls: ['./formio-text-input.component.scss'],
  templateUrl: './formio-text-input.component.html',
})
export class FormioTextInputComponent extends FormioBaseCustomComponent<string, FormlyTextInputFieldProperties> {}
