import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialRadioCardsComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { CardsFieldProperties } from '../models/formly-simple-choice-questions.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialRadioCardsComponent],
  selector: 'dsg-formio-simple-choice-questions',
  standalone: true,
  styleUrls: ['./formio-simple-choice-questions.component.scss'],
  templateUrl: './formio-simple-choice-questions.component.html',
})
export class FormioSimpleChoiceQuestionsComponent extends FormioBaseCustomComponent<string, CardsFieldProperties> {}
