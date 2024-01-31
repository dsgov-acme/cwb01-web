import { INote, NoteModel } from './note.model';

export const NoteMock: INote = {
  body: 'noteBody',
  createdBy: 'noteCreatedBy',
  createdTimestamp: 'noteCreatedTimestamp',
  documents: [],
  id: 'noteId',
  lastUpdatedBy: 'noteLastUpdatedBy',
  lastUpdatedTimestamp: 'noteLastUpdatedTimestamp',
  title: 'noteTitle',
  type: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'name' },
};

export const PostNoteMock: Partial<INote> = {
  body: 'noteBody',
  documents: [],
  title: 'noteTitle',
  type: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'name' },
};

export const NoteMock2: INote = {
  body: 'Test body',
  createdBy: '',
  createdTimestamp: '',
  documents: [],
  id: '',
  lastUpdatedBy: '',
  lastUpdatedTimestamp: '',
  title: 'Test title',
  type: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
};

export const NoteModelMock: NoteModel = new NoteModel(NoteMock2);
