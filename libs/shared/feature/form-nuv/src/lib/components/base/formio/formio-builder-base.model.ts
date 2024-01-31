import { FormioCustomComponentInfo } from '../../../utils';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

export const DEFAULT_COMPONENT_OPTIONS: Partial<FormioCustomComponentInfo> = {
  fieldOptions: ['className', 'components', 'key', 'props', 'validators', 'validation'], // Optional: explicit field options to get as `Input` from the schema (may edited by the editForm)

  //  documentation: '', // Optional: define the documentation of the field
  //  schema: {}, // Optional: define extra default schema for the field
};

export const formioNumberValidator = {
  pattern: '^[0-9]*$',
  patternMessage: 'The property name must only contain numeric characters.',
  required: false,
};

export const formioAlphaNumericValidator = {
  pattern: '(\\w|\\w[\\w-.]*\\w)',
  patternMessage: 'The property name must only contain alphanumeric characters, underscores, dots and dashes and should not be ended by dash or dot.',
  required: true,
};

export const defaultPanelTabsConfiguration = {
  key: 'tabs',
  type: 'tabs',
};

export const storybookBaseUrl = 'https://nuvalence.github.io/dsgov-web';

export const formioDocumentDatagridKeyValidator = {
  custom: 'valid = data.components.reduce((acc, component) => acc && !!component.key, true);',
  customMessage: 'Document key name is required.',
};
