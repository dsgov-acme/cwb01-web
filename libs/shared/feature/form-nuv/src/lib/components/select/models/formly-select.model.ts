import { INuverialSelectOption, NuverialSelectDropDownLabelsType } from '@dsg/shared/ui/nuverial';
import { BaseFormlyFieldProperties } from '../../base';

export interface SelectFieldProperties extends BaseFormlyFieldProperties {
  ariaDescribedBy?: string;
  ariaLabel?: string;
  displayError?: boolean;
  dropDownArialLabels?: NuverialSelectDropDownLabelsType;
  formControlName?: string;
  label?: string;
  placeholder?: string;
  prefixIcon?: string;
  required?: boolean;
  selectedOptionIconName?: string;
  selectOptions?: INuverialSelectOption[];
  selectOptionsJSON?: string;
  autocomplete?: string;
}
