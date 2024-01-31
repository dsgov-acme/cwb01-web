import { BaseFormlyFieldProperties } from '../../base';

export interface TextContentFieldProperties extends BaseFormlyFieldProperties {
  content: string;
  hideInReviewPage?: boolean;
}
