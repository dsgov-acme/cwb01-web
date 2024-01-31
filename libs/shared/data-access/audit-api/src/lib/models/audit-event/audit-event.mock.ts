import { PagingResponseModel } from '@dsg/shared/utils/http';
import { AuditEventModel, IAuditEvent, IEventsPaginationResponse } from './audit-event.model';

export const AuditEventMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_created',
    data: '{"userId":"53ffc874-de88-4533-b326-8ca3bd4f8577"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Transaction Created.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDataUpdatedMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_data_changed',
    newState: '{"personalInformation.lastName":"koko"}',
    oldState: '{"personalInformation.lastName":"joe"}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Transaction Created.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventTransactionAssignedMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_assigned_to_changed',
    newState: 'b2309591-2658-469e-ad55-7b419212b144',
    oldState: '',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'User [b2309591-2658-469e-ad55-7b419212b144] was assigned transaction RIYMHUH.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventTransactionUnassignedMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_assigned_to_changed',
    newState: '',
    oldState: 'b2309591-2658-469e-ad55-7b419212b144',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'User [b2309591-2658-469e-ad55-7b419212b144] was assigned transaction RIYMHUH.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventNoteAddedMock: IAuditEvent = {
  businessObject: {
    id: 'f7455e14-2ea6-436b-a71b-2c0106ede7e1',
    type: 'transaction',
  },
  eventData: {
    activityType: 'note_added',
    data: '{"agentId":"3d327cac-3b2e-4bfb-9efb-0802260542dd","noteId":"6ed3b407-743b-411e-99fe-3e68f2293b8c","noteTitle":"This is my Note"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '1a72a2fd-d8ff-4af3-8771-21a7967fb498',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '3d327cac-3b2e-4bfb-9efb-0802260542dd',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '3d327cac-3b2e-4bfb-9efb-0802260542dd',
  },
  summary: 'Transaction note added.',
  timestamp: '2023-08-01T18:05:09.41073Z',
};

export const AuditEventNoteDeletedMock: IAuditEvent = {
  businessObject: {
    id: 'f7455e14-2ea6-436b-a71b-2c0106ede7e1',
    type: 'transaction',
  },
  eventData: {
    activityType: 'note_deleted',
    data: '{"agentId":"3d327cac-3b2e-4bfb-9efb-0802260542dd","noteId":"6ed3b407-743b-411e-99fe-3e68f2293b8c","noteTitle":"This is my Note"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '1a72a2fd-d8ff-4af3-8771-21a7967fb498',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '3d327cac-3b2e-4bfb-9efb-0802260542dd',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '3d327cac-3b2e-4bfb-9efb-0802260542dd',
  },
  summary: 'Transaction note deleted.',
  timestamp: '2023-08-01T18:05:09.41073Z',
};

export const AuditEventNoteUpdatedMock: IAuditEvent = {
  businessObject: {
    id: 'f7455e14-2ea6-436b-a71b-2c0106ede7e1',
    type: 'transaction',
  },
  eventData: {
    activityType: 'note_updated',
    newState: '{"lastUpdatedTimestamp":"2023-08-29T06:28:05.977273Z","body":"Hello DSG","title":"Some Title","type":"GeneralNote"}',
    oldState: '{"lastUpdatedTimestamp":"2023-08-29T06:27:51.877101Z","body":"Hello Nuvalence","title":"Something","type":"GeneralNote"}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '1a72a2fd-d8ff-4af3-8771-21a7967fb498',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '3d327cac-3b2e-4bfb-9efb-0802260542dd',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '3d327cac-3b2e-4bfb-9efb-0802260542dd',
  },
  summary: 'Transaction note 033e7dfc-b071-4a91-817c-402f3215cc95 changed',
  timestamp: '2023-08-01T18:05:09.41073Z',
};

