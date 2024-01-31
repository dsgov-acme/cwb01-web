import { IPaginationResponse, SchemaModel } from '@dsg/shared/utils/http';

export interface SchemaTableData {
  createdBy: string;
  createdTimestamp: string;
  description: string;
  key: string;
  lastUpdatedTimestamp: string;
  name: string;
  id: string;
}

export interface ISchemaDefinition {
  attributes: ISchemaDefinitionAttributes[];
  computedAttributes?: ISchemaComputedAttributes[];
  createdBy: string;
  createdTimestamp: string;
  description: string;
  key: string;
  lastUpdatedTimestamp: string;
  name: string;
  id: string;
  lastUpdatedBy: string;
  status?: string;
}

export interface IParentSchemas {
  parentSchemas: string[];
}

export interface ISchemaAttributeConfigurations {
  [key: string]: string;
  type: string;
}

export interface ISchemaDefinitionAttributes {
  constraints: unknown[];
  name: string;
  type: string;
  entitySchema?: string;
  attributeConfigurations?: ISchemaAttributeConfigurations[];
  contentType?: string;
  schema?: ISchemaDefinition;
  concatenatedContentType?: string;
}

export interface ISchemasPaginationResponse<T> extends IPaginationResponse {
  items: T[];
}

export interface ISchemaComputedAttributes {
  name: string;
  type: string;
  expression: string;
}

export class SchemaDefinitionModel implements SchemaModel<ISchemaDefinition> {
  public attributes: ISchemaDefinitionAttributes[] = [];
  public computedAttributes?: ISchemaComputedAttributes[];
  public createdBy = '';
  public createdTimestamp = '';
  public description = '';
  public id = '';
  public key = '';
  public lastUpdatedTimestamp = '';
  public name = '';
  public lastUpdatedBy = '';
  public status?: string = '';

  constructor(schemaDefinition?: ISchemaDefinition) {
    if (schemaDefinition) {
      this.fromSchema(schemaDefinition);
    }
  }

  public fromSchema(schemaDefinition: ISchemaDefinition) {
    this.attributes = schemaDefinition.attributes;
    this.createdBy = schemaDefinition.createdBy;
    this.createdTimestamp = schemaDefinition.createdTimestamp;
    this.description = schemaDefinition.description;
    this.id = schemaDefinition.id;
    this.key = schemaDefinition.key;
    this.lastUpdatedBy = schemaDefinition.lastUpdatedBy;
    this.lastUpdatedTimestamp = schemaDefinition.lastUpdatedTimestamp;
    this.name = schemaDefinition.name;
    if (schemaDefinition.computedAttributes) this.computedAttributes = schemaDefinition.computedAttributes;
  }

  public toSchema(): ISchemaDefinition {
    return {
      attributes: this.attributes,
      ...(this.computedAttributes && { computedAttributes: this.computedAttributes }),
      createdBy: this.createdBy,
      createdTimestamp: this.createdTimestamp,
      description: this.description,
      id: this.id,
      key: this.key,
      lastUpdatedBy: this.lastUpdatedBy,
      lastUpdatedTimestamp: this.lastUpdatedTimestamp,
      name: this.name,
    };
  }
}
