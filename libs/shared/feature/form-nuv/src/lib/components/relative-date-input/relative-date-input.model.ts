import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../utils';
import { DEFAULT_COMPONENT_OPTIONS } from '../base/formio/formio-builder-base.model';
import { RelativeDateInputComponent } from './relative-date-input.component';

const selector = 'nuverial-relative-date-input-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  group: 'hidden',
  icon: 'forward',
  selector: selector,
  title: 'Schema Key Selector',
  type: 'nuverialRelativeDateInput',
  weight: 0,
};

export function registerRelativeDateInputComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, RelativeDateInputComponent, injector);
  }
}
