export interface ITooltipProcessingResult {
  processorId?: 'antivirus-scanner' | 'docai-document-quality' | 'docai-id-proofing';
  result: {
    code?: string;
    message?: string;
    shouldDisplayError?: boolean;
    signals?: [{ name: string; isPass: boolean; mentionText: string }];
    status?: number;
  };
}

export interface IProcessingStatus {
  failed: boolean;
  processors: ITooltipProcessingResult[];
}
