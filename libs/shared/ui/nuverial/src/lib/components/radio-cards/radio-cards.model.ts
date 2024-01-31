import { NuverialCardImagePositionType } from '../../models';

export interface INuverialRadioCard {
  imagePosition?: NuverialCardImagePositionType;
  imagePath?: string;
  imageAltLabel?: string;
  pointValue?: number;
  value: string;
  title: string;
  content?: string;
  className?: string;
}