export const AuditEventTransactionStatusChangedMock: IAuditEvent = {
  businessObject: {
    id: 'f7455e14-2ea6-436b-a71b-2c0106ede7e1',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_status_changed',
    newState: 'Review',
    oldState: 'Draft',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
  },
  summary: 'Transaction RIYMHUH changed its status to [Review]. Previously it was [Draft]',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventTransactionPriorityChangedMock: IAuditEvent = {
  businessObject: {
    id: 'f7455e14-2ea6-436b-a71b-2c0106ede7e1',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_priority_changed',
    newState: 'MEDIUM',
    oldState: 'LOW',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
  },
  summary: 'Transaction RIYMHUH priority was changed',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDataUpdatedNullStateMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_data_changed',
    newState: '{"personalInformation.lastName":"null"}',
    oldState: '{"personalInformation.lastName":"null"}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Transaction Created.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDocumentRejectedMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'document_rejected',
    data: '{"documentId":"08ec7761-9e74-4010-901f-6a8dae5893d4","transactionId":"c4a051d9-4b2b-44fa-a4a5-5fd024d3a9f5","documentFieldPath":"document","rejectedReasons":["POOR_QUALITY","INCORRECT_TYPE"]}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Document rejected',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDocumentRejectedIncorrectReasonMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'document_rejected',
    data: '{"documentId":"08ec7761-9e74-4010-901f-6a8dae5893d4","transactionId":"c4a051d9-4b2b-44fa-a4a5-5fd024d3a9f5","documentFieldPath":"document","rejectedReasons":["REASON_1"]}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Document rejected',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDocumentRejectedMultipleFileMock: IAuditEvent = {
  businessObject: {
    id: '664bc187-c8dc-4004-9bc8-9d3254a67c19',
    type: 'transaction',
  },
  eventData: {
    activityType: 'document_rejected',
    data: '{"documentId":"08ec7761-9e74-4010-901f-6a8dae5893d4","transactionId":"c4a051d9-4b2b-44fa-a4a5-5fd024d3a9f5","documentFieldPath":"document[0]","rejectedReasons":["REASON_1"]}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Document rejected',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDocumentUnacceptedMock: IAuditEvent = {
  businessObject: {
    id: 'f7455e14-2ea6-436b-a71b-2c0106ede7e1',
    type: 'transaction',
  },
  eventData: {
    activityType: 'document_unaccepted',
    newState: 'Review',
    oldState: 'Draft',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
  },
  summary: 'Transaction RIYMHUH changed its status to [Review]. Previously it was [Draft]',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDocumentUnrejectedMock: IAuditEvent = {
  businessObject: {
    id: 'f7455e14-2ea6-436b-a71b-2c0106ede7e1',
    type: 'transaction',
  },
  eventData: {
    activityType: 'document_unrejected',
    newState: 'Review',
    oldState: 'Draft',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '41a5938c-aa52-4fd3-8c59-0259c39b010c',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: 'b890b2c2-2a13-49ce-8074-c16e0be23c26',
  },
  summary: 'Transaction RIYMHUH changed its status to [Review]. Previously it was [Draft]',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventDataUpdatedNuverialSelectMock: IAuditEvent = {
  businessObject: {
    id: 'd12587e3-e2de-4a33-9f8d-999970d0863f',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_data_changed',
    newState: '{"employmentInformation.industry":"consultingStrategy","employmentInformation.employmentStatus":"unemployed"}',
    oldState: '{}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '974ec3bf-cf28-461a-9620-3720f4648d11',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Transaction RIYMH4H changed its dynamic data',
  timestamp: '2023-09-01T14:44:00.578451Z',
};
export const AuditEventDataUpdatedNuverialFileUploadMock: IAuditEvent = {
  businessObject: {
    id: 'd12587e3-e2de-4a33-9f8d-999970d0863f',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_data_changed',
    newState: '{"documents.proofOfIncome":"6ee8c91f-c970-486a-be42-1ac72cc803c3"}',
    oldState: '{}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '974ec3bf-cf28-461a-9620-3720f4648d11',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Transaction RIYMH4H changed its dynamic data',
  timestamp: '2023-09-01T14:44:00.578451Z',
};
export const AuditEventDataUpdatedNuverialMultipleFileUploadMock: IAuditEvent = {
  businessObject: {
    id: 'd12587e3-e2de-4a33-9f8d-999970d0863f',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_data_changed',
    newState: '{"documents.proofOfIncome[0]":"6ee8c91f-c970-486a-be42-1ac72cc803c3"}',
    oldState: '{}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '974ec3bf-cf28-461a-9620-3720f4648d11',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Transaction RIYMH4H changed its dynamic data',
  timestamp: '2023-09-01T14:44:00.578451Z',
};
export const AuditEventDataUpdatedNuverialMultipleFileRemovalMock: IAuditEvent = {
  businessObject: {
    id: 'd12587e3-e2de-4a33-9f8d-999970d0863f',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_data_changed',
    newState: '{}',
    oldState: '{"documents.proofOfIncome[0]":"6ee8c91f-c970-486a-be42-1ac72cc803c3"}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '974ec3bf-cf28-461a-9620-3720f4648d11',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Transaction RIYMH4H changed its dynamic data',
  timestamp: '2023-09-01T14:44:00.578451Z',
};
export const AuditEventDataUpdatedNuverialAddressMock: IAuditEvent = {
  businessObject: {
    id: 'd12587e3-e2de-4a33-9f8d-d9f431856081',
    type: 'transaction',
  },
  eventData: {
    activityType: 'transaction_data_changed',
    newState: `{
      "personalInformation.currentAddress.stateCode":"NY",
      "personalInformation.currentAddress.countryCode":"US",
      "personalInformation.currentAddress.addressLine1":"42 Meaning Street"
    }`,
    oldState: '{}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '974ec3bf-cf28-461a-9620-3720132a8d11',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ce54d4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: null,
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Application Edited',
  timestamp: '2023-09-08T14:44:00.578451Z',
};

export const AuditEventFormioConfigurationNuverialAddressMock = [
  {
    components: [
      {
        className: 'flex-full',
        components: [
          {
            input: true,
            key: 'personalInformation.currentAddress.addressLine1',
            props: {
              label: 'Address Line 1',
              required: true,
            },
          },
          {
            className: 'flex-half',
            key: 'personalInformation.currentAddress.stateCode',
            props: {
              label: 'State',
              required: true,
              selectOptions: [
                {
                  displayTextValue: 'New York',
                  key: 'NY',
                },
              ],
            },
          },
          {
            key: 'personalInformation.currentAddress.countryCode',
            props: {
              label: 'Country',
              required: true,
              selectOptions: [
                {
                  displayTextValue: 'United States',
                  key: 'US',
                },
              ],
            },
          },
        ],
        key: 'personalInformation.currentAddress',
        props: {
          label: 'Current Address',
        },
        type: 'nuverialAddress',
      },
    ],
    key: 'personalInformation',
    label: 'Page 1',
    props: {
      label: 'Personal Information',
    },
    title: 'Personal Information',
    type: 'panel',
  },
];

export const AuditEventProfileUserAddedMock = {
  businessObject: {
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    type: 'employer',
  },
  eventData: {
    activityType: 'employer_profile_user_added',
    data: '{"ownerUserId":"680f61b1-9225-4d88-92b2-3f3e695844a3","userId":"4db70dd6-12f6-4d96-ab95-93f0335d7e05"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '23d5e023-ffb5-4100-852e-005add1fd9bd',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: 'df7c64c1-fa18-4667-ab23-96d3ea78adb4',
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Employer Profile User Added.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventProfileUserRemovedMock = {
  businessObject: {
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    type: 'employer',
  },
  eventData: {
    activityType: 'employer_profile_user_removed',
    data: '{"ownerUserId":"680f61b1-9225-4d88-92b2-3f3e695844a3","userId":"4db70dd6-12f6-4d96-ab95-93f0335d7e05"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '23d5e023-ffb5-4100-852e-005add1fd9bd',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: 'df7c64c1-fa18-4667-ab23-96d3ea78adb4',
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Employer Profile User Removed.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventProfileUserAcessChangedMock = {
  businessObject: {
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    type: 'employer',
  },
  eventData: {
    activityType: 'employer_profile_user_access_level_changed',
    data: '{"ownerUserId":"680f61b1-9225-4d88-92b2-3f3e695844a3","userId":"4db70dd6-12f6-4d96-ab95-93f0335d7e05"}',
    newState: '{"accessLevel":"READER"}',
    oldState: '{"accessLevel":"WRITER"}',
    schema: null,
    type: 'StateChangeEventData',
  },
  eventId: '23d5e023-ffb5-4100-852e-005add1fd9bd',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: 'df7c64c1-fa18-4667-ab23-96d3ea78adb4',
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary:
    'Profile user access level changed to [READER] for employer profile user 4662f903-0173-4ff8-ba9e-2568ff92b511 owned by 13f28507-09cc-4679-9860-10fc03fb8bf2. Previously it was [WRITER]',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventProfileInvitationSentMock = {
  businessObject: {
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    type: 'employer',
  },
  eventData: {
    activityType: 'employer_profile_invitation_sent',
    data: '{"ownerUserId":"680f61b1-9225-4d88-92b2-3f3e695844a3","userId":"4db70dd6-12f6-4d96-ab95-93f0335d7e05"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '23d5e023-ffb5-4100-852e-005add1fd9bd',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: 'df7c64c1-fa18-4667-ab23-96d3ea78adb4',
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Invitation Sent',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventProfileInvitationClaimedMock = {
  businessObject: {
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    type: 'employer',
  },
  eventData: {
    activityType: 'employer_profile_invitation_claimed',
    data: '{"ownerUserId":"680f61b1-9225-4d88-92b2-3f3e695844a3","userId":"4db70dd6-12f6-4d96-ab95-93f0335d7e05"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '23d5e023-ffb5-4100-852e-005add1fd9bd',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: 'df7c64c1-fa18-4667-ab23-96d3ea78adb4',
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Invitation Claimed',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventProfileInvitationDeletedMock = {
  businessObject: {
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    type: 'employer',
  },
  eventData: {
    activityType: 'employer_profile_invitation_deleted',
    data: '{"ownerUserId":"680f61b1-9225-4d88-92b2-3f3e695844a3","userId":"4db70dd6-12f6-4d96-ab95-93f0335d7e05"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '23d5e023-ffb5-4100-852e-005add1fd9bd',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: 'df7c64c1-fa18-4667-ab23-96d3ea78adb4',
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Invitation Deleted',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventOwnerChangedMock = {
  businessObject: {
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    type: 'employer',
  },
  eventData: {
    activityType: 'individual_profile_owner_changed',
    data: '{"ownerUserId":"680f61b1-9225-4d88-92b2-3f3e695844a3","userId":"4db70dd6-12f6-4d96-ab95-93f0335d7e05"}',
    schema: null,
    type: 'ActivityEventData',
  },
  eventId: '23d5e023-ffb5-4100-852e-005add1fd9bd',
  links: {
    relatedBusinessObjects: [],
    systemOfRecord: null,
  },
  requestContext: {
    originatorId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
    requestId: null,
    spanId: null,
    tenantId: null,
    traceId: 'df7c64c1-fa18-4667-ab23-96d3ea78adb4',
    userId: '53ffc874-de88-4533-b326-8ca3bd4f8577',
  },
  summary: 'Profile owner changed.',
  timestamp: '2023-06-26T17:43:40.712948Z',
};

export const AuditEventFormioConfigurationNuverialMultipleFileUploadMock = [
  {
    className: 'flex-full',
    components: [
      {
        input: true,
        key: 'documents.proofOfIncome',
      },
    ],
    key: 'documents',
    props: {
      label: 'Proof of Income/Tax',
    },
    type: 'nuverialMultipleFileUpload',
  },
];

export const AuditEventModelMock = new AuditEventModel(AuditEventMock);
export const AuditEventDataUpdatedModelMock = new AuditEventModel(AuditEventDataUpdatedMock);
export const AuditEventTransactionAssignedModelMock = new AuditEventModel(AuditEventTransactionAssignedMock);
export const AuditEventTransactionUnassignedModelMock = new AuditEventModel(AuditEventTransactionUnassignedMock);
export const AuditEventDataUpdatedNullOldStateModelMock = new AuditEventModel(AuditEventDataUpdatedNullStateMock);
export const AuditEventDataUpdatedNuverialSelectModelMock = new AuditEventModel(AuditEventDataUpdatedNuverialSelectMock);
export const AuditEventDataUpdatedNuverialFileUploadtModelMock = new AuditEventModel(AuditEventDataUpdatedNuverialFileUploadMock);
export const AuditEventDataUpdatedNuverialMultipleFileUploadModelMock = new AuditEventModel(AuditEventDataUpdatedNuverialMultipleFileUploadMock);
export const AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock = new AuditEventModel(AuditEventDataUpdatedNuverialMultipleFileRemovalMock);
export const AuditEventDataUpdatedNuverialAddressModelMock = new AuditEventModel(AuditEventDataUpdatedNuverialAddressMock);
export const AuditEventsSchemaMock: IEventsPaginationResponse<IAuditEvent> = {
  events: [AuditEventModelMock],
  pagingMetadata: new PagingResponseModel(),
};
