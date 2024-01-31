import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseAdvancedFormlyFieldProperties } from './formly-base.model';

/**
 * Used for pre-populating an advanced field group.
 * Set the key to undefined to:
 * - handle expressions on the field
 * - Handle mapping the form data to the correct place
 */
export function defaultPrePopulateAdvancedComponent(field: FormlyFieldConfig<BaseAdvancedFormlyFieldProperties>): void {
  if (isPrePopulated(field)) return;

  field.props = {
    ...field.props,
    key: field.key, // set the key in props for later use
    populated: true, // set populated to true to prevent running this again
  };
  field.key = undefined;
}

/**
 * Used for pre-populating display only components, to avoid creating a form control.
 */
export function defaultPrePopulateDisplayOnlyComponent(field: FormlyFieldConfig<BaseAdvancedFormlyFieldProperties>): void {
  if (isPrePopulated(field)) return;

  field.props = {
    ...field.props,
    populated: true, // set populated to true to prevent running this again
  };
  field.key = undefined;
}

/**
 * Used for pre-populating nested components.
 */
export function defaultPrePopulateListComponent(field: FormlyFieldConfig<BaseAdvancedFormlyFieldProperties>): void {
  if (isPrePopulated(field)) return;

  field.props = {
    ...field.props,
    populated: true, // set populated to true to prevent running this again
  };
  field.fieldArray = {
    fieldGroup: field.fieldGroup,
  };
  field.fieldGroup = undefined;
}

export function isPrePopulated(field: FormlyFieldConfig<BaseAdvancedFormlyFieldProperties>): boolean {
  return !!field.props?.populated;
}
