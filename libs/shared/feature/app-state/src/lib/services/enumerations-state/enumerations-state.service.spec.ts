import { TestBed } from '@angular/core/testing';

import { ConfiguredEnumsMock, DocumentRejectionReasonsMock, EnumMapType, NoteTypesMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { EnumerationsStateService } from './enumerations-state.service';

describe('EnumerationsStateService', () => {
  let service: EnumerationsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(WorkApiRoutesService, {
          getEnumerations$: jest.fn().mockImplementation(() => of(ConfiguredEnumsMock)),
        }),
      ],
    });
    service = TestBed.inject(EnumerationsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get map example 1: document rejection reasons', done => {
    service.initializeEnumerations();
    service.getEnumMap$(EnumMapType.DocumentRejectionReasons).subscribe(documentRejectionReasons => {
      expect(documentRejectionReasons).toBeTruthy();
      expect(documentRejectionReasons.size).toBe(4);
      expect(documentRejectionReasons).toEqual(DocumentRejectionReasonsMock);
      done();
    });
  });

  it('should get value example 1: document rejection reason', done => {
    service.initializeEnumerations();
    service.getDataFromEnum$(EnumMapType.DocumentRejectionReasons, 'POOR_QUALITY').subscribe(documentRejectionReason => {
      expect(documentRejectionReason).toBeTruthy();
      expect(documentRejectionReason.label).toBe('Poor Quality');
      done();
    });
  });

  it('should get map example 2: note types', done => {
    service.initializeEnumerations();
    service.getEnumMap$(EnumMapType.NoteTypes).subscribe(documentRejectionReasons => {
      expect(documentRejectionReasons).toBeTruthy();
      expect(documentRejectionReasons.size).toBe(4);
      expect(documentRejectionReasons).toEqual(NoteTypesMock);
      done();
    });
  });

  it('should get value example 2: document review status', done => {
    service.initializeEnumerations();
    service.getDataFromEnum$(EnumMapType.DocumentReviewStatuses, 'ACCEPTED').subscribe(documentRejectionReason => {
      expect(documentRejectionReason).toBeTruthy();
      expect(documentRejectionReason.label).toBe('Accepted');
      done();
    });
  });

  it('should clear state get map', done => {
    service.initializeEnumerations();
    service.clearEnumsState();

    service.getEnumMap$(EnumMapType.DocumentRejectionReasons).subscribe(result => {
      expect(result).toEqual(new Map<string, string>());
      done();
    });
  });

  it('should clear state get value', done => {
    service.initializeEnumerations();
    service.clearEnumsState();

    service.getDataFromEnum$(EnumMapType.DocumentRejectionReasons, 'POOR_QUALITY').subscribe(result => {
      expect(result.label).toEqual('Undefined value for: POOR_QUALITY');

      done();
    });
  });
});
