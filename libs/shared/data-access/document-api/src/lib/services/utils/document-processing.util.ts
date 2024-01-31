import * as _ from 'lodash';
import { IAntivirusScannerResult, IDocumentQualityResult, IIdProofingResult, IProcessingResultSchema, PROCESSING_RESULT_ID } from '../../models';

export const idProofingSignalNames = {
  'evidence-hostname': 'evidence_hostname',
  'evidence-suspicious-word': 'evidence_suspicious_word',
  'evidence-thumbnail-url': 'evidence_thumbnail_url',
  'fraud-signals-image-manipulation': 'Possible Image Manipulation Detected',
  'fraud-signals-is-identity-document': 'Identity Document',
  'fraud-signals-online-duplicate': 'Possible Online Duplicate',
  'fraud-signals-suspicious-words': 'Suspicious Words Found',
};

export function checkIfDocumentShouldDisplayErrors(processingResults: IProcessingResultSchema[]): number {
  let errorCount = 0;
  processingResults.forEach(processor => {
    if (processor.status === 'PENDING') return;
    switch (processor.processorId) {
      case PROCESSING_RESULT_ID.antivirus: {
        const antivirusResult = processor.result as IAntivirusScannerResult;
        if (antivirusResult.status !== 200) {
          antivirusResult.shouldDisplayError = true;
          errorCount++;
        }
        break;
      }
      case PROCESSING_RESULT_ID.docQuality: {
        const documentQualityResult = processor.result as IDocumentQualityResult;
        if (Number(documentQualityResult.qualityScore) < 0.01) {
          documentQualityResult.shouldDisplayError = true;
          errorCount++;
        }
        break;
      }
      case PROCESSING_RESULT_ID.idProofing: {
        const idProofingResult = processor.result as IIdProofingResult;
        if (!idProofingResult.allPass) {
          idProofingResult.shouldDisplayError = true;
          errorCount++;
          for (let index = idProofingResult.signals?.length - 1; index >= 0; index--) {
            const signal = idProofingResult.signals[index];
            const key = _.kebabCase(signal.name);
            signal.name = idProofingSignalNames[key as keyof typeof idProofingSignalNames];
            if (signal.name?.includes('evidence')) {
              idProofingResult.signals.splice(index, 1);
            }
          }
        }
      }
    }
  });

  return errorCount;
}
