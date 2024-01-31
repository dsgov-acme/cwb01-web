import { BaseAdvancedFormlyFieldProperties } from '../../../base';

export interface FileUploadFieldProperties extends BaseAdvancedFormlyFieldProperties {
  content?: string;
  filename?: string;
  maxFileSize?: number;
  multiple?: boolean;
}
