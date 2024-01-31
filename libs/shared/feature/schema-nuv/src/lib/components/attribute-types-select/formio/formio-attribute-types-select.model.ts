import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '@dsg/shared/feature/form-nuv';
import { DEFAULT_COMPONENT_OPTIONS } from '../../base';
import { FormioAttributeTypesSelectComponent } from './formio-attribute-types-select.component';

const selector = 'nuverial-schema-types-select-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  group: 'hidden',
  icon: 'forward',
  selector: selector,
  title: 'Attribute Types Select',
  type: 'nuverialAttributeTypesSelect',
  weight: 0,
};

export function registerAttributeTypesSelectComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioAttributeTypesSelectComponent, injector);
  }
}
