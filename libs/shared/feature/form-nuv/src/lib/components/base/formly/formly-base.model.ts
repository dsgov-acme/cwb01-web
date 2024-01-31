import { NuverialColorThemeType, NuverialFieldLabelPositionType, NuverialValidationErrorType } from '@dsg/shared/ui/nuverial';
import { FormlyFieldProps } from '@ngx-formly/core';

export interface BaseFormlyFieldProperties extends FormlyFieldProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  colorTheme?: NuverialColorThemeType;
  componentId?: string;
  displayError?: boolean;
  fieldLabelPosition?: NuverialFieldLabelPositionType;
  hint?: string;
  tooltip?: string;
  validationMessages?: NuverialValidationErrorType;
}

export interface BaseAdvancedFormlyFieldProperties extends BaseFormlyFieldProperties {
  key?: string | number | Array<string | number>;
  populated?: boolean;
}

export interface BaseListFormlyFieldProperties extends FormlyFieldProps {
  populated?: boolean;
}
