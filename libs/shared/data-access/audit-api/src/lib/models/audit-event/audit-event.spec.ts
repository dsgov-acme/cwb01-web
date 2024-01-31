import { AuditEventMock } from './audit-event.mock';
import { AuditEventModel, AuditIcons } from './audit-event.model';

describe('AuditEventModel', () => {
  let auditEventModel: AuditEventModel;

  beforeEach(() => {
    auditEventModel = new AuditEventModel(AuditEventMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(auditEventModel.businessObject).toEqual(AuditEventMock.businessObject);
      expect(auditEventModel.eventData).toEqual(AuditEventMock.eventData);
      expect(auditEventModel.timestamp).toEqual(AuditEventMock.timestamp);
      expect(auditEventModel.links).toEqual(AuditEventMock.links);
      expect(auditEventModel.summary).toEqual(AuditEventMock.summary);
      expect(auditEventModel.timestamp).toEqual(AuditEventMock.timestamp);
      expect(auditEventModel.eventId).toEqual(AuditEventMock.eventId);
      expect(auditEventModel.icon).toEqual('file_copy');
      expect(auditEventModel.triggerBy).toEqual(AuditEventMock.requestContext?.userId);
    });
  });

  test('toSchema', () => {
    expect(auditEventModel.toSchema()).toEqual(AuditEventMock);
  });

  test('icon getter', () => {
    auditEventModel.eventData.activityType = 'transaction_created';
    expect(auditEventModel.icon).toEqual(AuditIcons.TransactionCreated);

    auditEventModel.eventData.activityType = 'transaction_submitted';
    expect(auditEventModel.icon).toEqual(AuditIcons.TransactionSubmitted);

    auditEventModel.eventData.activityType = 'document_accepted';
    expect(auditEventModel.icon).toEqual(AuditIcons.DocumentAccepted);

    auditEventModel.eventData.activityType = 'document_rejected';
    expect(auditEventModel.icon).toEqual(AuditIcons.DocumentRejected);

    auditEventModel.eventData.activityType = 'document_unaccepted';
    expect(auditEventModel.icon).toEqual(AuditIcons.DocumentUnaccepted);

    auditEventModel.eventData.activityType = 'document_unrejected';
    expect(auditEventModel.icon).toEqual(AuditIcons.DocumentUnrejected);

    auditEventModel.eventData.activityType = 'note_added';
    expect(auditEventModel.icon).toEqual(AuditIcons.NoteAdded);

    auditEventModel.eventData.activityType = 'note_updated';
    expect(auditEventModel.icon).toEqual(AuditIcons.NoteUpdated);

    auditEventModel.eventData.activityType = 'note_deleted';
    expect(auditEventModel.icon).toEqual(AuditIcons.NoteDeleted);

    auditEventModel.eventData.activityType = 'transaction_data_changed';
    expect(auditEventModel.icon).toEqual(AuditIcons.TransactionDataChanged);

    auditEventModel.eventData.activityType = 'transaction_assigned_to_changed';
    expect(auditEventModel.icon).toEqual(AuditIcons.TransactionAssignedToChanged);

    auditEventModel.eventData.activityType = 'transaction_status_changed';
    expect(auditEventModel.icon).toEqual(AuditIcons.TransactionStatusChanged);

    auditEventModel.eventData.activityType = 'transaction_priority_changed';
    expect(auditEventModel.icon).toEqual(AuditIcons.transactionPriorityChanged);

    auditEventModel.eventData.activityType = 'employer_profile_user_access_level_changed';
    expect(auditEventModel.icon).toEqual(AuditIcons.EmployerEventDataChanged);

    auditEventModel.eventData.activityType = 'individual_profile_owner_changed';
    expect(auditEventModel.icon).toEqual(AuditIcons.EmployerEventDataChanged);

    auditEventModel.eventData.activityType = 'employer_profile_user_added';
    expect(auditEventModel.icon).toEqual(AuditIcons.EmployerEvent);

    auditEventModel.eventData.activityType = '';
    expect(auditEventModel.icon).toEqual('');
  });
});
