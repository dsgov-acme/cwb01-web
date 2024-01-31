import { BaseListFormlyFieldProperties } from '../../../base';

export interface FormlyObjectListFieldProperties extends BaseListFormlyFieldProperties {
  addItemLabel?: string;
  includeIndex?: boolean;
  includeLabel?: boolean;
  includeRemoveItemAction?: boolean;
  removeItemLabel?: string;
}
