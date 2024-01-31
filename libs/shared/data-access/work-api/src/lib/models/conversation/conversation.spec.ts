import { ConversationMock } from './conversation.mock';
import { ConversationModel } from './conversation.model';

describe('ConversationModel', () => {
  let conversationModel: ConversationModel;

  beforeEach(() => {
    conversationModel = new ConversationModel(ConversationMock);
  });

  describe('fromSchema', () => {
    it('should model porperties frm schema', () => {
      expect(conversationModel.id).toEqual(ConversationMock.id);
      expect(conversationModel.subject).toEqual(ConversationMock.subject);
      expect(conversationModel.createdTimestamp).toEqual(ConversationMock.createdTimestamp);
      expect(conversationModel.lastUpdatedTimestamp).toEqual(ConversationMock.lastUpdatedTimestamp);
      expect(conversationModel.totalMessages).toEqual(ConversationMock.totalMessages);
      expect(conversationModel.unReadMessages).toEqual(ConversationMock.unReadMessages);
      expect(conversationModel.originalMessage).toEqual(ConversationMock.originalMessage);
      expect(conversationModel.createdByDisplayName).toEqual(ConversationMock.originalMessage.sender.displayName);
    });
  });
});
