import { SchemaModel } from '@dsg/shared/utils/http';
import { IFormMetaData } from '../form/form.model';
export class FormMetadataModel implements SchemaModel<IFormMetaData> {
  public name = '';
  public schemaKey = '';
  public createdBy = '';
  public lastUpdatedBy = '';
  public description = '';
  public transactionDefinitionKey = '';
  public key = '';
  constructor(FormMetadataSchema: IFormMetaData) {
    this.fromSchema(FormMetadataSchema);
  }
  public toSchema(): IFormMetaData {
    return {
      createdBy: this.createdBy,
      description: this.description,
      key: this.key,
      lastUpdatedBy: this.lastUpdatedBy,
      name: this.name,
      schemaKey: this.schemaKey,
      transactionDefinitionKey: this.transactionDefinitionKey,
    };
  }

  public fromSchema(FormMetadataSchema: IFormMetaData) {
    this.name = FormMetadataSchema.name;
    this.schemaKey = FormMetadataSchema.schemaKey;
    this.createdBy = FormMetadataSchema.createdBy;
    this.lastUpdatedBy = FormMetadataSchema.lastUpdatedBy;
    this.description = FormMetadataSchema.description;
    this.transactionDefinitionKey = FormMetadataSchema.transactionDefinitionKey;
    this.key = FormMetadataSchema.key;
  }
}
