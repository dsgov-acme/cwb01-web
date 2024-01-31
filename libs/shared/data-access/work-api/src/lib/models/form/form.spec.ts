import { FormConfigurationModel } from '../form-configuration/form-configuration.model';
import { FormMock, ToSchemaFormMock } from './form.mock';
import { FormModel } from './form.model';
describe('TransactionModel', () => {
  let formModel: FormModel;
  beforeEach(() => {
    formModel = new FormModel(FormMock);
  });

  describe('fromSchema', () => {
    it('should set all public properties', () => {
      expect(formModel.taskName).toEqual(FormMock.taskName);
      expect(formModel.formConfigurationModel).toEqual(new FormConfigurationModel(FormMock.configuration.components));
    });
  });

  it('toSchema', () => {
    expect(formModel.toSchema()).toEqual(ToSchemaFormMock);
  });
});
