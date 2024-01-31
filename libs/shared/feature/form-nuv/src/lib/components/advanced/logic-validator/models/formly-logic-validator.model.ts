import { BaseFormlyFieldProperties } from '../../../base';

export interface LogicValidatorProperties extends BaseFormlyFieldProperties {
  modalIcon?: string;
  modalTitle: string;
  modalBody: string;
  failureLogicCondition: string;
  formErrorLabel?: string;
  dismissalButtonLabel: string;
}
