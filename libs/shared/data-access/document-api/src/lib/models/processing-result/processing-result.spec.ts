import { ProcessingResultMock } from './processing-result.mock';
import { ProcessingResultModel } from './processing-result.model';

describe('Uploaded Document Model', () => {
  let processingResultModel: ProcessingResultModel;

  beforeEach(() => {
    processingResultModel = new ProcessingResultModel(ProcessingResultMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(processingResultModel.result).toEqual(ProcessingResultMock.result);
      expect(processingResultModel.processorId).toEqual(ProcessingResultMock.processorId);
      expect(processingResultModel.status).toEqual(ProcessingResultMock.status);
      expect(processingResultModel.timestamp).toEqual(ProcessingResultMock.timestamp);
    });
  });

  test('toSchema', () => {
    expect(processingResultModel.toSchema()).toEqual(ProcessingResultMock);
  });
});
