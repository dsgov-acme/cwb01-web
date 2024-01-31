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
  defaultPropertyKeyConfiguration,
  defaultRequiredConfiguration,
  defaultRequiredErrorMessageConfiguration,
  defaultValidationPanelConfiguration,
  defaultValidationPanelDocumentationLink,
} from '../../base';
import { FormioDateRangePickerComponent } from './formio-date-range-picker.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-date-range-picker-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'calendar', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Date Range Picker', // Title of the component
  type: 'nuverialDateRangePicker', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerDateRangePickerComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioDateRangePickerComponent, injector);
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
                  { ...defaultColorThemeConfiguration },
                  { ...DateRangePickerStartView },
                  { ...DateRangePickerStartDatePlaceholder },
                  { ...DateRangePickerEndDatePlaceholder },
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

const filteredKeyConfiguration = {
  ...defaultPropertyKeyConfiguration,
  props: {
    allowedSchemaTypes: ['LocalDate', 'LocalTime'],
  },
};

const DateRangePickerStartDatePlaceholder = {
  format: 'yyyy-MM-dd',
  input: true,
  key: 'props.startDatePlaceholder',
  label: 'Start Date Placeholder',
  placeholder: 'yyyy-mm-dd',
  tooltip: 'DatePicker place holder start date input field. Default undefined',
  type: 'datetime',
  weight: 100,
};

const DateRangePickerEndDatePlaceholder = {
  format: 'yyyy-MM-dd',
  input: true,
  key: 'props.endDatePlaceholder',
  label: 'End Date Placeholder',
  placeholder: 'yyyy-mm-dd',
  tooltip: 'DatePicker place holder end date input field. Default undefined',
  type: 'datetime',
  weight: 100,
};

const DateRangePickerStartView = {
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
