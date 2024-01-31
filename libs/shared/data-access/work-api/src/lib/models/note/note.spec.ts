import { NoteMock, PostNoteMock } from './note.mock';
import { NoteModel } from './note.model';

describe('NoteModel', () => {
  let noteModel: NoteModel;

  beforeEach(() => {
    noteModel = new NoteModel(NoteMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(noteModel.body).toEqual(NoteMock.body);
      expect(noteModel.documents).toEqual(NoteMock.documents);
      expect(noteModel.title).toEqual(NoteMock.title);
      expect(noteModel.type).toEqual(NoteMock.type);
      expect(noteModel.id).toEqual(NoteMock.id);
      expect(noteModel.createdBy).toEqual(NoteMock.createdBy);
      expect(noteModel.createdTimestamp).toEqual(NoteMock.createdTimestamp);
      expect(noteModel.lastUpdatedBy).toEqual(NoteMock.lastUpdatedBy);
      expect(noteModel.lastUpdatedTimestamp).toEqual(NoteMock.lastUpdatedTimestamp);
    });
  });

  test('toSchema', () => {
    const capturedSchema = noteModel.toSchema();
    expect(capturedSchema.body).toEqual(PostNoteMock.body);
    expect(capturedSchema.documents).toEqual(PostNoteMock.documents);
    expect(capturedSchema.title).toEqual(PostNoteMock.title);
    if (PostNoteMock.type && typeof PostNoteMock.type !== 'string') {
      expect(capturedSchema.type?.id).toEqual(PostNoteMock.type.id);
      expect(capturedSchema.type?.name).toEqual(PostNoteMock.type.name);
    }
  });
});
