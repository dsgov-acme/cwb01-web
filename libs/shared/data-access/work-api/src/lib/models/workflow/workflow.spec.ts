import { WorkflowMock } from './workflow.mock';
import { IWorkflow, WorkflowModel } from './workflow.model';

describe('WorkflowModel', () => {
  let workflowModel: WorkflowModel;

  beforeEach(() => {
    workflowModel = new WorkflowModel(WorkflowMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(workflowModel.description).toEqual(WorkflowMock.description);
      expect(workflowModel.name).toEqual(WorkflowMock.name);
      expect(workflowModel.processDefinitionId).toEqual(WorkflowMock.processDefinitionId);
      expect(workflowModel.processDefinitionKey).toEqual(WorkflowMock.processDefinitionKey);
    });

    test('should set description to empty when workflowShema.description is undefined', () => {
      const workflowMock2: IWorkflow = {
        name: 'FinancialBenefit',
        processDefinitionId: 'workflowId',
        processDefinitionKey: 'workflowKey',
      };
      const descUndefinedModel = new WorkflowModel(workflowMock2);
      workflowModel.fromSchema(descUndefinedModel);
      expect(workflowModel.description).toEqual('');
      expect(workflowModel.name).toEqual(WorkflowMock.name);
      expect(workflowModel.processDefinitionId).toEqual(WorkflowMock.processDefinitionId);
      expect(workflowModel.processDefinitionKey).toEqual(WorkflowMock.processDefinitionKey);
    });
  });

  test('toSchema', () => {
    expect(workflowModel.toSchema()).toEqual(WorkflowMock);
  });
});
