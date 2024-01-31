import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '@dsg/shared/feature/form-nuv';
import { DEFAULT_COMPONENT_OPTIONS } from '../../base';
import { FormioProcessorCheckboxCardsComponent } from './formio-processor-checkbox-cards.component';

const selector = 'nuverial-processor-checkbox-cards-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  group: 'hidden',
  icon: 'forward',
  selector: selector,
  title: 'Processor Checkbox Cards',
  type: 'nuverialProcessorCheckboxCards',
  weight: 0,
};

export function registerProcessorCheckboxCardsComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioProcessorCheckboxCardsComponent, injector);
  }
}
