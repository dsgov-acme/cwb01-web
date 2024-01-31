import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';
import {
  DEFAULT_COMPONENT_OPTIONS,
  defaultColorThemeConfiguration,
  defaultCompleteConditionalPanelConfiguration,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultErrorMessagesPanelConfiguration,
  defaultFieldWidthConfiguration,
  defaultPanelTabsConfiguration,
  defaultPropertyKeyConfiguration,
  defaultRequiredConfiguration,
  defaultRequiredErrorMessageConfiguration,
  defaultValidationPanelConfiguration,
  defaultValidationPanelDocumentationLink,
} from '../../base';
import { FormioSimpleChoiceQuestionsComponent } from './formio-simple-choice-questions.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-simple-choice-questions-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'id-card', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Simple Choice Questions', // Title of the component
  type: 'nuverialRadioCards', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerSimpleChoiceQuestionsComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioSimpleChoiceQuestionsComponent, injector);
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
                  { ...cardQuestionConfiguration },
                  { ...defaultPropertyKeyConfiguration },
                  { ...defaultColorThemeConfiguration },
                  { ...defaultFieldWidthConfiguration },
                  { ...cardColumnsConfiguration },
                ],
              },
              {
                ...displayRadiocards,
                components: [{ ...simpleChoiceQuestions }],
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
              { ...formErrorLabelConfiguration },
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

const cardQuestionConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.label',
  label: 'Question',
  placeholder: 'Question',
  type: 'textfield',
  validate: {
    required: true,
  },
};

const formErrorLabelConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.formErrorLabel',
  label: 'Form error label',
  placeholder: 'Form error label',
  tooltip: 'Customize the error label displayed at the top of the intake form when proceeding to the next step with a field error.',
  type: 'textfield',
};

const displayRadiocards = {
  key: 'simpleChoiceQuestionsPanel',
  label: 'Answers',
  theme: 'default',
  title: 'Answers',
  type: 'panel',
  weight: 10,
};

const simpleChoiceQuestions = {
  collapsible: false,
  components: [
    {
      input: true,
      inputType: 'number',
      key: 'pointValue',
      label: 'Point value',
      placeholder: 'Point value',
      type: 'textfield',
    },
    {
      input: true,
      inputType: 'text',
      key: 'value',
      label: 'Card Value',
      placeholder: 'Card value',
      type: 'textfield',
    },
    {
      input: true,
      inputType: 'text',
      key: 'title',
      label: 'Card Title',
      placeholder: 'Card title',
      type: 'textfield',
    },
    {
      input: true,
      inputType: 'text',
      key: 'content',
      label: 'Card content',
      placeholder: 'Card content',
      type: 'textarea',
    },
  ],
  key: 'props.answers',
  label: 'Answers',
  reorder: true,
  tableView: false,
  tooltip: 'List of answer options.',
  type: 'datagrid',
};

const cardColumnsConfiguration = {
  defaultValue: 2,
  input: true,
  inputFormat: 'plain',
  key: 'props.cols',
  label: 'Answers per row',
  tooltip: 'Determines the number of answers per row',
  type: 'number',
  validate: {
    integer: true,
    min: 1,
    required: true,
  },
  weight: 0,
};
