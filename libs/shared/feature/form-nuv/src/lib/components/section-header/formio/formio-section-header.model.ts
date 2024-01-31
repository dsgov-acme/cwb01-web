import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';
import {
  DEFAULT_COMPONENT_OPTIONS,
  defaultConditionalPanelConfiguration,
  defaultConditionalPanelDocumentationLink,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultHideConditionalConfiguration,
  defaultPanelTabsConfiguration,
} from '../../base';
import { FormioSectionHeaderComponent } from './formio-section-header.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

const selector = 'nuverial-section-header-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'forward', // Icon
  schema: { input: false },
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Section Header', // Title of the component
  type: 'nuverialSectionHeader', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerSectionHeaderComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioSectionHeaderComponent, injector);
  }
}

function editForm() {
  return {
    components: [
      {
        // Tabsw
        ...defaultPanelTabsConfiguration,
        components: [
          {
            // Display Panel
            ...defaultDisplayPanelConfiguration,
            components: [
              {
                ...defaultDisplayBasicConfiguration,
                components: [{ ...defaultHeaderLabelConfiguration }, { ...defaultHeaderWidthConfiguration }],
              },
            ],
          },
          {
            // Conditional Panel
            ...defaultConditionalPanelConfiguration,
            components: [
              {
                ...defaultConditionalPanelDocumentationLink,
              },
              {
                ...defaultHideConditionalConfiguration,
              },
            ],
          },
        ],
      },
    ],
  };
}

const defaultHeaderLabelConfiguration = {
  input: true,
  key: 'props.label',
  label: 'Header Label',
  placeholder: 'Section Label',
  tooltip: 'The label to use for the section header.',
  type: 'textfield',
  validate: {
    required: true,
  },
  weight: 0,
};

const defaultHeaderWidthConfiguration = {
  data: {
    values: [
      {
        label: 'Full width',
        value: 'flex-full',
      },
      {
        label: 'Half width',
        value: 'flex-half',
      },
      {
        label: 'Third width',
        value: 'flex-third',
      },
    ],
  },
  dataSrc: 'values',
  defaultValue: 'flex-full',
  input: true,
  key: 'className',
  label: 'Secton header width',
  tooltip: 'Controls the width of the section header',
  type: 'select',
  weight: 0,
};
