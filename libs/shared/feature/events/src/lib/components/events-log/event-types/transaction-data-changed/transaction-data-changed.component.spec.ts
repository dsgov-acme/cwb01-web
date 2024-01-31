/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AuditEventDataUpdatedModelMock,
  AuditEventDataUpdatedNullOldStateModelMock,
  AuditEventDataUpdatedNuverialAddressModelMock,
  AuditEventDataUpdatedNuverialFileUploadtModelMock,
  AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock,
  AuditEventDataUpdatedNuverialSelectModelMock,
  AuditEventFormioConfigurationNuverialAddressMock,
  AuditEventModel,
  EventUpdates,
} from '@dsg/shared/data-access/audit-api';
import { FormConfigurationModel, FormioConfigurationMock, TransactionMock, TransactionModel } from '@dsg/shared/data-access/work-api';
import { DocumentFormService, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { ngMocks } from 'ng-mocks';
import { EMPTY, of, ReplaySubject } from 'rxjs';
import { TransactionDataChangedComponent } from './transaction-data-changed.component';

const transactionModelMock = new TransactionModel(TransactionMock);

describe('TransactionDataChangedComponent', () => {
  let component: TransactionDataChangedComponent;
  let fixture: ComponentFixture<TransactionDataChangedComponent>;
  let auditEventDataUpdatedModelMock: AuditEventModel;
  let transactionModelSubject: ReplaySubject<TransactionModel>;

  const mockFormComponent = {
    key: 'personalInformation.lastName',
    props: {
      label: 'Last Name',
    },
  };

  beforeEach(async () => {
    auditEventDataUpdatedModelMock = new AuditEventModel(AuditEventDataUpdatedModelMock);
    transactionModelSubject = new ReplaySubject<TransactionModel>(1);
    transactionModelSubject.next(transactionModelMock);

    await TestBed.configureTestingModule({
      imports: [TransactionDataChangedComponent],
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

    fixture = TestBed.createComponent(TransactionDataChangedComponent);
    component = fixture.componentInstance;
    component.formConfiguration = new FormConfigurationModel(FormioConfigurationMock);
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

  it('should not push state updates when event is null', () => {
    const spy = jest.spyOn(component as any, '_handleTransactionDataUpdatedEvent');
    component.event = undefined;
    component.ngOnInit();

    expect(spy).not.toHaveBeenCalled();
  });

  describe('event type is transaction_data_updated and component is not nuverialFileUpload', () => {
    beforeEach(() => {
      component.event = auditEventDataUpdatedModelMock;
    });

    it('should map correct form label with state changes', () => {
      component.ngOnInit();

      const eventUpdate: EventUpdates = component.singleEventUpdates.values().next().value;
      expect(component.singleEventUpdates.size).toBe(1);
      expect(eventUpdate.label).toBe('Last Name');
      expect(eventUpdate.newState).toBe('koko');
      expect(eventUpdate.oldState).toBe('joe');
    });

    it('should map null state changes to "blank"', () => {
      component.event = AuditEventDataUpdatedNullOldStateModelMock;

      component.ngOnInit();

      const eventUpdate: EventUpdates = component.singleEventUpdates.values().next().value;
      expect(component.singleEventUpdates.size).toBe(1);
      expect(eventUpdate.label).toBe('Last Name');
      expect(eventUpdate.newState).toBe('blank');
      expect(eventUpdate.oldState).toBe('blank');
    });

    it('should handle nuverialSelect component type', () => {
      component.event = AuditEventDataUpdatedNuverialSelectModelMock;

      component.ngOnInit();

      const eventUpdate = Array.from(component.singleEventUpdates.entries())[1][1];
      expect(component.singleEventUpdates.size).toBe(2);
      expect(eventUpdate.label).toBe('Industry of Employment');
      expect(eventUpdate.newState).toBe('Consulting & Strategy');
      expect(eventUpdate.oldState).toBe('blank');
    });
  });

  it('should handle nuverialAddress component type', () => {
    component.formConfiguration = new FormConfigurationModel(AuditEventFormioConfigurationNuverialAddressMock);
    component.event = AuditEventDataUpdatedNuverialAddressModelMock;

    component.ngOnInit();

    expect(component.singleEventUpdates.size).toBe(3);

    // Appends the parent component personalInformation.currentAddress label to the result label
    const values = component.singleEventUpdates.values();
    const eventUpdate = values.next().value;
    expect(eventUpdate.label).toBe('Current Address - Address Line 1');
    expect(eventUpdate.newState).toBe('42 Meaning Street');
    expect(eventUpdate.oldState).toBe('blank');

    const eventUpdate1 = values.next().value;
    expect(eventUpdate1.label).toBe('Current Address - Country');
    expect(eventUpdate1.newState).toBe('United States');
    expect(eventUpdate1.oldState).toBe('blank');

    const eventUpdate2 = values.next().value;
    expect(eventUpdate2.label).toBe('Current Address - State');
    expect(eventUpdate2.newState).toBe('New York');
    expect(eventUpdate2.oldState).toBe('blank');
  });

  it('should open document', () => {
    const documentService = ngMocks.findInstance(DocumentFormService);
    const documentSpy = jest.spyOn(documentService, 'openDocument$');

    component.openDocument('id');

    expect(documentSpy).toHaveBeenCalledWith('id');
  });

  describe('should handle nuverialFileUpload component type with', () => {
    it('single file upload', () => {
      const transactionWithDocument = {
        ...TransactionMock,
        data: {
          documents: {
            proofOfIncome: {
              documentId: '6ee8c91f-c970-486a-be42-1ac72cc803c3',
              filename: 'file.pdf',
            },
          },
        },
      };
      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      component.event = AuditEventDataUpdatedNuverialFileUploadtModelMock;

      component.ngOnInit();

      const eventUpdate: EventUpdates = component.singleEventUpdates.values().next().value;
      expect(component.singleEventUpdates.size).toBe(1);
      expect(eventUpdate.label).toBe('Proof of Income/Tax');
      expect(eventUpdate.newState).toBe('File');
      expect(eventUpdate.oldState).toBe('blank');
      expect(eventUpdate.newDocumentId).toBe('6ee8c91f-c970-486a-be42-1ac72cc803c3');
    });

    it('single file removal', () => {
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
      const singleFileRemovalEventMock = new AuditEventModel(AuditEventDataUpdatedNuverialMultipleFileRemovalModelMock);
      singleFileRemovalEventMock.eventData.oldState = '{"documents.proofOfIncome[0]":"6ee8c91f-c970-486a-be42-1ac72cc803c3"}';

      transactionModelSubject.next(new TransactionModel(transactionWithDocument));
      component.event = singleFileRemovalEventMock;

      component.ngOnInit();

      const eventUpdate: EventUpdates = component.singleEventUpdates.values().next().value;
      expect(component.singleEventUpdates.size).toBe(1);
      expect(eventUpdate.label).toBe('Proof of Income/Tax');
      expect(eventUpdate.newState).toBe('blank');
      expect(eventUpdate.oldState).toBe('File');
      expect(eventUpdate.oldDocumentId).toBe('6ee8c91f-c970-486a-be42-1ac72cc803c3');
    });
  });
});
