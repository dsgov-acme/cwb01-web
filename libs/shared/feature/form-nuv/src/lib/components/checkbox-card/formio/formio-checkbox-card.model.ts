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
  defaultErrorMessagesPanelConfiguration,
  defaultFieldLabelConfiguration,
  defaultFieldWidthConfiguration,
  defaultImagePositionConfiguration,
  defaultPanelTabsConfiguration,
  defaultPropertyKeyConfiguration,
  defaultRequiredConfiguration,
  defaultRequiredErrorMessageConfiguration,
  defaultValidationPanelConfiguration,
  defaultValidationPanelDocumentationLink,
} from '../../base';
import { FormioCheckboxCardComponent } from './formio-checkbox-card.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-checkbox-card-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'id-card', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Checkbox Card', // Title of the component
  type: 'nuverialCheckboxCard', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerCheckboxCardComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioCheckboxCardComponent, injector);
  }
}

function editForm() {
  return {
    components: [
      {
        // Tabs
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
                  { ...defaultColorThemeConfiguration },
                  { ...defaultImagePositionConfiguration },
                  { ...defaultFieldWidthConfiguration },
                  { ...cardCheckboxTitleConfiguration },
                  { ...cardCheckboxContentConfiguration },
                  { ...cardCheckboxImagePathConfiguration },
                  { ...cardCheckboxImageAltLabelConfiguration },
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
                ...defaultErrorMessagesPanelConfiguration,
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

const cardCheckboxContentConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.cardContent',
  label: 'Card content',
  placeholder: 'Card content',
  type: 'textarea',
};

const cardCheckboxImagePathConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.imagePath',
  label: 'Card image',
  placeholder: 'Path to card image',
  type: 'textfield',
};

const cardCheckboxImageAltLabelConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.imageAltLabel',
  label: 'Card image alt text',
  placeholder: 'Image alt text',
  type: 'textfield',
};

const cardCheckboxTitleConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.cardTitle',
  label: 'Card Title',
  placeholder: 'Card title',
  type: 'textfield',
};
