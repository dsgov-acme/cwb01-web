import { NuverialInputFieldType } from '@dsg/shared/ui/nuverial';
import { BaseFormlyFieldProperties } from '../../base';

export interface FormlyTextInputFieldProperties extends BaseFormlyFieldProperties {
  prefixIcon?: string;
  prefixAriaLabel?: string;
  suffixIcon?: string;
  suffixAriaLabel?: string;
  showMaxLength?: number;
  mask?: string;
  type?: NuverialInputFieldType;
  autocomplete?: string;
  togglePassword?: boolean;
}
