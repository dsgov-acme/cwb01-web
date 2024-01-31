import { SchemaModel } from '@dsg/shared/utils/http';

export interface IFormSelectionRule {
  task?: string;
  viewer?: string;
  context?: string;
  formConfigurationKey: string;
}

export type TransactionStatus = 'draft';

export interface ITransactionStatusCount {
  status: string;
  count: number;
}

export interface TransactionDefinitionsTableData {
  category: string;
  createdTimestamp: string;
  description: string;
  id?: string;
  key: string;
  lastUpdatedTimestamp: string;
  name: string;
}

export interface ITransactionDefinitionsMetaData {
  category: string;
  defaultFormConfigurationKey: string;
  description: string;
  key: string;
  name: string;
  processDefinitionKey: string;
  schemaKey: string;
  formConfigurationSelectionRules: IFormSelectionRule[];
}

export interface ITransactionDefinition {
  category: string;
  createdTimestamp: string;
  defaultFormConfigurationKey: string;
  defaultStatus: TransactionStatus;
  description: string;
  entitySchema: string;
  formConfigurationSelectionRules: IFormSelectionRule[];
  id?: string;
  key: string;
  lastUpdatedTimestamp: string;
  name: string;
  processDefinitionKey: string;
  schemaKey: string;
}

export class TransactionDefinitionModel implements SchemaModel<ITransactionDefinition> {
  public category = '';
  public createdTimestamp = '';
  public defaultFormConfigurationKey = '';
  public defaultStatus: TransactionStatus = 'draft';
  public description = '';
  public entitySchema = '';
  public formConfigurationSelectionRules: IFormSelectionRule[] = [];
  public id?: string;
  public key = '';
  public lastUpdatedTimestamp = '';
  public name = '';
  public processDefinitionKey = '';
  public schemaKey = '';

  constructor(transactionDefinition?: ITransactionDefinition) {
    if (transactionDefinition) {
      this.fromSchema(transactionDefinition);
    }
  }

  public fromSchema(transactionDefinition: ITransactionDefinition) {
    this.category = transactionDefinition.category;
    this.createdTimestamp = transactionDefinition.createdTimestamp;
    this.defaultFormConfigurationKey = transactionDefinition.defaultFormConfigurationKey;
    this.defaultStatus = transactionDefinition.defaultStatus;
    this.description = transactionDefinition.description;
    this.entitySchema = transactionDefinition.entitySchema;
    this.formConfigurationSelectionRules = transactionDefinition.formConfigurationSelectionRules;
    this.id = transactionDefinition.id;
    this.key = transactionDefinition.key;
    this.lastUpdatedTimestamp = transactionDefinition.lastUpdatedTimestamp;
    this.name = transactionDefinition.name;
    this.processDefinitionKey = transactionDefinition.processDefinitionKey;
    this.schemaKey = transactionDefinition.schemaKey;
  }

  public toSchema(): ITransactionDefinition {
    return {
      category: this.category,
      createdTimestamp: this.createdTimestamp,
      defaultFormConfigurationKey: this.defaultFormConfigurationKey,
      defaultStatus: this.defaultStatus,
      description: this.description,
      entitySchema: this.entitySchema,
      formConfigurationSelectionRules: this.formConfigurationSelectionRules,
      id: this.id,
      key: this.key,
      lastUpdatedTimestamp: this.lastUpdatedTimestamp,
      name: this.name,
      processDefinitionKey: this.processDefinitionKey,
      schemaKey: this.schemaKey,
    };
  }
}
