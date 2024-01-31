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
  defaultPanelTabsConfiguration,
  defaultPlaceholderConfiguration,
  defaultPropertyKeyConfiguration,
  defaultRequiredConfiguration,
  defaultRequiredErrorMessageConfiguration,
  defaultValidationPanelConfiguration,
  defaultValidationPanelDocumentationLink,
  formioAlphaNumericValidator,
} from '../../base';
import { FormioSelectComponent } from './formio-select.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * FormIO select configuration: https://formio.github.io/formio.js/docs/file/src/components/select/editForm/Select.edit.data.js.html
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-select-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'list', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Select', // Title of the component
  type: 'nuverialSelect', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerSelectComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioSelectComponent, injector);
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
                  { ...defaultFieldWidthConfiguration },
                  { ...defaultColorThemeConfiguration },
                  { ...defaultPlaceholderConfiguration },
                  { ...selectAutocompleteConfig },
                  { ...PrefixIcon },
                  { ...SelectedOptionIconName },
                ],
              },
              {
                ...displaySelectOptions,
                components: [{ ...SelectOptions }],
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

const displaySelectOptions = {
  collapsed: true,
  collapsible: true,
  key: 'selectOptionsPanel',
  theme: 'default',
  title: 'Select Options',
  type: 'panel',
  weight: 10,
};

const SelectOptions = {
  collapsible: true,
  components: [
    {
      input: true,
      key: 'displayTextValue',
      label: 'Label',
      placeholder: 'ex: New York',
      tooltip: 'Display text.',
      type: 'textfield',
    },
    {
      allowCalculateOverride: true,
      calculateValue: 'value = _.camelCase(row.displayTextValue);',
      input: true,
      key: 'key',
      label: 'Value',
      placeholder: 'ex: newYork',
      tooltip: 'The key used in code to map to the value.',
      type: 'textfield',
      validate: formioAlphaNumericValidator,
    },
    {
      input: true,
      key: 'displayChipValue',
      label: 'Chip',
      placeholder: 'ex: NY',
      tooltip: 'A chip that displays next to the option',
      type: 'textfield',
    },
  ],
  defaultValue: [{ label: '', value: '' }],
  input: true,
  key: 'props.selectOptions',
  label: 'Select Options',
  reorder: true,
  tooltip: 'List of options as key value pairs.',
  type: 'datagrid',
};

const PrefixIcon = {
  input: true,
  key: 'props.prefixIcon',
  label: 'Prefix Icon',
  placeholder: 'PrefixIcon',
  tooltip: 'Name of icon that may optionally be displayed at the start of the form input field. Supports named Material icons e.g. search_outlined.',
  type: 'input',
};

const SelectedOptionIconName = {
  input: true,
  key: 'props.selectedOptionIconName',
  label: 'Selected option icon name',
  placeholder: 'SelectedOptionIconName',
  tooltip: ' Dropdown menu icon name displayed if selected.',
  type: 'input',
};

const selectAutocompleteConfig = {
  ...defaultAriaLabelConfiguration,
  values: [
    {
      label: 'Country',
      value: 'country',
    },
    {
      label: 'State/Province',
      value: 'address-level1',
    },
    {
      label: 'Gender',
      value: 'sex',
    },
  ],
};
