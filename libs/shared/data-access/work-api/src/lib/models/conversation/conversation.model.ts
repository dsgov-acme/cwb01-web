import { IPaginationResponse, SchemaModel } from '@dsg/shared/utils/http';

export interface IMessage {
  body: string;
  attachments: string[];
}

export interface IConversationMessage extends IMessage {
  id: string;
  sender: IConversationSender;
  timestamp: string;
  read: boolean;
}

export interface IConversationSender {
  userId: string;
  displayName: string;
}

export interface IConversation {
  id: string;
  subject: string;
  createdTimestamp: string;
  lastUpdatedTimestamp: string;
  totalMessages: number;
  unReadMessages: number;
  originalMessage: IConversationMessage;
}

export interface IConversationsPaginationResponse<T> extends IPaginationResponse {
  items: T[];
}

export class ConversationModel implements SchemaModel<IConversation> {
  public id = '';
  public subject = '';
  public createdTimestamp = '';
  public lastUpdatedTimestamp = '';
  public totalMessages = 0;
  public unReadMessages = 0;
  public originalMessage!: IConversationMessage;
  public createdByDisplayName = '';

  constructor(conversationSchema?: IConversation) {
    if (conversationSchema) {
      this.fromSchema(conversationSchema);
    }
  }

  public fromSchema(conversationSchema: IConversation): void {
    this.id = conversationSchema.id;
    this.subject = conversationSchema.subject;
    this.createdTimestamp = conversationSchema.createdTimestamp;
    this.lastUpdatedTimestamp = conversationSchema.lastUpdatedTimestamp;
    this.totalMessages = conversationSchema.totalMessages;
    this.unReadMessages = conversationSchema.unReadMessages;
    this.originalMessage = conversationSchema.originalMessage;
    this.createdByDisplayName = conversationSchema.originalMessage.sender.displayName;
  }
}
