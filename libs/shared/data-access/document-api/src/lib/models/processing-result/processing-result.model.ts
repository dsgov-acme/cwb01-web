import { SchemaModel } from '@dsg/shared/utils/http';

export const PROCESSING_RESULT_ID = {
  antivirus: 'antivirus-scanner',
  docQuality: 'docai-document-quality',
  idProofing: 'docai-id-proofing',
};

export type ProcessingResult = IDocumentQualityResult | IIdProofingResult | IAntivirusScannerResult;

export interface IProcessingResultSchema<ResultT = ProcessingResult> {
  processorId?: 'antivirus-scanner' | 'docai-document-quality' | 'docai-id-proofing';
  result: ResultT;
  status?: 'COMPLETE' | 'PENDING' | 'UNPROCESSABLE';
  timestamp: string;
}

export interface IDocumentQualityResult {
  pages: [defects: [name: string, confidence: number, pageNumber: number], pageNumber: number, quaityScore: string];
  qualityScore: string;
  shouldDisplayError: boolean;
}

export interface IIdProofingResult {
  allPass: boolean;
  shouldDisplayError: boolean;
  signals: [{ name: string; isPass: boolean; mentionText: string }];
}

export interface IAntivirusScannerResult {
  code: string;
  message: string;
  shouldDisplayError: boolean;
  status: number;
}

export interface ProcessorInfo {
  id: string;
  name: string;
  description: string;
}

export class ProcessingResultModel implements SchemaModel<IProcessingResultSchema<ProcessingResult | object>> {
  public processorId: 'antivirus-scanner' | 'docai-document-quality' | 'docai-id-proofing' | undefined;
  public result: ProcessingResult | object = {};
  public status: 'COMPLETE' | 'PENDING' | 'UNPROCESSABLE' | undefined = undefined;
  public timestamp = '';

  constructor(ProcessingResultSchema?: IProcessingResultSchema<ProcessingResult | object>) {
    if (ProcessingResultSchema) {
      this.fromSchema(ProcessingResultSchema);
    }
  }

  public fromSchema(ProcessingResultSchema: IProcessingResultSchema<ProcessingResult | object>) {
    this.processorId = ProcessingResultSchema.processorId;
    this.result = ProcessingResultSchema.result;
    this.status = ProcessingResultSchema.status;
    this.timestamp = ProcessingResultSchema.timestamp;
  }

  public toSchema(): IProcessingResultSchema<ProcessingResult | object> {
    return {
      processorId: this.processorId,
      result: this.result,
      status: this.status,
      timestamp: this.timestamp,
    };
  }
}
