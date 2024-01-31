export enum EnumMapType {
  DocumentRejectionReasons = 'document-rejection-reasons',
  DocumentReviewStatuses = 'document-review-statuses',
  NoteTypes = 'note-types',
  TransactionPriorities = 'transaction-priorities',
  SchemaAttributeTypes = 'schema-attribute-types',
  ProfileAccessLevels = 'profile-access-levels',
}

export interface IStandardEnum {
  label: string;
  value: string;
  rank?: number;
}

export interface IEnumData {
  label: string;
  rank?: number;
}

export type ConfiguredEnums = Record<string, IStandardEnum[]>;

export interface IPriorityVisualValues {
  color: string;
  icon: string;
}

export const PriorityVisuals: Record<string, IPriorityVisualValues> = {
  high: {
    color: 'var(--theme-color-priority-high)',
    icon: 'menu',
  },
  low: {
    color: 'var(--theme-color-priority-low)',
    icon: 'remove',
  },
  medium: {
    color: 'var(--theme-color-priority-medium)',
    icon: 'drag_handle',
  },
  urgent: {
    color: 'var(--theme-color-priority-urgent)',
    icon: 'error',
  },
};
