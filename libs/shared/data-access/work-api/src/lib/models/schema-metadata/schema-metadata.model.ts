import { SchemaModel } from '@dsg/shared/utils/http';
import { ISchemaMetaData } from '../form/form.model';

export class SchemaMetadataModel implements SchemaModel<ISchemaMetaData> {
  public name = '';
  public key = '';
  public createdBy = '';
  public lastUpdatedBy = '';
  public description = '';
  public status = '';

  constructor(SchemaMetadataSchema?: ISchemaMetaData) {
    if (SchemaMetadataSchema) {
      this.fromSchema(SchemaMetadataSchema);
    }
  }

  public toSchema(): ISchemaMetaData {
    return {
      createdBy: this.createdBy,
      description: this.description,
      key: this.key,
      lastUpdatedBy: this.lastUpdatedBy,
      name: this.name,
      status: this.status,
    };
  }

  public fromSchema(SchemaMetadataSchema: ISchemaMetaData) {
    this.name = SchemaMetadataSchema.name;
    this.key = SchemaMetadataSchema.key;
    this.createdBy = SchemaMetadataSchema.createdBy;
    this.lastUpdatedBy = SchemaMetadataSchema.lastUpdatedBy;
    this.description = SchemaMetadataSchema.description;
    this.status = SchemaMetadataSchema.status || '';
  }
}
