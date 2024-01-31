import { UserMock } from '@dsg/shared/data-access/user-api';
import { PagingResponseModel } from '@dsg/shared/utils/http';
import { TransactionMock } from '../transaction/transaction.mock';
import { ConversationModel, IConversation, IConversationsPaginationResponse } from './conversation.model';
import { INewConversation, INewConversationResponse, NewConversationModel } from './new-conversation.model';

export const ConversationMock: IConversation = {
  createdTimestamp: '2024-01-15T17:18:57.713274Z',
  id: 'fbf48451-99ba-446b-8c18-0caf788056c4',
  lastUpdatedTimestamp: '2024-01-15T17:18:57.713274Z',
  originalMessage: {
    attachments: [],
    body: 'Test body of test message',
    id: 'f20b5eec-4d47-4a7b-9f5b-517685458170',
    read: true,
    sender: {
      displayName: 'Changed Legal Name',
      userId: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    },
    timestamp: '2024-01-15T17:18:57.713774Z',
  },
  subject: 'Test Message',
  totalMessages: 1,
  unReadMessages: 0,
};

export const ConversationMockModel = new ConversationModel(ConversationMock);

export const ConversationsPaginatedResponseMock: IConversationsPaginationResponse<IConversation> = {
  items: [ConversationMock],
  pagingMetadata: new PagingResponseModel({
    nextPage: '',
    pageNumber: 1,
    pageSize: 10,
    totalCount: 200,
  }),
};

export const NewConversationMock: INewConversation = {
  message: {
    attachments: [],
    body: '<p>Create new message</p>',
  },
  participants: [
    {
      participantId: UserMock.id,
      type: 'AGENCY',
    },
    {
      participantId: TransactionMock.subjectProfileId,
      type: TransactionMock.subjectProfileType,
    },
  ],
  referencedEntity: {
    entityId: TransactionMock.id,
    type: 'TRANSACTION',
  },
  subject: 'test Message create',
};

export const NewConversationModelMock: NewConversationModel = new NewConversationModel(NewConversationMock);

export const NewConversationResponseMock: INewConversationResponse = {
  createdBy: 'string',
  createdTimestamp: '2024-01-25T23:20:55.696Z',
  entityReference: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  lastUpdatedBy: 'string',
  lastUpdatedTimestamp: '2024-01-25T23:20:55.696Z',
  originalMessage: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  subject: 'string',
};
