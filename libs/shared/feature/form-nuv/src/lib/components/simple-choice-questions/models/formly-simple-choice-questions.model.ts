import { INuverialRadioCard } from '@dsg/shared/ui/nuverial';
import { BaseFormlyFieldProperties } from '../../base';

export interface CardsFieldProperties extends BaseFormlyFieldProperties {
  value?: string;
  answers?: INuverialRadioCard[];
  formErrorLabel?: string;
}
