import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertModalViewComponent, NuverialRadioCardsComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../../base';
import { LogicValidatorProperties } from '../models/formly-logic-validator.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialRadioCardsComponent, AlertModalViewComponent],
  selector: 'dsg-formio-logic-validator',
  standalone: true,
  styleUrls: ['./formio-logic-validator.component.scss'],
  templateUrl: './formio-logic-validator.component.html',
})
export class FormioLogicValidatorComponent extends FormioBaseCustomComponent<string, LogicValidatorProperties> {}
