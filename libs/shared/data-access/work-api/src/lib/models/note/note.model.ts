import { IPaginationResponse, SchemaModel } from '@dsg/shared/utils/http';

export interface INoteType {
  id: string;
  name?: string;
}

export interface INote {
  body: string;
  documents?: string[];
  title: string;
  type: INoteType;
  id: string;
  createdBy: string;
  lastUpdatedBy: string;
  createdTimestamp: string;
  lastUpdatedTimestamp: string;
}

export interface INotesPaginationResponse<T> extends IPaginationResponse {
  items: T[];
}

export class NoteModel implements SchemaModel<INote> {
  public body = '';
  public documents?: string[] = [];
  public title = '';
  public type: INoteType = { id: '', name: undefined };
  public id = '';
  public createdBy = '';
  public lastUpdatedBy = '';
  public createdTimestamp = '';
  public lastUpdatedTimestamp = '';
  public lastCreatedByDisplayName = '';
  public lastUpdatedByDisplayName = '';
  public expanded = false;

  constructor(noteSchema?: INote) {
    if (noteSchema) {
      this.fromSchema(noteSchema);
    }
  }

  public fromSchema(noteSchema: INote): void {
    this.body = noteSchema.body;
    this.documents = noteSchema.documents;
    this.title = noteSchema.title;
    this.type = noteSchema.type;
    this.id = noteSchema.id;
    this.createdBy = noteSchema.createdBy;
    this.lastUpdatedBy = noteSchema.lastUpdatedBy;
    this.createdTimestamp = noteSchema.createdTimestamp;
    this.lastUpdatedTimestamp = noteSchema.lastUpdatedTimestamp;
  }

  public toSchema(): Partial<INote> {
    return {
      body: this.body,
      documents: this.documents,
      title: this.title,
      type: { id: this.type.id, name: this.type.name },
    };
  }
}
