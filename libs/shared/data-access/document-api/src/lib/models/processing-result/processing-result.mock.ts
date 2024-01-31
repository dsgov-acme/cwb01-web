import { IAntivirusScannerResult, IProcessingResultSchema, ProcessingResult } from './processing-result.model';

export const ProcessingResultsMock: Array<IProcessingResultSchema<ProcessingResult | object>> = [
  {
    processorId: 'docai-document-quality',
    result: {
      pages: [
        {
          defects: [
            {
              confidence: 1.0,
              name: 'quality/defect_document_cutoff',
              pageNumber: 1,
            },
            {
              confidence: 0.99766964,
              name: 'quality/defect_blurry',
              pageNumber: 1,
            },
            {
              confidence: 0.8937861,
              name: 'quality/defect_dark',
              pageNumber: 1,
            },
            {
              confidence: 0.7597793,
              name: 'quality/defect_text_too_small',
              pageNumber: 1,
            },
            {
              confidence: 0.5,
              name: 'quality/defect_text_cutoff',
              pageNumber: 1,
            },
            {
              confidence: 0.43493667,
              name: 'quality/defect_glare',
              pageNumber: 1,
            },
            {
              confidence: 0.2346304,
              name: 'quality/defect_noisy',
              pageNumber: 1,
            },
            {
              confidence: 0.044918887,
              name: 'quality/defect_faint',
              pageNumber: 1,
            },
          ],
          pageNumber: 1,
          qualityScore: 1.2993813e-5,
        },
      ],
      qualityScore: 1.2993813e-5,
    },
    status: 'COMPLETE',
    timestamp: '2023-08-02T16:03:23.899761Z',
  },
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
          isPass: false,
          mentionText: 'SUSPICIOUS_WORDS_FOUND',
          name: 'fraud_signals_suspicious_words',
        },
        {
          isPass: false,
          mentionText: '123456',
          name: 'evidence_suspicious_word',
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
    timestamp: '2023-08-02T16:03:24.458515Z',
  },
  {
    processorId: 'antivirus-scanner',
    result: {
      code: 'NOT READY',
      message: 'Document is not ready',
      status: 500,
    },
    status: 'COMPLETE',
    timestamp: '2023-08-02T16:03:26.925543Z',
  },
];

export const ProcessingResultsPassingMock: Array<IProcessingResultSchema<ProcessingResult | object>> = [
  {
    processorId: 'docai-document-quality',
    result: {
      pages: [
        {
          defects: [
            {
              confidence: 1.0,
              name: 'quality/defect_document_cutoff',
              pageNumber: 1,
            },
            {
              confidence: 0.99766964,
              name: 'quality/defect_blurry',
              pageNumber: 1,
            },
            {
              confidence: 0.8937861,
              name: 'quality/defect_dark',
              pageNumber: 1,
            },
            {
              confidence: 0.7597793,
              name: 'quality/defect_text_too_small',
              pageNumber: 1,
            },
            {
              confidence: 0.5,
              name: 'quality/defect_text_cutoff',
              pageNumber: 1,
            },
            {
              confidence: 0.43493667,
              name: 'quality/defect_glare',
              pageNumber: 1,
            },
            {
              confidence: 0.2346304,
              name: 'quality/defect_noisy',
              pageNumber: 1,
            },
            {
              confidence: 0.044918887,
              name: 'quality/defect_faint',
              pageNumber: 1,
            },
          ],
          pageNumber: 1,
          qualityScore: 1.2993813e-5,
        },
      ],
      qualityScore: 0.5,
    },
    status: 'COMPLETE',
    timestamp: '2023-08-02T16:03:23.899761Z',
  },
  {
    processorId: 'docai-id-proofing',
    result: {
      allPass: true,
      signals: [
        {
          isPass: true,
          mentionText: 'NOT_AN_ID',
          name: 'fraud_signals_is_identity_document',
        },
        {
          isPass: true,
          mentionText: 'SUSPICIOUS_WORDS_FOUND',
          name: 'fraud_signals_suspicious_words',
        },
        {
          isPass: true,
          mentionText: '123456',
          name: 'evidence_suspicious_word',
        },
        {
          isPass: true,
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
    timestamp: '2023-08-02T16:03:24.458515Z',
  },
  {
    processorId: 'antivirus-scanner',
    result: {
      code: 'READY',
      message: 'Document is available for download',
      status: 200,
    },
    status: 'COMPLETE',
    timestamp: '2023-08-02T16:03:26.925543Z',
  },
];

export const ProcessingResultMock: IProcessingResultSchema<IAntivirusScannerResult> = {
  processorId: 'antivirus-scanner',
  result: {
    code: 'READY',
    message: 'Document is available for download',
    shouldDisplayError: false,
    status: 200,
  },
  status: 'COMPLETE',
  timestamp: '2023-08-02T16:03:26.925543Z',
};
