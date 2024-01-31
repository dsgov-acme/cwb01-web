import { FormConfigurationModel, IFormConfigurationSchema } from '@dsg/shared/data-access/work-api';
import { partition } from 'lodash';

export interface KeyPartition {
  componentKey: string;
  indices: string[];
  splitKey: string[];
}

interface ComponentLabelValidity {
  component?: IFormConfigurationSchema;
  label: string;
  valid: boolean;
}

/**
 * Splits a key into a pure key path, a list of indices, and a raw split key
 */
export function splitIndicesFromKey(key: string): KeyPartition {
  const splitKey = key.split(/(\[\d\])/g).filter(Boolean); // Remove empty strings from result (e.g. ['documents', ''])]);
  const partitionedKey = partition(splitKey, part => part.includes('['));
  const indices = partitionedKey[0];
  const componentKey = partitionedKey[1].join('');

  return { componentKey, indices, splitKey };
}

/**
 * Returns the component, label and a validity flag for a given key.
 * If the key does exist in the form configuration, or a label could not be found, the validity flag will be false
 */
export function getComponentLabelValidity(key: string, formConfiguration?: FormConfigurationModel): ComponentLabelValidity {
  const ret = { label: '', valid: false };

  const formElement = formConfiguration?.getComponentDataByKey(key);
  if (!formElement) return ret;
  const label = formElement.label;
  if (!label) return ret; // Nothing happens if label is undefined

  const component = formElement.component;

  return { component: component, label: label, valid: true };
}

export function componentIsListType(component?: IFormConfigurationSchema): boolean {
  return component?.type == 'nuverialFormList' || component?.type == 'nuverialMultipleFileUpload';
}

export function displayValueOrBlank(state: string): string {
  const isBlank = !state || state === '' || state === 'null';

  return isBlank ? 'blank' : state;
}
