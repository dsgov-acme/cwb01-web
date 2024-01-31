import {
  IAntivirusScannerResult,
  IDocumentQualityResult,
  IIdProofingResult,
  IProcessingResultSchema,
  PROCESSING_RESULT_ID,
  ProcessingResultsMock,
} from '../../models';
import { checkIfDocumentShouldDisplayErrors } from './document-processing.util';

describe('checkIfDocumentShouldDisplayErrors', () => {
  test('should have an antivirus warning', () => {
    const processingDetails = [
      {
        processorId: 'antivirus-scanner',
        result: {
          code: 'READY',
          message: 'Document is available for download',
          status: 201,
        },
        status: 'COMPLETE',
        timestamp: '2023-09-08T17:36:13.746362Z',
      },
    ] as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(1);
  });

  test('should not have an antivirus warning', () => {
    const processingDetails = [
      {
        processorId: 'antivirus-scanner',
        result: {
          code: 'READY',
          message: 'Document is available for download',
          status: 200,
        },
        status: 'COMPLETE',
        timestamp: '2023-09-08T17:36:13.746362Z',
      },
    ] as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(0);
  });

  test('should have an docQuality warning', () => {
    const processingDetails = [
      {
        processorId: 'docai-document-quality',
        result: {
          pages: [
            {
              defects: [
                {
                  confidence: 0.9887743,
                  name: 'quality/defect_text_too_small',
                  pageNumber: 1,
                },
                {
                  confidence: 0.9823162,
                  name: 'quality/defect_blurry',
                  pageNumber: 1,
                },
                {
                  confidence: 0.7309269,
                  name: 'quality/defect_dark',
                  pageNumber: 1,
                },
                {
                  confidence: 0.6206232,
                  name: 'quality/defect_glare',
                  pageNumber: 1,
                },
                {
                  confidence: 0.59301573,
                  name: 'quality/defect_faint',
                  pageNumber: 1,
                },
                {
                  confidence: 0.5,
                  name: 'quality/defect_text_cutoff',
                  pageNumber: 1,
                },
                {
                  confidence: 0.1130042,
                  name: 'quality/defect_noisy',
                  pageNumber: 1,
                },
              ],
              pageNumber: 1,
              qualityScore: 9.536743e-7,
            },
          ],
          qualityScore: 9.536743e-7,
        },
        status: 'COMPLETE',
        timestamp: '2023-09-08T17:36:12.267611Z',
      },
    ] as unknown as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(1);
  });

  test('should not have an docQuality warning', () => {
    const processingDetails = [
      {
        processorId: 'docai-document-quality',
        result: {
          pages: [
            {
              defects: [
                {
                  confidence: 0.9887743,
                  name: 'quality/defect_text_too_small',
                  pageNumber: 1,
                },
                {
                  confidence: 0.9823162,
                  name: 'quality/defect_blurry',
                  pageNumber: 1,
                },
                {
                  confidence: 0.7309269,
                  name: 'quality/defect_dark',
                  pageNumber: 1,
                },
                {
                  confidence: 0.6206232,
                  name: 'quality/defect_glare',
                  pageNumber: 1,
                },
                {
                  confidence: 0.59301573,
                  name: 'quality/defect_faint',
                  pageNumber: 1,
                },
                {
                  confidence: 0.5,
                  name: 'quality/defect_text_cutoff',
                  pageNumber: 1,
                },
                {
                  confidence: 0.1130042,
                  name: 'quality/defect_noisy',
                  pageNumber: 1,
                },
              ],
              pageNumber: 1,
              qualityScore: 9.536743e-7,
            },
          ],
          qualityScore: 2e-2,
        },
        status: 'COMPLETE',
        timestamp: '2023-09-08T17:36:12.267611Z',
      },
    ] as unknown as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(0);
  });

  test('should have an idProofing warning for complete with errors', () => {
    const processingDetails = [
      {
        processorId: 'docai-id-proofing',
        result: {
          allPass: false,
          signals: [
            {
              isPass: false,
              mentionText: 'NOT_AN_ID',
              name: 'fraud_signals_is_identity_document',
            },
            {
              isPass: true,
              mentionText: 'PASS',
              name: 'fraud_signals_suspicious_words',
            },
            {
              isPass: false,
              mentionText: 'POSSIBLE_IMAGE_MANIPULATION',
              name: 'fraud_signals_image_manipulation',
            },
            {
              isPass: true,
              mentionText: 'PASS',
              name: 'fraud_signals_online_duplicate',
            },
          ],
        },
        status: 'COMPLETE',
        timestamp: '2023-09-08T17:36:10.218666Z',
      },
    ] as unknown as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(1);
  });

  test('should have an idProofing warning for unprocessable', () => {
    const processingDetails = [
      {
        processorId: 'docai-id-proofing',
        result: {
          error: 'Unprocessable document',
        },
        status: 'UNPROCESSABLE',
        timestamp: '2023-09-08T17:36:10.218666Z',
      },
    ] as unknown as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(1);
  });

  test('should not have an idProofing warning for complete without errors', () => {
    const processingDetails = [
      {
        processorId: 'docai-id-proofing',
        result: {
          allPass: true,
          signals: [
            {
              isPass: false,
              mentionText: 'NOT_AN_ID',
              name: 'fraud_signals_is_identity_document',
            },
            {
              isPass: true,
              mentionText: 'PASS',
              name: 'fraud_signals_suspicious_words',
            },
            {
              isPass: false,
              mentionText: 'POSSIBLE_IMAGE_MANIPULATION',
              name: 'fraud_signals_image_manipulation',
            },
            {
              isPass: true,
              mentionText: 'PASS',
              name: 'fraud_signals_online_duplicate',
            },
          ],
        },
        status: 'COMPLETE',
        timestamp: '2023-09-08T17:36:10.218666Z',
      },
    ] as unknown as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(0);
  });

  test('should skip processing results with status PENDING', () => {
    const processingDetails = [
      {
        processorId: 'antivirus-scanner',
        result: {
          code: 'READY',
          message: 'Document is available for download',
          status: 200,
        },
        status: 'PENDING',
        timestamp: '2023-09-08T17:36:13.746362Z',
      },
    ] as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails)).toEqual(0);
  });

  it('should have errors if any processingResult has an error', () => {
    const processingDetails = JSON.parse(JSON.stringify(ProcessingResultsMock)) as IProcessingResultSchema[];

    expect(checkIfDocumentShouldDisplayErrors(processingDetails) > 0).toEqual(true);
  });

  it('should display an error if document id proofing processing result does not have an allPass', () => {
    const processingDetails = JSON.parse(JSON.stringify(ProcessingResultsMock)) as IProcessingResultSchema[];
    checkIfDocumentShouldDisplayErrors(processingDetails);
    const idProofingResult = processingDetails.find(x => x.processorId === PROCESSING_RESULT_ID.idProofing)?.result as IIdProofingResult;

    expect(idProofingResult.shouldDisplayError).toEqual(true);
  });

  it('should not display any evidence signals in the id proofing processing results', () => {
    const processingDetails = JSON.parse(JSON.stringify(ProcessingResultsMock)) as IProcessingResultSchema[];
    checkIfDocumentShouldDisplayErrors(processingDetails);
    const idProofingResult = processingDetails.find(x => x.processorId === PROCESSING_RESULT_ID.idProofing)?.result as IIdProofingResult;

    expect(idProofingResult.signals.filter(s => s.name.includes('evidence')).length).toBeFalsy();
  });

  it('should display an error if antivirus scanning processing result has a code other than 200', () => {
    const processingDetails = JSON.parse(JSON.stringify(ProcessingResultsMock)) as IProcessingResultSchema[];
    checkIfDocumentShouldDisplayErrors(processingDetails);
    const antivirusResult = processingDetails.find(x => x.processorId === PROCESSING_RESULT_ID.antivirus)?.result as IAntivirusScannerResult;

    expect(antivirusResult.shouldDisplayError).toEqual(true);
  });

  it('should display an error if document quality processing result quality score is less than 0.01', () => {
    const processingDetails = JSON.parse(JSON.stringify(ProcessingResultsMock)) as IProcessingResultSchema[];
    checkIfDocumentShouldDisplayErrors(processingDetails);
    const docQualityResult = processingDetails.find(x => x.processorId === PROCESSING_RESULT_ID.docQuality)?.result as IDocumentQualityResult;

    expect(docQualityResult.shouldDisplayError).toEqual(true);
  });
});
