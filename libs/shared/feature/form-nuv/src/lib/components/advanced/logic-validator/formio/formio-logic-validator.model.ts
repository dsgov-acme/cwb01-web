import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../../utils';
import { DEFAULT_COMPONENT_OPTIONS, defaultDisplayBasicConfiguration, defaultDisplayPanelConfiguration, defaultPanelTabsConfiguration } from '../../../base';
import { storybookBaseUrl } from '../../../base/formio/formio-builder-base.model';
import { FormioLogicValidatorComponent } from './formio-logic-validator.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-logic-validator-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverialAdvanced', // Build Group
  icon: 'check', // Icon
  schema: { input: false },
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Logic Validator', // Title of the component
  type: 'nuverialLogicValidator', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerLogicValidatorComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioLogicValidatorComponent, injector);
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
                  { ...defaultMaterialDesignDocumentationLink },
                  { ...defaultIconDocumentationLink },
                  { ...modalIconConfiguration },
                  { ...modalTitleConfiguration },
                  { ...modalBodyConfiguration },
                  { ...dismissalButtonLabelConfiguration },
                  { ...formErrorLabelConfiguration },
                  { ...failureLogicConditionConfiguration },
                  { ...defaultConditionalPanelDocumentationLink },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export const defaultMaterialDesignDocumentationLink = {
  html: `<a href="${storybookBaseUrl}/?path=/docs/dsg-theme--theme#material-design" target="_blank">Material design theme guidelines</a>`,
  input: false,
  key: 'content',
  label: 'Content',
  refreshOnChange: false,
  tableView: false,
  type: 'content',
};

export const defaultIconDocumentationLink = {
  html: `<a href="https://fonts.google.com/icons" target="_blank">Material design icons</a>`,
  input: false,
  key: 'content',
  label: 'Content',
  refreshOnChange: false,
  tableView: false,
  type: 'content',
};

const modalIconConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.modalIcon',
  label: 'Modal Icon',
  placeholder: 'Modal Icon',
  type: 'textfield',
};

const modalTitleConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.modalTitle',
  label: 'Modal Title',
  placeholder: 'Modal title',
  type: 'textfield',
  validate: {
    required: true,
  },
};

const modalBodyConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.modalBody',
  label: 'Modal Body',
  placeholder: 'Modal body',
  type: 'textarea',
};

const dismissalButtonLabelConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.dismissalButtonLabel',
  label: 'Modal Dismissal Button Label',
  placeholder: 'Modal Dismissal Button Label',
  type: 'textfield',
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

export const failureLogicConditionConfiguration = {
  input: true,
  key: `expressions['props.required']`,
  label: 'Failure Logic Condition',
  placeholder: 'ex. model.firstName',
  tooltip: `Expression that describes in which cases this modal should be shown.`,
  type: 'textarea',
  validate: {
    required: true,
  },
  weight: 0,
};

const formErrorLabelConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.formErrorLabel',
  label: 'Form error label',
  placeholder: 'Form error label',
  tooltip: 'Customize the error label displayed at the top of the intake form when proceeding to the next step and the failure logic condition is met.',
  type: 'textfield',
  validate: {
    required: true,
  },
};
