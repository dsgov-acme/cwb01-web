import { SchemaModel } from '@dsg/shared/utils/http';
import { FormioForm } from '@formio/angular';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { ExtendedComponentSchema } from 'formiojs';

export const CONFIRMATION_STEP_KEY = 'confirmation';

const FORM_CONFIGURATION_KEYS_TO_KEEP = ['input'];

const FORM_CONFIGURATION_KEYS_WITH_EMPTY_VALUES_TO_KEEP = ['components'];

// We don't need these properties, formly doesn't use them
const FORM_CONFIGURATION_KEYS_TO_REMOVE = [
  'breadcrumb',
  'breadcrumbClickable',
  'buttonSettings',
  'clearOnHide',
  'id',
  'initialValues', // This is used for builder schema hard coded initial values, we don't need this to save this in the api
  'labelPosition',
  'persistent',
  'theme',
  'validateOn',
  'widget',
];

const COMPONENTS_TO_INCLUDE_PARENT_LABEL = ['nuverialFileUpload', 'nuverialMultipleFileUpload', 'nuverialAddress'];

export interface FormElement {
  component: IFormConfigurationSchema | undefined;
  label: string;
  parent: IFormConfigurationSchema | undefined;
}

/** removes empty properties, empty objects, empty arrays, empty strings, and false, and numeric zeros */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeEmptyProperties = (obj: ExtendedComponentSchema): any => {
  function acceptValueType(value: unknown): boolean {
    if (!value) return false;

    return typeof value === 'boolean' || typeof value === 'number' || value instanceof Date || !!Object.keys(value).length;
  }

  if (!obj) return;

  if (Array.isArray(obj)) {
    return obj.filter(Boolean).map(removeEmptyProperties);
  }

  if (typeof obj !== 'object') return obj;

  return (
    Object.entries(obj)
      .map(([key, value]) => {
        if (FORM_CONFIGURATION_KEYS_TO_KEEP.includes(key)) {
          return [key, value]; // Skip processing children properties;
        }

        return [key, removeEmptyProperties.bind(this)(value)];
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any, [key, value]) => {
        if (FORM_CONFIGURATION_KEYS_TO_REMOVE.includes(key)) {
          return acc;
        }

        if (
          FORM_CONFIGURATION_KEYS_TO_KEEP.includes(key) ||
          (FORM_CONFIGURATION_KEYS_WITH_EMPTY_VALUES_TO_KEEP.includes(key) && !acceptValueType(value)) ||
          acceptValueType(value)
        ) {
          acc[key] = value;
        }

        return acc;
      }, {})
  );
};

/** Convert formio components json to formly json */
export const formioToFormly = (formioSchema: IFormConfigurationSchema[]): IRendererFormConfigurationSchema[] => {
  if (!formioSchema) return [];

  return formioSchema.map((component: IFormConfigurationSchema) => {
    const { components, ..._component } = component;

    if (_component.type === 'panel') {
      const { expressions, key, props } = _component;

      return {
        expressions,
        fieldGroup: formioToFormly(components || []),
        props: {
          ...props,
          stepKey: key,
        },
      };
    }

    return {
      ..._component,
      ...(components && { fieldGroup: formioToFormly(components) }),
    };
  });
};

export interface SelectOption {
  key: string;
  displayTextValue: string;
}

export interface CustomFormlyFieldProps extends FormlyFieldProps {
  selectOptions?: SelectOption[];
  formErrorLabel?: string;
}

export interface IFormConfigurationSchema<PropsT = CustomFormlyFieldProps> extends ExtendedComponentSchema {
  props?: PropsT;
  key?: string;
  components?: IFormConfigurationSchema[];
}
export type IRendererFormConfigurationSchema = FormlyFieldConfig;

export class FormConfigurationModel implements SchemaModel<IFormConfigurationSchema[]> {
  /**
   * The initial components schema
   */
  public components: IFormConfigurationSchema[] = [];

