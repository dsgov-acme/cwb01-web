import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';
import {
  DEFAULT_COMPONENT_OPTIONS,
  defaultAriaLabelConfiguration,
  defaultAutoCompleteConfiguration,
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
} from '../../base';
import { FormioDatePickerComponent } from './formio-date-picker.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-date-picker-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'calendar', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Date Picker', // Title of the component
  type: 'nuverialDatePicker', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerDatePickerComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioDatePickerComponent, injector);
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
                  filteredKeyConfiguration,
                  { ...defaultFieldWidthConfiguration },
                  { ...defaultPlaceholderConfiguration },
                  { ...defaultColorThemeConfiguration },
                  { ...datePickerAutoCompleteConfig },
                  { ...datePickerStartView },
                  { ...datePickerStartAt },
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
              { ...validationTypeConfiguration },
              { ...datePickerMaxDate },
              { ...datePickerMinDate },
              { ...datePickerRelativeMaxDate },
              { ...datePickerRelativeMinDate },

              {
                ...defaultErrorMessagesPanelConfiguration,
                components: [
                  { ...defaultRequiredErrorMessageConfiguration },
                  { ...defaultMaxDateErrorMessageConfiguration },
                  { ...defaultMinDateErrorMessageConfiguration },
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

const filteredKeyConfiguration = {
  ...defaultPropertyKeyConfiguration,
  props: {
    allowedSchemaTypes: ['LocalDate', 'LocalTime'],
  },
};

const validationTypeConfiguration = {
  data: {
    values: [
      { label: 'Relative', value: 'relative' },
      { label: 'Absolute', value: 'absolute' },
    ],
  },
  defaultValue: 'absolute',
  input: true,
  key: 'props.validationType',
  label: 'Set absolute or relative validation',
  removeItemButton: false,
  searchEnabled: false,
  tooltip: 'This selector sets if date validation is reliatve or absolute',
  type: 'select',
};

export const datePickerMaxDate = {
  conditional: {
    eq: 'absolute',
    show: true,
    when: 'props.validationType',
  },
  key: 'props.maxDate',
  label: 'Maximum Date',
  tooltip: 'The maximum date that the calendar can select. Format should be yyyy-mm-dd.',
  type: 'nuverialDateInput',
};

export const datePickerMinDate = {
  conditional: {
    eq: 'absolute',
    show: true,
    when: 'props.validationType',
  },
  key: 'props.minDate',
  label: 'Minimum Date',
  tooltip: 'The minimum date that the calendar can select. Format should be yyyy-mm-dd.',
  type: 'nuverialDateInput',
};

export const datePickerRelativeMaxDate = {
  conditional: {
    eq: 'relative',
    show: true,
    when: 'props.validationType',
  },
  key: 'props.relativeMaxDate',
  label: 'Relative Max Date',
  props: {
    ariaLabel: 'Relative Max Date',
    type: 'number',
  },
  tooltip: 'Relative maximum date that the calendar can select. A positive value will set the date in the future, while negative will be the past',
  type: 'nuverialRelativeDateInput',
};

export const datePickerRelativeMinDate = {
  conditional: {
    eq: 'relative',
    show: true,
    when: 'props.validationType',
  },
  key: 'props.relativeMinDate',
  label: 'Relative Min Date',
  props: {
    ariaLabel: 'Relative Min Date',
    type: 'number',
  },
  tooltip: 'Relative minimum date that the calendar can select. A positive value will set the date in the future, while negative will be the past',
  type: 'nuverialRelativeDateInput',
};

const datePickerStartAt = {
  format: 'yyyy-MM-dd',

  input: true,
  key: 'props.startAt',
  label: 'Start At',
  placeholder: 'yyyy-mm-dd',
  tooltip: 'The date that the calendar should open to. Format should be yyyy-mm-dd.',
  type: 'datetime',
};

const datePickerStartView = {
  data: {
    values: [
      {
        label: 'Month',
        value: 'month',
      },
      {
        label: 'Year',
        value: 'year',
      },
      {
        label: 'Multi-year',
        value: 'multi-year',
      },
    ],
  },
  dataSrc: 'values',
  defaultValue: 'month',
  input: true,
  key: 'props.startView',
  label: 'Start View',
  placeholder: 'Start View',
  tooltip: 'The view that the calendar should start in.',
  type: 'select',
};

const datePickerAutoCompleteConfig = {
  ...defaultAutoCompleteConfiguration,
  values: [
    {
      label: 'Date of Birth',
      value: 'bday',
    },
  ],
};

const defaultMaxDateErrorMessageConfiguration = {
  input: true,
  key: 'validation.messages.datePickerMax',
  label: 'Max date error message',
  placeholder: 'Invalid maximum date',
  tooltip: 'Override the default maximum date error message.',
  type: 'textfield',
  weight: 0,
};

const defaultMinDateErrorMessageConfiguration = {
  input: true,
  key: 'validation.messages.datePickerMin',
  label: 'Min date error message',
  placeholder: 'Invalid minimum date',
  tooltip: 'Override the default minimum date error message.',
  type: 'textfield',
  weight: 0,
};
