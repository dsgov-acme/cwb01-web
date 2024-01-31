import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';
import { DEFAULT_COMPONENT_OPTIONS } from '../../base/formio/formio-builder-base.model';
import { DateInputComponent } from './date-input.component';

const selector = 'nuverial-date-input-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  group: 'hidden',
  icon: 'forward',
  selector: selector,
  title: 'Date Selector',
  type: 'nuverialDateInput',
  weight: 0,
};

export function registerDateInputComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, DateInputComponent, injector);
  }
}
