import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '@dsg/shared/feature/form-nuv';
import { DEFAULT_COMPONENT_OPTIONS } from '../../base';
import { FormioSchemaSelectComponent } from './formio-schema-select.component';

const selector = 'nuverial-schema-select-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  group: 'hidden',
  icon: 'forward',
  selector: selector,
  title: 'Schema Select',
  type: 'nuverialSchemaSelect',
  weight: 0,
};

export function registerSchemaSelectComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioSchemaSelectComponent, injector);
  }
}
