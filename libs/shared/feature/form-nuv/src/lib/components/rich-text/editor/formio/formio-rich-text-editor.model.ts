import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from '../../../../utils';

import { DEFAULT_COMPONENT_OPTIONS } from '../../../base';
import { FormioTextContentComponent } from './formio-rich-text-editor.component';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * FormIO text content configuration: https://formio.github.io/formio.js/docs/file/src/components/content/Content.form.js.html
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 * CKeditor toolbar configuration https://ckeditor.com/docs/ckeditor4/latest/features/toolbarconcepts.html#item-by-item-configuration
 */

const selector = 'nuverial-rich-text-editor-wc';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  ...DEFAULT_COMPONENT_OPTIONS,
  group: 'hidden', // Build Group
  icon: 'regular fa-file-code', // Icon
  selector, // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Rich text editor', // Title of the component
  type: 'nuverialRichTextEditorContent', // custom type. Formio will identify the field with this type.
  weight: 0, // Optional: define the weight in the builder group
};

export function registerRichTextEditorComponent(injector: Injector) {
  if (!customElements.get(selector)) {
    registerCustomFormioComponent(COMPONENT_OPTIONS, FormioTextContentComponent, injector);
  }
}
