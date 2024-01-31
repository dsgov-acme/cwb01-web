import { PagingResponseModel } from '@dsg/shared/utils/http';
import { IWorkflow, IWorkflowPaginationResponse, IWorkflowTask } from './workflow.model';

export const WorkflowTaskMock: IWorkflowTask = {
  id: 'id',
  name: 'name',
};

export const WorkflowMock: IWorkflow = {
  description: 'description',
  name: 'FinancialBenefit',
  processDefinitionId: 'workflowId',
  processDefinitionKey: 'workflowKey',
};

export const WorkflowListMock: IWorkflow[] = [
  {
    description: 'description1',
    name: 'FinancialBenefit1',
    processDefinitionId: 'workflowId1',
    processDefinitionKey: 'workflowKey1',
  },
  {
    name: 'FinancialBenefit2',
    processDefinitionId: 'workflowId2',
    processDefinitionKey: 'workflowKey2',
  },
  {
    description: 'description3',
    name: 'FinancialBenefit3',
    processDefinitionId: 'workflowId3',
    processDefinitionKey: 'workflowKey3',
  },
];

export const WorkflowListSchemaMock: IWorkflowPaginationResponse<IWorkflow> = {
  items: WorkflowListMock,
  pagingMetadata: new PagingResponseModel({
    nextPage: '',
    pageNumber: 1,
    pageSize: 10,
    totalCount: 200,
  }),
};
