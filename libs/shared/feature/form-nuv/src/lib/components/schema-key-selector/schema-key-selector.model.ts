import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../utils';
import { DEFAULT_COMPONENT_OPTIONS } from '../base/formio/formio-builder-base.model';
import { SchemaKeySelectorComponent } from './schema-key-selector.component';

const selector = 'nuverial-schema-key-selector-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  group: 'hidden',
  icon: 'forward',
  selector: selector,
  title: 'Schema Key Selector',
  type: 'nuverialSchemaKeySelector',
  weight: 0,
};

export function registerSchemaKeySelectorComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, SchemaKeySelectorComponent, injector);
  }
}
