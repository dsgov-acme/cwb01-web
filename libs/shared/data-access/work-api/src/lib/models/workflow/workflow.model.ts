import { IPaginationResponse, SchemaModel } from '@dsg/shared/utils/http';

export interface IWorkflowTask {
  id: string;
  name: string;
}

export interface IWorkflow {
  processDefinitionId: string;
  processDefinitionKey: string;
  name: string;
  description?: string;
}

export interface IWorkflowPaginationResponse<T> extends IPaginationResponse {
  items: T[];
}

export class WorkflowModel implements SchemaModel<IWorkflow> {
  public description = '';
  public name = '';
  public processDefinitionId = '';
  public processDefinitionKey = '';

  constructor(workflowSchema?: IWorkflow) {
    if (workflowSchema) {
      this.fromSchema(workflowSchema);
    }
  }

  public fromSchema(workflowSchema: IWorkflow) {
    this.description = workflowSchema?.description || '';
    this.name = workflowSchema.name;
    this.processDefinitionId = workflowSchema.processDefinitionId;
    this.processDefinitionKey = workflowSchema.processDefinitionKey;
  }

  public toSchema(): IWorkflow {
    return { description: this.description, name: this.name, processDefinitionId: this.processDefinitionId, processDefinitionKey: this.processDefinitionKey };
  }
}
