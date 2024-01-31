/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock,
  AuditEventDataUpdatedNuverialMultipleFileUploadModelMock,
  AuditEventFormioConfigurationNuverialMultipleFileUploadMock,
  AuditEventModel,
  EventUpdates,
} from '@dsg/shared/data-access/audit-api';
import { FormConfigurationModel, TransactionMock, TransactionModel } from '@dsg/shared/data-access/work-api';
import { DocumentFormService, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { ngMocks } from 'ng-mocks';
import { EMPTY, ReplaySubject, of } from 'rxjs';
import { TransactionListDataChangedComponent } from './transaction-list-data-changed.component';

const transactionModelMock = new TransactionModel(TransactionMock);

const assertDefined = <T>(obj: T | null | undefined): T => {
  expect(obj).toBeDefined();

  return obj as T;
};

const parseStates = (event: AuditEventModel): { newStates: Record<string, string>; oldStates: Record<string, string> } => {
  const { newState, oldState } = event.eventData;

  const newStates = JSON.parse(newState ?? '');
  const oldStates = JSON.parse(oldState ?? '');

  return { newStates, oldStates };
};

describe('TransactionListDataChangedComponent', () => {
  let component: TransactionListDataChangedComponent;
  let fixture: ComponentFixture<TransactionListDataChangedComponent>;
  let transactionModelSubject: ReplaySubject<TransactionModel>;

  const mockFormComponent = {
    key: 'documents.proofOfIncome',
    props: {
      label: 'Proof of Income/Tax',
    },
  };

  beforeEach(async () => {
    transactionModelSubject = new ReplaySubject<TransactionModel>(1);
    transactionModelSubject.next(transactionModelMock);

    await TestBed.configureTestingModule({
      imports: [TransactionListDataChangedComponent],
      providers: [
        {
          provide: DocumentFormService,
          useValue: {
            getDocumentFileData$: () => of(new Blob()),
            openDocument$: () => EMPTY,
          },
        },
        {
          provide: FormRendererService,
          useValue: {
            transaction$: transactionModelSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListDataChangedComponent);
    component = fixture.componentInstance;
    component.formConfiguration = new FormConfigurationModel(AuditEventFormioConfigurationNuverialMultipleFileUploadMock);
    component.formConfiguration.getComponentByKey = jest.fn().mockReturnValue(mockFormComponent);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('trackByFn', async () => {
    const results = component.trackByFn(1);
    expect(results).toEqual(1);
  });

  it('should open document', () => {
    const documentService = ngMocks.findInstance(DocumentFormService);
    const documentSpy = jest.spyOn(documentService, 'openDocument$');

    component.openDocument('id');

    expect(documentSpy).toHaveBeenCalledWith('id');
  });

  describe('should handle nuverialMultipleFileUpload component type with', () => {
    it('multiple file upload', () => {
      const transactionWithDocument = {
        ...TransactionMock,
        data: {
          documents: {
            proofOfIncome: [
              {
                documentId: '6ee8c91f-c970-486a-be42-1ac72cc803c3',
                filename: 'file.pdf',
              },
              {
                documentId: '9908c91f-cff0-13d1-ae02-2ac7dfc80315',
                filename: 'file2.pdf',
              },
            ],
          },
        },
      };
      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      const { newStates, oldStates } = parseStates(AuditEventDataUpdatedNuverialMultipleFileUploadModelMock);
      component.newStates = newStates;
      component.oldStates = oldStates;

      component.ngOnInit();

      const eventUpdate: EventUpdates = component.listEventUpdates.values().next().value[0];

      expect(eventUpdate.label).toBe('Proof of Income/Tax');
      expect(eventUpdate.newState).toBe('File[1]');
      expect(eventUpdate.oldState).toBe('');
      expect(eventUpdate.newDocumentId).toBe('6ee8c91f-c970-486a-be42-1ac72cc803c3');
    });

    it('multiple file removal', () => {
      const transactionWithDocument = {
        ...TransactionMock,
        data: {
          documents: {
            proofOfIncome: [
              {
                documentId: '6ee8c91f-c970-486a-be42-1ac72cc803c3',
                filename: 'file.pdf',
              },
              {
                documentId: '9908c91f-cff0-13d1-ae02-2ac7dfc80315',
                filename: 'file2.pdf',
              },
            ],
          },
        },
      };
      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      const { newStates, oldStates } = parseStates(AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock);
      component.newStates = newStates;
      component.oldStates = oldStates;

      component.ngOnInit();

      const eventUpdate: EventUpdates = component.listEventUpdates.values().next().value[0];
      expect(component.listEventUpdates.size).toBe(1);
      expect(eventUpdate.label).toBe('Proof of Income/Tax');
      expect(eventUpdate.newState).toBe('');
      expect(eventUpdate.oldState).toBe('File[1]');
      expect(eventUpdate.oldDocumentId).toBe('6ee8c91f-c970-486a-be42-1ac72cc803c3');
    });

    it('multiple file removal with no file data in transaction', () => {
      const transactionWithDocument = {
        ...TransactionMock,
        data: {
          documents: {
            proofOfIncome: [
              {
                documentId: '9908c91f-cff0-13d1-ae02-2ac7dfc80315',
                filename: 'file2.pdf',
              },
            ],
          },
        },
      };
      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      const { newStates, oldStates } = parseStates(AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock);
      component.newStates = newStates;
      component.oldStates = oldStates;

      component.ngOnInit();

      const eventUpdate: EventUpdates = component.listEventUpdates.values().next().value[0];

      expect(eventUpdate.label).toBe('Proof of Income/Tax');
      expect(eventUpdate.newState).toBe('');
      expect(eventUpdate.oldState).toBe('File[1]');
      expect(eventUpdate.oldDocumentId).toBe('6ee8c91f-c970-486a-be42-1ac72cc803c3');
    });

    it('file removal in middle of list', () => {
      const transactionWithDocument = {
        ...TransactionMock,
        data: {
          documents: {
            proofOfIncome: [
              {
                documentId: '6ee8c91f-c970-486a-be42-1ac72cc803c3',
                filename: 'file.pdf',
              },
              {
                documentId: '9908c91f-cff0-13d1-ae02-2ac7dfc80315',
                filename: 'file2.pdf',
              },
              {
                documentId: '738bba0b-2754-40fb-877a-60433b18c9e3',
                filename: 'file3.pdf',
              },
            ],
          },
        },
      };
      const fileRemovalInListModel = new AuditEventModel(AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock);
      fileRemovalInListModel.eventData.newState = '{"documents.proofOfIncome[1]":"738bba0b-2754-40fb-877a-60433b18c9e3"}';
      fileRemovalInListModel.eventData.oldState =
        '{"documents.proofOfIncome[1]":"9908c91f-cff0-13d1-ae02-2ac7dfc80315","documents.proofOfIncome[2]":"738bba0b-2754-40fb-877a-60433b18c9e3"}';

      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      const { newStates, oldStates } = parseStates(fileRemovalInListModel);
      component.newStates = newStates;
      component.oldStates = oldStates;

      component.ngOnInit();

      let eventUpdates = component.listEventUpdates.get('documents.proofOfIncome');
      eventUpdates = assertDefined(eventUpdates);
      expect(eventUpdates.length).toBe(1);

      const eventUpdate: EventUpdates = eventUpdates[0];

      expect(eventUpdate.label).toBe('Proof of Income/Tax');
      expect(eventUpdate.oldState).toBe('File[2]');
      expect(eventUpdate.newState).toBe('');
      expect(eventUpdate.oldDocumentId).toBe('9908c91f-cff0-13d1-ae02-2ac7dfc80315');
    });

    it('file removal in middle of list and upload at the back', () => {
      const transactionWithDocument = {
        ...TransactionMock,
        data: {
          documents: {
            proofOfIncome: [
              {
                documentId: '6ee8c91f-c970-486a-be42-1ac72cc803c3',
                filename: 'file.pdf',
              },
              {
                documentId: '9908c91f-cff0-13d1-ae02-2ac7dfc80315',
                filename: 'file2.pdf',
              },
              {
                documentId: '738bba0b-2754-40fb-877a-60433b18c9e3',
                filename: 'file3.pdf',
              },
              {
                documentId: '6f9107fb-65fb-477f-9a72-04a70df48d93',
                filename: 'file4.pdf',
              },
            ],
          },
        },
      };
      const fileRemovalAndUploadInListModel = new AuditEventModel(AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock);
      fileRemovalAndUploadInListModel.eventData.newState =
        '{"documents.proofOfIncome[1]":"738bba0b-2754-40fb-877a-60433b18c9e3","documents.proofOfIncome[2]":"6f9107fb-65fb-477f-9a72-04a70df48d93"}';
      fileRemovalAndUploadInListModel.eventData.oldState =
        '{"documents.proofOfIncome[1]":"9908c91f-cff0-13d1-ae02-2ac7dfc80315","documents.proofOfIncome[2]":"738bba0b-2754-40fb-877a-60433b18c9e3"}';

      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      const { newStates, oldStates } = parseStates(fileRemovalAndUploadInListModel);
      component.newStates = newStates;
      component.oldStates = oldStates;

      component.ngOnInit();

      let eventUpdates = component.listEventUpdates.get('documents.proofOfIncome');
      eventUpdates = assertDefined(eventUpdates);
      expect(eventUpdates.length).toBe(2);

      const eventUpdate1: EventUpdates = eventUpdates[0];
      const eventUpdate2: EventUpdates = eventUpdates[1];

      expect(eventUpdate1.label).toBe('Proof of Income/Tax');
      expect(eventUpdate1.oldState).toBe('File[2]');
      expect(eventUpdate1.newState).toBe('');
      expect(eventUpdate1.oldDocumentId).toBe('9908c91f-cff0-13d1-ae02-2ac7dfc80315');

      expect(eventUpdate2.label).toBe('Proof of Income/Tax');
      expect(eventUpdate2.newState).toBe('File[3]');
      expect(eventUpdate2.oldState).toBe('');
      expect(eventUpdate2.newDocumentId).toBe('6f9107fb-65fb-477f-9a72-04a70df48d93');
    });

    it('multple file removal in middle of list', () => {
      const transactionWithDocument = {
        ...TransactionMock,
        data: {
          documents: {
            proofOfIncome: [
              {
                documentId: '6ee8c91f-c970-486a-be42-1ac72cc803c3',
                filename: 'file.pdf',
              },
              {
                documentId: '9908c91f-cff0-13d1-ae02-2ac7dfc80315',
                filename: 'file2.pdf',
              },
              {
                documentId: '738bba0b-2754-40fb-877a-60433b18c9e3',
                filename: 'file3.pdf',
              },
              {
                documentId: '6f9107fb-65fb-477f-9a72-04a70df48d93',
                filename: 'file4.pdf',
              },
            ],
          },
        },
      };
      const fileMultipleRemovalInListModel = new AuditEventModel(AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock);
      fileMultipleRemovalInListModel.eventData.newState =
        '{"documents.proofOfIncome[0]":"9908c91f-cff0-13d1-ae02-2ac7dfc80315","documents.proofOfIncome[1]":"6f9107fb-65fb-477f-9a72-04a70df48d93"}';
      fileMultipleRemovalInListModel.eventData.oldState =
        '{"documents.proofOfIncome[0]":"6ee8c91f-c970-486a-be42-1ac72cc803c3","documents.proofOfIncome[1]":"9908c91f-cff0-13d1-ae02-2ac7dfc80315","documents.proofOfIncome[2]":"738bba0b-2754-40fb-877a-60433b18c9e3","documents.proofOfIncome[3]":"6f9107fb-65fb-477f-9a72-04a70df48d93"}';

      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      const { newStates, oldStates } = parseStates(fileMultipleRemovalInListModel);
      component.newStates = newStates;
      component.oldStates = oldStates;

      component.ngOnInit();

      let eventUpdates = component.listEventUpdates.get('documents.proofOfIncome');
      eventUpdates = assertDefined(eventUpdates);
      expect(eventUpdates.length).toBe(2);

      const eventUpdate1: EventUpdates = eventUpdates[0];
      const eventUpdate2: EventUpdates = eventUpdates[1];

      expect(eventUpdate1.label).toBe('Proof of Income/Tax');
      expect(eventUpdate1.oldState).toBe('File[1]');
      expect(eventUpdate1.newState).toBe('');
      expect(eventUpdate1.oldDocumentId).toBe('6ee8c91f-c970-486a-be42-1ac72cc803c3');

      expect(eventUpdate2.label).toBe('Proof of Income/Tax');
      expect(eventUpdate2.oldState).toBe('File[3]');
      expect(eventUpdate2.newState).toBe('');
      expect(eventUpdate2.oldDocumentId).toBe('738bba0b-2754-40fb-877a-60433b18c9e3');
    });
  });
});
