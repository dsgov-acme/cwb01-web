import { EmployerDetailModel } from './employer-detail.model';

export const EmployerDetailModelMock: EmployerDetailModel = new EmployerDetailModel({
  accountId: '123456789',
  assignedTo: 'AgentKey',
  displayName: 'Employer Display Name',
  email: 'employer@employer.com',
  preferences: { preferredCommunicationMethod: 'SMS, Email', preferredLanguage: 'English' },
});
