import { NuverialCardImagePositionType } from '@dsg/shared/ui/nuverial';
import { BaseFormlyFieldProperties } from '../../base';

export interface CheckboxCardFieldProperties extends BaseFormlyFieldProperties {
  cardContent?: string;
  cardTitle?: string;
  checked?: boolean;
  imagePath?: string;
  imageAltLabel?: string;
  imagePosition?: NuverialCardImagePositionType;
  invalid?: boolean;
  pointValue?: number;
  value?: string;
}
