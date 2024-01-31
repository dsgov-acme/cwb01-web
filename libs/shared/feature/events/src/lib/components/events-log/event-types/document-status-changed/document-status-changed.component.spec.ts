/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AuditEventDocumentRejectedIncorrectReasonMock,
  AuditEventDocumentRejectedMock,
  AuditEventDocumentRejectedMultipleFileMock,
  AuditEventModel,
} from '@dsg/shared/data-access/audit-api';
import { UploadedDocumentMock, UploadedDocumentModel } from '@dsg/shared/data-access/document-api';
import { DocumentRejectionReasonsMock, FormConfigurationModel, FormioConfigurationTestMock } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import { DocumentFormService } from '@dsg/shared/feature/form-nuv';
import { MockProvider, ngMocks } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { DocumentStatusChangedComponent } from './document-status-changed.component';

const uploadedDocumentModelMock = new UploadedDocumentModel(UploadedDocumentMock);

describe('DocumentStatusChangedComponent', () => {
  let component: DocumentStatusChangedComponent;
  let fixture: ComponentFixture<DocumentStatusChangedComponent>;
  let auditEventDocumentStatusChangedModelMock: AuditEventModel;

  const mockFormComponent = {
    key: 'personalInformation.document',
    props: {
      label: 'document',
    },
  };

  beforeEach(async () => {
    auditEventDocumentStatusChangedModelMock = new AuditEventModel(AuditEventDocumentRejectedMock);

    await TestBed.configureTestingModule({
      imports: [DocumentStatusChangedComponent],
      providers: [
        {
          provide: DocumentFormService,
          useValue: {
            getDocumentById$: () => of(uploadedDocumentModelMock),
            openDocument$: () => EMPTY,
          },
        },
        MockProvider(EnumerationsStateService, {
          getEnumMap$: jest.fn().mockReturnValue(of(DocumentRejectionReasonsMock)),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentStatusChangedComponent);
    component = fixture.componentInstance;
    component.formConfiguration = new FormConfigurationModel(FormioConfigurationTestMock);
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

  describe('event type is document_rejected', () => {
    beforeEach(() => {
      component.event = auditEventDocumentStatusChangedModelMock;
    });

    it('should map correct form label with document name and rejected reasons', done => {
      component.documentStatus$.subscribe(documentStatus => {
        expect(documentStatus.documentName).toBeTruthy();
        expect(documentStatus.documentName).toEqual('document');
        expect(documentStatus.rejectedReasons.length).toBe(2);
        expect(documentStatus.rejectedReasons[0]).toEqual('Poor Quality');
        expect(documentStatus.rejectedReasons[1]).toEqual('Incorrect Type');
        done();
      });

      component.ngOnInit();
    });

    it('should append document name when changing status from a multiple file upload', done => {
      component.documentStatus$.subscribe(documentStatus => {
        expect(documentStatus.documentName).toEqual('document - File[1]');
        done();
      });

      component.event = new AuditEventModel(AuditEventDocumentRejectedMultipleFileMock);

      component.ngOnInit();
    });
  });

  it('should open document', () => {
    const documentService = ngMocks.findInstance(DocumentFormService);
    const documentSpy = jest.spyOn(documentService, 'openDocument$');

    component.openDocument('id');

    expect(documentSpy).toHaveBeenCalledWith('id');
  });

  it("should set reason as 'REASON NOT FOUND' if reason fails", done => {
    component.documentStatus$.subscribe(documentStatus => {
      expect(documentStatus.rejectedReasons[0]).toEqual('REASON NOT FOUND');

      done();
    });

    component.event = new AuditEventModel(AuditEventDocumentRejectedIncorrectReasonMock);
    component.ngOnInit();
  });
});
