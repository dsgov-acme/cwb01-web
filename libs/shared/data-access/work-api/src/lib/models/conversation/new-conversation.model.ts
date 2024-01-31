import { SchemaModel } from '@dsg/shared/utils/http';
import { IMessage } from './conversation.model';

export interface IReferenceEntity {
  type: string;
  entityId: string;
}

export interface IConversationParticipant {
  type: string;
  participantId: string;
}

export interface INewConversation {
  subject: string;
  message: IMessage;
  referencedEntity: IReferenceEntity;
  participants: IConversationParticipant[];
}

export interface INewConversationResponse {
  id: string;
  subject: string;
  originalMessage: string;
  entityReference: string;
  createdBy: string;
  lastUpdatedBy: string;
  createdTimestamp: string;
  lastUpdatedTimestamp: string;
}

export class NewConversationModel implements SchemaModel<INewConversation> {
  public subject = '';
  public messageBody = '';
  public messageAttachments: string[] = [];
  public participants: IConversationParticipant[] = [];
  public referenceType = '';
  public referenceId = '';

  constructor(newConversationSchema?: INewConversation) {
    if (newConversationSchema) {
      this.fromSchema(newConversationSchema);
    }
  }

  public fromSchema(newConversationSchema: INewConversation): void {
    this.subject = newConversationSchema.subject;
    this.messageBody = newConversationSchema.message.body;
    this.messageAttachments = newConversationSchema.message.attachments;
    this.referenceId = newConversationSchema.referencedEntity.entityId;
    this.referenceType = newConversationSchema.referencedEntity.type;
    this.participants = newConversationSchema.participants;
  }

  public toSchema(): INewConversation {
    return {
      message: {
        attachments: this.messageAttachments,
        body: this.messageBody,
      },
      participants: this.participants,
      referencedEntity: {
        entityId: this.referenceId,
        type: this.referenceType,
      },
      subject: this.subject,
    };
  }
}