  private _toFormlyForm(): IRendererFormConfigurationSchema[] {
    return [
      {
        className: 'flex-full',
        fieldGroup: formioToFormly(this.components),
        type: 'nuverialSteps',
      },
    ];
  }

  constructor(FormConfigurationSchema?: IFormConfigurationSchema[], _removeEmptyProperties?: boolean) {
    if (FormConfigurationSchema) {
      this.fromSchema(_removeEmptyProperties ? removeEmptyProperties(FormConfigurationSchema) : FormConfigurationSchema);
    }
  }

  public fromSchema(FormConfigurationSchema: IFormConfigurationSchema[]) {
    this.components = FormConfigurationSchema;
  }

  public toSchema(): IFormConfigurationSchema[] {
    return this.toFormioJson();
  }

  public toFormioJson(): IFormConfigurationSchema[] {
    return this.components;
  }

  public toFormlyJson(): IRendererFormConfigurationSchema[] {
    return formioToFormly(this.components);
  }

  public toFormioBuilderForm(): FormioForm {
    return {
      components: this.components,
      display: 'wizard',
    };
  }

  public toIntakeForm(): IRendererFormConfigurationSchema[] {
    return this._toFormlyForm().map(formSteps => {
      const reviewStep = {
        className: 'flex-full',
        props: {
          label: 'Review & Submit',
          stepKey: CONFIRMATION_STEP_KEY,
        },
      };

      formSteps.fieldGroup?.push(reviewStep);

      return formSteps;
    });
  }

  public toReviewForm(): IRendererFormConfigurationSchema[] {
    return this._toFormlyForm();
  }

  public getComponentByKey(componentKey: string, componentsArr: IFormConfigurationSchema[] = this.components || []): IFormConfigurationSchema | undefined {
    for (const component of componentsArr) {
      if (component.key === componentKey) {
        return component;
      }

      if (component.components) {
        const nestedComponent = this.getComponentByKey(componentKey, component.components);
        if (nestedComponent) {
          return nestedComponent;
        }
      }
    }

    return undefined;
  }

  /**
   * Calculates the component label from the component and the parent component in some cases
   */
  public getComponentLabelByKey(key: string): string {
    const { label } = this.getComponentDataByKey(key);

    return label;
  }

  /**
   * Calculates the component label from the component and the parent component in some cases,
   * returns the label, the component and the parent component
   */
  public getComponentDataByKey(key: string): FormElement {
    let label = '';
    let resultComponent: object | undefined;
    let parentComponent: object | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchNested = (currentObj: any, parent?: any): void => {
      for (const prop in currentObj) {
        if (typeof currentObj[prop] !== 'object') continue;

        if (currentObj[prop].key === key) {
          const parentLabel = parent?.props?.label;
          const componentLabel = currentObj[prop]?.props?.label;
          parentComponent = parent;
          const component = currentObj[prop];

          if (COMPONENTS_TO_INCLUDE_PARENT_LABEL.includes(parent?.type)) {
            label = parentLabel;
            resultComponent = parentComponent;

            if (componentLabel) {
              label += ` - ${componentLabel}`;
            }

            return;
          }

          label = componentLabel;
          resultComponent = component;

          return;
        }

        searchNested(currentObj[prop], currentObj);
      }
    };

    searchNested(this.components);

    return { component: resultComponent, label: label || key, parent: parentComponent };
  }

  public findComponentsKeyInOrder(keysToFind: string[]): string[] {
    const foundKeys: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchNested = (currentObj: any): void => {
      for (const prop in currentObj) {
        if (typeof currentObj[prop] !== 'object') continue;

        if (keysToFind.includes(currentObj[prop].key)) {
          foundKeys.push(currentObj[prop].key);
        }

        searchNested(currentObj[prop]);
      }
    };

    searchNested(this.components);

    return foundKeys;
  }
}
