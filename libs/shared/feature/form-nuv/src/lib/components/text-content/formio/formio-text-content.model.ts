import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../utils';

import {
  DEFAULT_COMPONENT_OPTIONS,
  defaultConditionalPanelConfiguration,
  defaultConditionalPanelDocumentationLink,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultFieldWidthConfiguration,
  defaultHideConditionalConfiguration,
  defaultPanelTabsConfiguration,
} from '../../base';
import { FormioTextContentComponent } from './formio-text-content.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * FormIO text content configuration: https://formio.github.io/formio.js/docs/file/src/components/content/Content.form.js.html
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 * CKeditor toolbar configuration https://ckeditor.com/docs/ckeditor4/latest/features/toolbarconcepts.html#item-by-item-configuration
 */

const selector = 'nuverial-text-content-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
  group: 'nuverial', // Build Group
  icon: 'file-code-o', // Icon
  schema: { input: false },
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Text Content', // Title of the component
  type: 'nuverialTextContent', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerTextContentComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioTextContentComponent, injector);
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
                components: [{ ...hideInReviewPageConfiguration }, { ...ContentAreaDisplayConfiguration }, { ...defaultFieldWidthConfiguration }],
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

const ContentAreaDisplayConfiguration = {
  input: true,
  key: 'props.content',
  label: 'Content',
  tooltip: 'The HTML template for the result data items.',
  type: 'nuverialRichTextEditorContent',
  validate: {
    required: true,
  },
  weight: 0,
};

const hideInReviewPageConfiguration = {
  input: true,
  key: 'props.hideInReviewPage',
  label: 'Hide in review page ?',
  tooltip: 'Specify if this text content will be visible on the review page.',
  type: 'checkbox',
};
