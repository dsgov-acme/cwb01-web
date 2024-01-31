export interface INuverialSelectOption {
  color?: string;
  disabled: boolean;
  displayChipValue?: string;
  displayTextValue: string;
  key: string;
  prefixIcon?: string;
  selected: boolean;
}

export type NuverialSelectDropDownActionTypes = 'cancel' | 'close' | 'open';

export interface INuverialSelectDropDownOption {
  action: NuverialSelectDropDownActionTypes;
  ariaLabel: string;
  iconName: string;
}

export type NuverialSelectDropDownLabelsType = Record<NuverialSelectDropDownActionTypes, string>;
export type NuverialSelectDropDownType = Record<NuverialSelectDropDownActionTypes, INuverialSelectDropDownOption>;
