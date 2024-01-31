import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialRadioCardsComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBaseComponent } from '../../base';
import { CardsFieldProperties } from '../models/formly-simple-choice-questions.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialRadioCardsComponent],
  selector: 'dsg-formly-simple-choice-questions',
  standalone: true,
  styleUrls: ['./formly-simple-choice-questions.component.scss'],
  templateUrl: './formly-simple-choice-questions.component.html',
})
export class FormlySimpleChoiceQuestionsComponent extends FormlyBaseComponent<CardsFieldProperties> {}
