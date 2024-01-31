import { ConfiguredEnums, IEnumData } from './enums.model';

export const DocumentRejectionReasonsMock = new Map<string, IEnumData>([
  ['DOES_NOT_SATISFY_REQUIREMENTS', { label: 'Does Not Satisfy Requirements' }],
  ['INCORRECT_TYPE', { label: 'Incorrect Type' }],
  ['POOR_QUALITY', { label: 'Poor Quality' }],
  ['SUSPECTED_FRAUD', { label: 'Suspected Fraud' }],
]);

export const DocumentReviewStatusesMock = new Map<string, IEnumData>([
  ['REJECTED', { label: 'Rejected' }],
  ['NEW', { label: 'New' }],
  ['ACCEPTED', { label: 'Accepted' }],
  ['PENDING', { label: 'Pending' }],
]);

export const NoteTypesMock = new Map<string, IEnumData>([
  ['General Note', { label: 'General Note' }],
  ['Email', { label: 'Email' }],
  ['Phone Call', { label: 'Phone Call' }],
  ['Meeting Notes', { label: 'Meeting Notes' }],
]);

export const TransactionPrioritiesMock = new Map<string, IEnumData>([
  // this mock has no ordered keys on purpose to test the sorting by rank where needed. Please preserve.
  ['HIGH', { label: 'High', rank: 30 }],
  ['URGENT', { label: 'Urgent', rank: 40 }],
  ['LOW', { label: 'Low', rank: 10 }],
  ['MEDIUM', { label: 'Medium', rank: 20 }],
]);

export const ProfileAccessLevelsMock = new Map<string, IEnumData>([
  ['ADMIN', { label: 'Admin' }],
  ['WRITER', { label: 'Writer' }],
  ['READER', { label: 'Reader' }],
  ['AGENCY_READONLY', { label: 'Agency Readonly' }],
]);

export const ConfiguredEnumsMock: ConfiguredEnums = {
  'document-rejection-reasons': [
    {
      label: 'Poor Quality',
      value: 'POOR_QUALITY',
    },
    {
      label: 'Incorrect Type',
      value: 'INCORRECT_TYPE',
    },
    {
      label: 'Does Not Satisfy Requirements',
      value: 'DOES_NOT_SATISFY_REQUIREMENTS',
    },
    {
      label: 'Suspected Fraud',
      value: 'SUSPECTED_FRAUD',
    },
  ],
  'document-review-statuses': [
    {
      label: 'New',
      value: 'NEW',
    },
    {
      label: 'Accepted',
      value: 'ACCEPTED',
    },
    {
      label: 'Rejected',
      value: 'REJECTED',
    },
  ],
  'note-types': [
    {
      label: 'General Note',
      value: 'General Note',
    },
    {
      label: 'Email',
      value: 'Email',
    },
    {
      label: 'Phone Call',
      value: 'Phone Call',
    },
    {
      label: 'Meeting Notes',
      value: 'Meeting Notes',
    },
  ],
  'profile-access-levels': [
    {
      label: 'Admin',
      value: 'ADMIN',
    },
    {
      label: 'Writer',
      value: 'WRITER',
    },
    {
      label: 'Reader',
      value: 'READER',
    },
    {
      label: 'Agency Readonly',
      value: 'AGENCY_READONLY',
    },
  ],
  'schema-attribute-types': [
    {
      label: 'String',
      value: 'STRING',
    },
    {
      label: 'List',
      value: 'LIST',
    },
    {
      label: 'Dynamic Entity',
      value: 'DYNAMIC_ENTITY',
    },
    {
      label: 'Boolean',
      value: 'BOOLEAN',
    },
    {
      label: 'Integer',
      value: 'INTEGER',
    },
    {
      label: 'Decimal Number',
      value: 'DECIMAL_NUMBER',
    },
    {
      label: 'Date',
      value: 'DATE',
    },
    {
      label: 'Time',
      value: 'TIME',
    },
    {
      label: 'Document',
      value: 'DOCUMENT',
    },
  ],
  'transaction-priorities': [
    {
      label: 'Low',
      rank: 10,
      value: 'LOW',
    },
    {
      label: 'Medium',
      rank: 20,
      value: 'MEDIUM',
    },
    {
      label: 'High',
      rank: 30,
      value: 'HIGH',
    },
    {
      label: 'Urgent',
      rank: 40,
      value: 'URGENT',
    },
  ],
  'user-types': [
    { label: 'public', value: 'Public' },
    { label: 'Agency', value: 'Agency' },
  ],
};
