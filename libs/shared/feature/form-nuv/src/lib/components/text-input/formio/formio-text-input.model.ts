import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';
import {
  DEFAULT_COMPONENT_OPTIONS,
  defaultAriaLabelConfiguration,
  defaultAutoCompleteConfiguration,
  defaultCompleteConditionalPanelConfiguration,
  defaultDisplayAccessabilityPanel,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultEmailErrorMessageConfiguration,
  defaultErrorMessagesPanelConfiguration,
  defaultFieldLabelConfiguration,
  defaultFieldWidthConfiguration,
  defaultHintConfiguration,
  defaultMaskConfiguration,
  defaultMaxConfiguration,
  defaultMaxErrorMessageConfiguration,
  defaultMaxLengthConfiguration,
  defaultMaxLengthErrorMessageConfiguration,
  defaultMinConfiguration,
  defaultMinErrorMessageConfiguration,
  defaultMinLengthConfiguration,
  defaultMinLengthErrorMessageConfiguration,
  defaultPanelTabsConfiguration,
  defaultPatternConfiguration,
  defaultPatternErrorMessageConfiguration,
  defaultPlaceholderConfiguration,
  defaultPropertyKeyConfiguration,
  defaultRequiredConfiguration,
  defaultRequiredErrorMessageConfiguration,
  defaultShowMaxLengthConfiguration,
  defaultTooltipConfiguration,
  defaultValidationPanelConfiguration,
  defaultValidationPanelDocumentationLink,
} from '../../base';
import { FormioTextInputComponent } from './formio-text-input.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-text-input-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'terminal', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Text Input', // Title of the component
  type: 'nuverialTextInput', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerTextInputComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioTextInputComponent, injector);
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
                  { ...defaultPlaceholderConfiguration },
                  { ...defaultHintConfiguration },
                  { ...defaultTooltipConfiguration },
                  { ...inputTypeConfiguration },
                  { ...passwordVisible },
                  { ...defaultFieldWidthConfiguration },
                  { ...textAutocompleteconfig },
                  { ...maskConfiguration },
                  { ...prefixIconConfiguration },
                  { ...suffixIconConfiguration },
                ],
              },
              {
                ...defaultDisplayAccessabilityPanel,
                components: [{ ...defaultAriaLabelConfiguration }, { ...prefixIconAriaLabelConfiguration }, { ...suffixIconAriaLabelConfiguration }],
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
              { ...minValidationConfiguration },
              { ...maxValidationConfiguration },
              { ...patternConfiguration },
              { ...extraValidatorsConfiguration },
              {
                ...defaultErrorMessagesPanelConfiguration,
                components: [
                  { ...defaultRequiredErrorMessageConfiguration },
                  { ...defaultMinLengthErrorMessageConfiguration },
                  { ...defaultMaxLengthErrorMessageConfiguration },
                  { ...defaultMinErrorMessageConfiguration },
                  { ...defaultMaxErrorMessageConfiguration },
                  { ...defaultEmailErrorMessageConfiguration },
                  { ...defaultPatternErrorMessageConfiguration },
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

const inputTypeConfiguration = {
  data: {
    values: [
      {
        label: 'Email',
        value: 'email',
      },
      {
        label: 'Number',
        value: 'number',
      },
      {
        label: 'Telephone',
        value: 'tel',
      },
      {
        label: 'Text',
        value: 'text',
      },
      {
        label: 'Password',
        value: 'password',
      },
    ],
  },
  dataSrc: 'values',
  defaultValue: 'text',
  input: true,
  key: 'props.type',
  label: 'Input type',
  tooltip: 'Sets the type of the input field, for a description of the different types, see https://www.w3schools.com/html/html_form_input_types.asp',
  type: 'select',
  weight: 0,
};

const iconConfiguration = {
  input: true,
  placeholder: 'ex. search_outlined',
  tooltip: 'Icon that is displayed in the field, for a list of supported icons see https://fonts.google.com/icons',
  type: 'textfield',
  weight: 0,
};

const maskConfiguration = {
  ...defaultMaskConfiguration,
  conditional: { json: { or: [{ '===': [{ var: 'data.props.type' }, 'text'] }, { '===': [{ var: 'data.props.type' }, 'tel'] }] } },
};

const prefixIconConfiguration = {
  ...iconConfiguration,
  key: 'props.prefixIcon',
  label: 'Prefix icon',
  tooltip: 'Icon that is displayed at the beginning of the field, for a list of supported icons see https://fonts.google.com/icons',
};

const suffixIconConfiguration = {
  ...iconConfiguration,
  key: 'props.suffixIcon',
  label: 'Suffix icon',
  tooltip: 'Icon that is displayed at the end of the field field, for a list of supported icons see https://fonts.google.com/icons',
};

const prefixIconAriaLabelConfiguration = {
  ...defaultAriaLabelConfiguration,
  conditional: { json: { '!==': [{ var: 'data.props.prefixIcon' }, ''] } },
  key: 'props.prefixAriaLabel',
  label: 'Prefix icon aria label',
  validate: {
    required: true,
  },
};

const suffixIconAriaLabelConfiguration = {
  ...defaultAriaLabelConfiguration,
  conditional: { json: { '!==': [{ var: 'data.props.suffixIcon' }, ''] } },
  key: 'props.suffixAriaLabel',
  label: 'Suffix icon aria label',
  validate: {
    required: true,
  },
};

const minValidationConfiguration = {
  ...defaultMinConfiguration,
  conditional: { json: { '===': [{ var: 'data.props.type' }, 'number'] } },
};

const maxValidationConfiguration = {
  ...defaultMaxConfiguration,
  conditional: { json: { '===': [{ var: 'data.props.type' }, 'number'] } },
};

const extraValidatorsConfiguration = {
  calculateValue: { if: [{ '===': [{ var: 'data.props.type' }, 'email'] }, 'email'] },
  conditional: { json: { or: [{ '===': [{ var: 'data.props.type' }, 'email'] }] } },
  data: {
    values: [
      {
        label: 'Email',
        value: 'email',
      },
    ],
  },
  disabled: true,
  key: 'validators.validation',
  label: 'Validators',
  multiple: true,
  placeholder: 'ex. email, phone, etc.',
  template: '<span>{{ item.label }}</span>',
  tooltip: 'Select from a list of validators',
  type: 'select',
};

const patternConfiguration = {
  ...defaultPatternConfiguration,
  conditional: { json: { '===': [{ var: 'data.props.type' }, 'text'] } },
};

const textAutocompleteconfig = {
  ...defaultAutoCompleteConfiguration,
  values: [
    {
      label: 'Address Line 1',
      value: 'address-line1',
    },
    {
      label: 'Address Line 2',
      value: 'address-line2',
    },
    {
      label: 'City',
      value: 'address-level2',
    },
    {
      label: 'Zip',
      value: 'postal-code',
    },
    {
      label: 'First Name',
      value: 'given-name',
    },
    {
      label: 'Last Name',
      value: 'family-name',
    },
    {
      label: 'Middle Name',
      value: 'additional-name',
    },
    {
      label: 'Email',
      value: 'email',
    },
    {
      label: 'Phone Number',
      value: 'tel',
    },
    {
      label: 'Phone Number',
      value: 'tel',
    },
    {
      label: 'Extension Number',
      value: 'tel-extension',
    },
    {
      label: 'Job Title',
      value: 'organization-title',
    },
    {
      label: 'Company',
      value: 'organization',
    },
    {
      label: 'Name on Credit Card',
      value: 'cc-name',
    },
    {
      label: 'Credit Card Number',
      value: 'cc-number',
    },
    {
      label: 'Date of Expiration',
      value: 'cc-exp',
    },
    {
      label: 'Security Code',
      value: 'cc-csc',
    },
    {
      label: 'Language',
      value: 'language',
    },
  ],
};

const passwordVisible = {
  conditional: { json: { '===': [{ var: 'data.props.type' }, 'password'] } },
  defaultValue: true,
  input: true,
  key: `props.togglePassword`,
  label: 'Include show password toggle',
  tooltip: 'Controls whether the show password toggle is included or not',
  type: 'checkbox',
  weight: 0,
};
