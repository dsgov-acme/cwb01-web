import { storybookBaseUrl } from './formio-builder-base.model';
export const defaultConditionalPanelConfiguration = {
  key: 'conditional',
  label: 'Conditional',
  weight: 0,
};

export const defaultConditionalPanelDocumentationLink = {
  html: `<a href="${storybookBaseUrl}/?path=/docs/dsg-forms--conditional" target="_blank">Conditional panel guidelines</a>`,
  input: false,
  key: 'content',
  label: 'Content',
  refreshOnChange: false,
  tableView: false,
  type: 'content',
};

export const defaultHideConditionalConfiguration = {
  input: true,
  key: 'expressions.hide',
  label: 'Hide',
  placeholder: 'ex. !model.firstName',
  tooltip: `Conditionally hide a field, required validation will only be required if this logic is truthy.`,
  type: 'textfield',
  weight: 0,
};

export const defaultDisabledConditionalConfiguration = {
  input: true,
  key: `expressions['props.disabled']`,
  label: 'Disable',
  placeholder: 'ex. !model.firstName',
  tooltip: `Conditionally disable a field.`,
  type: 'textfield',
  weight: 0,
};

export const defaultRequiredConditionalConfiguration = {
  input: true,
  key: `expressions['props.required']`,
  label: 'Require',
  placeholder: 'ex. model.firstName',
  tooltip: `Conditionally require a field, takes precedence over required validation if set, in general prefer setting required validation and conditional hide logic.`,
  type: 'textfield',
  weight: 0,
};

export const defaultCompleteConditionalPanelConfiguration = {
  // Conditional Panel
  ...defaultConditionalPanelConfiguration,
  components: [
    {
      ...defaultConditionalPanelDocumentationLink,
    },
    {
      ...defaultHideConditionalConfiguration,
    },
    {
      ...defaultDisabledConditionalConfiguration,
    },
    {
      ...defaultRequiredConditionalConfiguration,
    },
  ],
};
