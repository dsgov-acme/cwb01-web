import { storybookBaseUrl } from './formio-builder-base.model';

export const defaultValidationPanelConfiguration = {
  key: 'validation',
  label: 'Validation',
  weight: 0,
};

export const defaultValidationPanelDocumentationLink = {
  html: `<a href="${storybookBaseUrl}/?path=/docs/dsg-forms--validation" target="_blank">Validation panel guidelines</a>`,
  input: false,
  key: 'content',
  label: 'Content',
  refreshOnChange: false,
  tableView: false,
  type: 'content',
};

export const defaultRequiredConfiguration = {
  key: `props.required`,
  label: 'Required',
  tooltip: 'A required field must be filled in before the form can be submitted, the conditional require option will take precedence over this if it is set.',
  type: 'checkbox',
  weight: 0,
};

export const defaultMinConfiguration = {
  input: true,
  key: 'props.min',
  label: 'Minimum value of field',
  placeholder: 'Minimum value of the field',
  tooltip: 'Set the minimum value of a field',
  type: 'number',
  weight: 0,
};

export const defaultMaxConfiguration = {
  input: true,
  key: 'props.max',
  label: 'Maximum value of field',
  placeholder: 'Maximum value of the field',
  tooltip: 'Set the maximum value of a field',
  type: 'number',
  weight: 0,
};

export const defaultMinLengthConfiguration = {
  input: true,
  key: 'props.minLength',
  label: 'Minimum length of field',
  placeholder: 'Minimum length of the field',
  tooltip: 'Set the minimum character length of a field',
  type: 'number',
  weight: 0,
};

export const defaultMaxLengthConfiguration = {
  input: true,
  key: 'props.maxLength',
  label: 'Maximum length of field',
  placeholder: 'Maximum length of the field',
  tooltip: 'Set the maximum character length of a field',
  type: 'number',
  weight: 0,
};

export const defaultPatternConfiguration = {
  input: true,
  key: 'props.pattern',
  label: 'Pattern validation',
  placeholder: '[-_a-zA-Z0-9]*',
  tooltip: 'Set a pattern validation, must be regex.',
  type: 'textfield',
  weight: 0,
};

export const defaultShowMaxLengthConfiguration = {
  key: `props.showMaxLength`,
  label: 'Show max length',
  tooltip: 'Display the max length below the field on the right.',
  type: 'checkbox',
  weight: 0,
};

// Validation messages

export const defaultErrorMessagesPanelConfiguration = {
  collapsed: true,
  collapsible: true,
  key: 'validationMessagesPanel',
  theme: 'default',
  title: 'Validation error messages',
  type: 'panel',
  weight: 10,
};

export const defaultRequiredErrorMessageConfiguration = {
  input: true,
  key: 'validation.messages.required',
  label: 'Required error message',
  placeholder: 'Required',
  tooltip: 'Override the default required error message.',
  type: 'textfield',
  weight: 0,
};

export const defaultMinLengthErrorMessageConfiguration = {
  conditional: { json: { '!==': [{ var: 'data.props.minLength' }, null] } },
  input: true,
  key: 'validation.messages.minLength',
  label: 'Min length error message',
  placeholder: 'Invalid minimum length',
  tooltip: 'Override the default min length error message.',
  type: 'textfield',
  weight: 0,
};

export const defaultMaxLengthErrorMessageConfiguration = {
  conditional: { json: { '!==': [{ var: 'data.props.maxLength' }, null] } },
  input: true,
  key: 'validation.messages.maxLength',
  label: 'Max length error message',
  placeholder: 'Invalid maximum length',
  tooltip: 'Override the default max length error message.',
  type: 'textfield',
  weight: 0,
};

export const defaultMinErrorMessageConfiguration = {
  conditional: { json: { '!==': [{ var: 'data.props.min' }, null] } },
  input: true,
  key: 'validation.messages.min',
  label: 'Min value error message',
  placeholder: 'Invalid minimum value',
  tooltip: 'Override the default min value error message.',
  type: 'textfield',
  weight: 0,
};

export const defaultMaxErrorMessageConfiguration = {
  conditional: { json: { '!==': [{ var: 'data.props.max' }, null] } },
  input: true,
  key: 'validation.messages.max',
  label: 'Max value error message',
  placeholder: 'Invalid maximum value',
  tooltip: 'Override the default max value error message.',
  type: 'textfield',
  weight: 0,
};

export const defaultEmailErrorMessageConfiguration = {
  conditional: { json: { '===': [{ var: 'data.props.type' }, 'email'] } },
  input: true,
  key: 'validation.messages.email',
  label: 'Email error message',
  placeholder: 'Invalid email address',
  tooltip: 'Override the default email error message.',
  type: 'textfield',
  weight: 0,
};

export const defaultPatternErrorMessageConfiguration = {
  conditional: { json: { and: [{ var: 'data.props.pattern' }] } },
  input: true,
  key: 'validation.messages.pattern',
  label: 'pattern error message',
  placeholder: 'Invalid characters',
  tooltip: 'Override the default email error message.',
  type: 'textfield',
  weight: 0,
};
