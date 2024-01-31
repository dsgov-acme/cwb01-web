import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UserMock } from '@dsg/shared/data-access/user-api';
import {
  ConversationMock,
  ConversationMockModel,
  ConversationsPaginatedResponseMock,
  NewConversationModelMock,
  NewConversationResponseMock,
  TransactionMock,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { Filter, PagingRequestModel } from '@dsg/shared/utils/http';
import { MockProvider, ngMocks } from 'ng-mocks';
import { firstValueFrom, of, switchMap, tap } from 'rxjs';
import { MessagingService } from './messaging.service';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(HttpClient),
        MockProvider(WorkApiRoutesService, {
          createConversation$: jest.fn().mockImplementation(() => of(NewConversationResponseMock)),
          getConversations$: jest.fn().mockImplementation(() => of(ConversationsPaginatedResponseMock)),
        }),
        MockProvider(UserStateService, {
          user$: of(UserMock),
        }),
        MockProvider(FormRendererService, {
          transaction: TransactionMock,
        } as FormRendererService),
      ],
    });

    service = TestBed.inject(MessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize', () => {
    const testReferenceType = 'TEST';
    const testReferenceId = '123';

    service.initialize(testReferenceType, testReferenceId);

    expect(service['_referenceType'].getValue()).toBe(testReferenceType);
    expect(service['_referenceId'].getValue()).toBe(testReferenceId);
  });

  it('should clear conversations', async () => {
    const testReferenceType = 'TEST';
    const testReferenceId = '123';
    const pagination = new PagingRequestModel();

    service.initialize(testReferenceType, testReferenceId);
    await firstValueFrom(service.getConversations$([], pagination));

    expect(service['_conversations'].getValue().length).toBeTruthy();

    service.clearConversations();

    expect(service['_conversations'].getValue().length).toBeFalsy();
  });

  it('should cleanup', async () => {
    const testReferenceType = 'TEST';
    const testReferenceId = '123';
    const pagination = new PagingRequestModel();

    service.initialize(testReferenceType, testReferenceId);
    await firstValueFrom(service.getConversations$([], pagination));

    expect(service['_conversations'].getValue().length).toBeTruthy();
    expect(service['_referenceType'].getValue()).toBeTruthy();
    expect(service['_referenceId'].getValue()).toBeTruthy();

    service.cleanUp();

    expect(service['_conversations'].getValue().length).toBeFalsy();
    expect(service['_referenceType'].getValue()).toBe('');
    expect(service['_referenceId'].getValue()).toBe('');
  });

  describe('getConversations$', () => {
    beforeEach(() => {
      service.cleanUp();
      const testReferenceType = 'TEST';
      const testReferenceId = '123';
      service.initialize(testReferenceType, testReferenceId);
    });

    it('should get conversations', done => {
      const filter: Filter[] = [
        {
          field: 'testField',
          value: 'test',
        },
      ];
      const expectedFilers: Filter[] = [
        {
          field: 'testField',
          value: 'test',
        },
        {
          field: 'referenceType',
          value: 'TEST',
        },
        {
          field: 'referenceId',
          value: '123',
        },
      ];
      const pagination = new PagingRequestModel();

      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'getConversations$');

      service.getConversations$(filter, pagination).subscribe(response => {
        expect(workSpy).toBeCalledWith(expectedFilers, pagination);
        expect(response.items[0]).toEqual(ConversationMock);
        done();
      });
    });

    it('should append new conversations', done => {
      const pagination = new PagingRequestModel();

      service
        .getConversations$([], pagination)
        .pipe(
          tap(() => {
            expect(service['_conversations'].getValue().length).toEqual(1);
          }),
          switchMap(() => service.getConversations$([], pagination)),
          tap(() => {
            expect(service['_conversations'].getValue().length).toEqual(2);
            done();
          }),
        )
        .subscribe();
    });

    it('should map new conversations to model', done => {
      const pagination = new PagingRequestModel();
      service
        .getConversations$([], pagination)
        .pipe(switchMap(() => service.conversations$))
        .subscribe(conversations => {
          expect(conversations[0]).toEqual(ConversationMockModel);
          done();
        });
    });
  });

  describe('createNewConversation$', () => {
    it('should create a conversation', done => {
      service.initialize('TRANSACTION', TransactionMock.id);

      const messageBody = NewConversationModelMock.messageBody;
      const subject = NewConversationModelMock.subject;

      const workService = ngMocks.findInstance(WorkApiRoutesService);
      const workSpy = jest.spyOn(workService, 'createConversation$');

      service.createNewConversation$(messageBody, subject).subscribe(() => {
        expect(workSpy).toHaveBeenCalledWith(NewConversationModelMock);
        done();
      });
    });
  });
});
