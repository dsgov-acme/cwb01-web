import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';
import {
  DEFAULT_COMPONENT_OPTIONS,
  defaultAriaLabelConfiguration,
  defaultColorThemeConfiguration,
  defaultCompleteConditionalPanelConfiguration,
  defaultDisplayAccessabilityPanel,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultFieldLabelConfiguration,
  defaultFieldWidthConfiguration,
  defaultLabelPositionConfiguration,
  defaultPanelTabsConfiguration,
  defaultPropertyKeyConfiguration,
  defaultRequiredConfiguration,
  defaultRequiredErrorMessageConfiguration,
  defaultValidationPanelConfiguration,
  defaultValidationPanelDocumentationLink,
} from '../../base';
import { FormioCheckboxComponent } from './formio-checkbox.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-checkbox-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'regular fa-check-square', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Checkbox', // Title of the component
  type: 'nuverialCheckbox', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerCheckboxComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioCheckboxComponent, injector);
  }
}

function editForm() {
  return {
    components: [
      {
        // tabs
        ...defaultPanelTabsConfiguration,
        components: [
          {
            // Display Panel
            ...defaultDisplayPanelConfiguration,
            components: [
              {
                ...defaultDisplayBasicConfiguration,
                components: [
                  { ...defaultFieldLabelConfiguration },
                  { ...defaultPropertyKeyConfiguration },
                  { ...defaultFieldWidthConfiguration },
                  { ...defaultColorThemeConfiguration },
                  { ...defaultLabelPositionConfiguration },
                ],
              },
              {
                ...defaultDisplayAccessabilityPanel,
                components: [{ ...defaultAriaLabelConfiguration }],
              },
            ],
          },
          {
            // Validation Panel
            ...defaultValidationPanelConfiguration,
            components: [
              { ...defaultValidationPanelDocumentationLink },
              { ...defaultRequiredConfiguration },
              {
                components: [{ ...defaultRequiredErrorMessageConfiguration }],
              },
            ],
          },
          {
            // Conditional Panel
            ...defaultCompleteConditionalPanelConfiguration,
          },
        ],
      },
    ],
  };
}
