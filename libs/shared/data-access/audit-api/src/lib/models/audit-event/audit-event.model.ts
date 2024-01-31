import { Filter, IPaginationResponse, PagingRequestModel, SchemaModel } from '@dsg/shared/utils/http';

export interface Links {
  systemOfRecord?: string | null;
  relatedBusinessObjects?: string[];
}

export interface BusinessObject {
  id: string;
  type: string;
}

export interface EventData {
  activityType?: string;
  data?: string;
  newState?: string;
  oldState?: string;
  schema?: string | null;
  type: string;
}

export interface RequestContext {
  userId?: string | null;
  tenantId?: string | null;
  originatorId: string;
  requestId?: string | null;
  traceId?: string | null;
  spanId?: string | null;
}

export interface IAuditEvent {
  businessObject: BusinessObject;
  eventData: EventData;
  timestamp: string;
  summary: string;
  links?: Links;
  requestContext?: RequestContext;
  eventId: string;
}

export interface GetEventsParams {
  transactionId: string;
  businessObjectType: string;
  pagingRequestModel?: PagingRequestModel;
  filters?: Filter[];
}

export interface IEventsPaginationResponse<T> extends IPaginationResponse {
  events: T[];
}

export enum AuditEventDataType {
  StateChangeEventData = 'StateChangeEventData',
  ActivityEventData = 'ActivityEventData',
}

export enum EventActivityType {
  TransactionCreated = 'transaction_created',
  TransactionSubmitted = 'transaction_submitted',
  DocumentAccepted = 'document_accepted',
  DocumentRejected = 'document_rejected',
  DocumentUnaccepted = 'document_unaccepted',
  DocumentUnrejected = 'document_unrejected',
  NoteAdded = 'note_added',
  NoteUpdated = 'note_updated',
  NoteDeleted = 'note_deleted',
  TransactionDataChanged = 'transaction_data_changed',
  TransactionAssignedToChanged = 'transaction_assigned_to_changed',
  TransactionStatusChanged = 'transaction_status_changed',
  TransactionPriorityChanged = 'transaction_priority_changed',

  ProfileInvitationSent = 'employer_profile_invitation_sent',
  ProfileInvitationClaimed = 'employer_profile_invitation_claimed',
  ProfileInvitationDeleted = 'employer_profile_invitation_deleted',
  ProfileUserAdded = 'employer_profile_user_added',
  ProfileUserRemoved = 'employer_profile_user_removed',
  ProfileUserAccessLevelChanged = 'employer_profile_user_access_level_changed',
  IndividualOwnerChanged = 'individual_profile_owner_changed',
}

export enum EventTitle {
  TransactionCreated = 'Application created',
  NoteAdded = 'Note added',
  NoteUpdated = 'Note edited',
  NoteDeleted = 'Note deleted',
  TransactionDataChanged = 'Application edited',
}

export enum AuditIcons {
  DocumentAccepted = 'check_box',
  DocumentRejected = 'cancel_presentation',
  DocumentUnaccepted = 'file_copy',
  DocumentUnrejected = 'file_copy',
  NoteAdded = 'description',
  NoteDeleted = 'delete',
  NoteUpdated = 'edit',
  TransactionAssignedToChanged = 'account_box',
  TransactionCreated = 'file_copy',
  TransactionDataChanged = 'edit',
  TransactionStatusChanged = 'pending',
  TransactionSubmitted = 'file_copy',
  transactionPriorityChanged = 'priority_high',
  EmployerEventDataChanged = 'edit',
  EmployerEvent = 'file_copy',
}
export interface EventUpdates {
  oldState: string;
  newState: string;
  label: string;
  newDocumentId?: string;
  oldDocumentId?: string;
}

export class AuditEventModel implements SchemaModel<IAuditEvent> {
  public businessObject: BusinessObject = { id: '', type: '' };
  public eventData: EventData = { type: '' };
  public timestamp = '';
  public summary = '';
  public links: Links | undefined = {};
  public requestContext: RequestContext | undefined = { originatorId: '' };
  public eventId = '';
  public displayName? = '';

  constructor(AuditEventSchema?: IAuditEvent) {
    if (AuditEventSchema) {
      this.fromSchema(AuditEventSchema);
    }
  }

  public get icon(): string {
    switch (this.eventData.activityType) {
      case EventActivityType.TransactionCreated:
        return AuditIcons.TransactionCreated;
      case EventActivityType.TransactionSubmitted:
        return AuditIcons.TransactionSubmitted;
      case EventActivityType.DocumentUnaccepted:
        return AuditIcons.DocumentUnaccepted;
      case EventActivityType.DocumentUnrejected:
        return AuditIcons.DocumentUnrejected;
      case EventActivityType.NoteUpdated:
        return AuditIcons.NoteUpdated;
      case EventActivityType.TransactionDataChanged:
        return AuditIcons.TransactionDataChanged;
      case EventActivityType.DocumentAccepted:
        return AuditIcons.DocumentAccepted;
      case EventActivityType.DocumentRejected:
        return AuditIcons.DocumentRejected;
      case EventActivityType.NoteAdded:
        return AuditIcons.NoteAdded;
      case EventActivityType.NoteDeleted:
        return AuditIcons.NoteDeleted;
      case EventActivityType.TransactionPriorityChanged:
        return AuditIcons.transactionPriorityChanged;
      case EventActivityType.TransactionAssignedToChanged:
        return AuditIcons.TransactionAssignedToChanged;
      case EventActivityType.TransactionStatusChanged:
        return AuditIcons.TransactionStatusChanged;
      case EventActivityType.ProfileUserAccessLevelChanged:
        return AuditIcons.TransactionDataChanged;
      case EventActivityType.IndividualOwnerChanged:
        return AuditIcons.TransactionDataChanged;
      default:
        if (this.isProfileEvent(this.eventData.activityType)) {
          return AuditIcons.TransactionCreated;
        }
    }

    return '';
  }

  public isProfileEvent(activityType: string | undefined): boolean {
    return (
      activityType === EventActivityType.ProfileUserAdded ||
      activityType === EventActivityType.ProfileUserRemoved ||
      activityType === EventActivityType.ProfileInvitationDeleted ||
      activityType === EventActivityType.ProfileInvitationClaimed ||
      activityType === EventActivityType.ProfileInvitationSent
    );
  }

  public get triggerBy(): string {
    return this.requestContext?.userId || '';
  }

  public fromSchema(AuditEventSchema: IAuditEvent) {
    this.businessObject = AuditEventSchema.businessObject;
    this.eventData = AuditEventSchema.eventData;
    this.timestamp = AuditEventSchema.timestamp;
    this.summary = AuditEventSchema.summary;
    this.links = AuditEventSchema.links;
    this.requestContext = AuditEventSchema.requestContext;
    this.eventId = AuditEventSchema.eventId;
    this.displayName = '';
  }

  public toSchema(): IAuditEvent {
    return {
      businessObject: this.businessObject,
      eventData: this.eventData,
      eventId: this.eventId,
      links: this.links,
      requestContext: this.requestContext,
      summary: this.summary,
      timestamp: this.timestamp,
    };
  }
}
