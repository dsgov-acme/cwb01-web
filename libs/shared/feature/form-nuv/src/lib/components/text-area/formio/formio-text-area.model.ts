import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';
import {
  DEFAULT_COMPONENT_OPTIONS,
  defaultAriaLabelConfiguration,
  defaultCompleteConditionalPanelConfiguration,
  defaultDisplayAccessabilityPanel,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultEmailErrorMessageConfiguration,
  defaultErrorMessagesPanelConfiguration,
  defaultFieldLabelConfiguration,
  defaultFieldWidthConfiguration,
  defaultHintConfiguration,
  defaultMaxLengthConfiguration,
  defaultMaxLengthErrorMessageConfiguration,
  defaultMinLengthConfiguration,
  defaultMinLengthErrorMessageConfiguration,
  defaultPanelTabsConfiguration,
  defaultPlaceholderConfiguration,
  defaultPropertyKeyConfiguration,
  defaultRequiredConfiguration,
  defaultRequiredErrorMessageConfiguration,
  defaultShowMaxLengthConfiguration,
  defaultValidationPanelConfiguration,
  defaultValidationPanelDocumentationLink,
} from '../../base';
import { FormioTextAreaComponent } from './formio-text-area.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-text-area-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'terminal', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Text Area', // Title of the component
  type: 'nuverialTextArea', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerTextAreaComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioTextAreaComponent, injector);
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
                  { ...nonRequiredFieldLabelConfiguration },
                  { ...defaultPropertyKeyConfiguration },
                  { ...defaultPlaceholderConfiguration },
                  { ...defaultHintConfiguration },
                  { ...defaultFieldWidthConfiguration },
                  { ...defaultAutoSizeConfiguration },
                  { ...defaultAutoSizeMinRowsConfiguration },
                  { ...defaultAutoSizeMaxRowsConfiguration },
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
              { ...defaultMinLengthConfiguration },
              { ...defaultMaxLengthConfiguration },
              { ...defaultShowMaxLengthConfiguration },
              {
                ...defaultErrorMessagesPanelConfiguration,
                components: [
                  { ...defaultRequiredErrorMessageConfiguration },
                  { ...defaultMinLengthErrorMessageConfiguration },
                  { ...defaultMaxLengthErrorMessageConfiguration },
                  { ...defaultEmailErrorMessageConfiguration },
                ],
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

const nonRequiredFieldLabelConfiguration = {
  ...defaultFieldLabelConfiguration,
  validate: {
    required: false,
  },
};

const defaultAutoSizeConfiguration = {
  input: true,
  key: 'props.autoSize',
  label: 'Auto Size',
  tooltip: 'When checked the height of the text area will auto size based on the amount of content.',
  type: 'checkbox',
  weight: 0,
};

const defaultAutoSizeMinRowsConfiguration = {
  conditional: {
    json: {
      '===': [
        {
          var: 'data.props.autoSize',
        },
        true,
      ],
    },
  },
  input: true,
  key: 'props.autoSizeMinRows',
  label: 'Auto Size Min Rows',
  tooltip: 'If auto size is selected, you can optionally specify the minimum number of rows for the text area.',
  type: 'number',
  weight: 0,
};

const defaultAutoSizeMaxRowsConfiguration = {
  conditional: {
    json: {
      '===': [
        {
          var: 'data.props.autoSize',
        },
        true,
      ],
    },
  },
  input: true,
  key: 'props.autoSizeMaxRows',
  label: 'Auto Size Max Rows',
  tooltip: 'If auto size is selected, you can optionally specify the maximum number of rows for the text area.',
  type: 'number',
  weight: 0,
};
