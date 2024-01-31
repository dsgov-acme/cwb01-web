import { BaseFormlyFieldProperties } from '../../base';

export interface FormlyTextAreaFieldProperties extends BaseFormlyFieldProperties {
  autoSize?: boolean;
  autoSizeMinRows?: number;
  autoSizeMaxRows?: number;
  showMaxLength?: number;
}
