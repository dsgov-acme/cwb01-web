import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuditEventDataUpdatedModelMock,
  AuditEventDocumentUnacceptedMock,
  AuditEventDocumentUnrejectedMock,
  AuditEventMock,
  AuditEventModel,
  AuditEventModelMock,
  AuditEventNoteAddedMock,
  AuditEventNoteDeletedMock,
  AuditEventNoteUpdatedMock,
  AuditEventOwnerChangedMock,
  AuditEventProfileInvitationClaimedMock,
  AuditEventProfileInvitationDeletedMock,
  AuditEventProfileInvitationSentMock,
  AuditEventProfileUserAcessChangedMock,
  AuditEventProfileUserAddedMock,
  AuditEventProfileUserRemovedMock,
  AuditEventTransactionAssignedModelMock,
  AuditEventTransactionPriorityChangedMock,
  AuditEventTransactionStatusChangedMock,
  AuditEventTransactionUnassignedModelMock,
} from '@dsg/shared/data-access/audit-api';
import { AgencyUsersMock, UserModel } from '@dsg/shared/data-access/user-api';
import { TransactionMock, TransactionModel, TransactionPrioritiesMock } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { PagingResponseModel } from '@dsg/shared/utils/http';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { of, ReplaySubject } from 'rxjs';
import { EventsLogService } from '../../services';
import { EventsLogComponent } from './events-log.component';

describe('EventsLogComponent', () => {
  let component: EventsLogComponent;
  let fixture: ComponentFixture<EventsLogComponent>;
  let pagingMetadata: PagingResponseModel;
  let auditEventDataUpdatedModelMock: AuditEventModel;
  let events: ReplaySubject<AuditEventModel[]>;
  let router: Router;
  const transactionModelMock = new TransactionModel(TransactionMock);

  const user = AgencyUsersMock.users.find(u => u.id === '111');
  const userMockModel = new UserModel(user);

  beforeEach(async () => {
    events = new ReplaySubject<AuditEventModel[]>(1);
    auditEventDataUpdatedModelMock = new AuditEventModel(AuditEventDataUpdatedModelMock);
    pagingMetadata = new PagingResponseModel({ nextPage: '1', pageNumber: 0, pageSize: 10, totalCount: 15 });
    await TestBed.configureTestingModule({
      imports: [EventsLogComponent, RouterTestingModule.withRoutes([{ component: EventsLogComponent, path: 'activity-log' }])],
      providers: [
        MockProvider(EventsLogService, {
          clearEvents: jest.fn().mockImplementation(),
          events$: events.asObservable(),
          eventsPagination: pagingMetadata,
          loadEvents$: jest.fn().mockImplementation(() => of([])),
        }),
        MockProvider(UserStateService, {
          getUserById$: jest.fn().mockImplementation(() => of(userMockModel)),
        }),
        MockProvider(FormRendererService, {
          transaction$: of(new TransactionModel(transactionModelMock)),
        }),
        MockProvider(EnumerationsStateService, {
          getDataFromEnum$: jest
            .fn()
            .mockImplementationOnce(() => of(TransactionPrioritiesMock.get('LOW')))
            .mockImplementationOnce(() => of(TransactionPrioritiesMock.get('MEDIUM'))),
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EventsLogComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await router.navigateByUrl('activity-log');
    fixture.detectChanges();
  });

  describe('Accessability', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);
      expect.extend(toHaveNoViolations);
      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('trackByFn', async () => {
    const results = component.trackByFn(1);
    expect(results).toEqual(1);
  });

  describe('eventsDetails', () => {
    let eventsLogService: EventsLogService;
    beforeEach(async () => {
      eventsLogService = TestBed.inject(EventsLogService);
    });

    it('should call loadEvents$', fakeAsync(() => {
      const spy = jest.spyOn(eventsLogService, 'loadEvents$').mockReturnValue(of([AuditEventModelMock]));
      events.next([AuditEventModelMock]);

      tick();
      expect(spy).toHaveBeenCalled();
    }));
  });

  it('should call getEvents on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getEvents$');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  describe('loadMoreEvents', () => {
    it('should call getEvents when events size is less than totalEventsCount', () => {
      const getEventsSpy = jest.spyOn(component, 'getEvents$');
      component.loadMoreEvents();
      expect(getEventsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleEventTitle', () => {
    let auditEventModelMock: AuditEventModel;
    it('should call _handleEmployerEventTitle when businessObjectType is employer', () => {
      auditEventModelMock = new AuditEventModel(AuditEventProfileUserAddedMock);
      const handleEmployerEventTitleSpy = jest.spyOn<any, any>(component, '_handleEmployerEventTitle');
      component['_handleEventTitle'](auditEventModelMock);
      expect(handleEmployerEventTitleSpy).toHaveBeenCalledWith(auditEventModelMock);
    });

    it('should call _handleTransactionEventTitle when businessObjectType is transaction', () => {
      auditEventModelMock = new AuditEventModel(AuditEventMock);
      const handleTransactionEventTitle = jest.spyOn<any, any>(component, '_handleTransactionEventTitle');
      component['_handleEventTitle'](auditEventModelMock);
      expect(handleTransactionEventTitle).toHaveBeenCalledWith(auditEventModelMock);
    });

    it('should set summary to "Unable to render event summary" on error', () => {
      const error = new Error();
      auditEventModelMock = new AuditEventModel(AuditEventMock);
      jest.spyOn<any, any>(component, '_handleTransactionEventTitle').mockImplementation(() => {
        throw error;
      });
      component['_handleEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Unable to render event summary');
    });
  });

  describe('handleTransactionEventTitle', () => {
    let auditEventModelMock: AuditEventModel;
    it('should map correct summary based on type - transaction_created', () => {
      auditEventModelMock = new AuditEventModel(AuditEventMock);
      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Application created');
    });

    it('should map correct summary based on type - transaction_data_updated', () => {
      auditEventModelMock = new AuditEventModel(auditEventDataUpdatedModelMock);

      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Application edited');
    });

    it('should map correct summary based on type - note_added', () => {
      auditEventModelMock = new AuditEventModel(AuditEventNoteAddedMock);

      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Note added');
    });

    it('should map correct summary based on type - note_deleted', () => {
      auditEventModelMock = new AuditEventModel(AuditEventNoteDeletedMock);

      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Note deleted');
    });

    it('should map correct summary based on type - note_updated', () => {
      auditEventModelMock = new AuditEventModel(AuditEventNoteUpdatedMock);

      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Note edited');
    });

    it('should map correct summary based on type - transaction_status_changed', () => {
      auditEventModelMock = new AuditEventModel(AuditEventTransactionStatusChangedMock);
      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Application status changed from Draft to Review');
    });

    it('should map correct summary based on type - transaction_priority_changed', async () => {
      auditEventModelMock = new AuditEventModel(AuditEventTransactionPriorityChangedMock);
      await component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe(`Application priority changed from <span class="title-priority low">
      <span class="material-icons priority-icon">remove</span>Low</span> to <span class="title-priority medium">
      <span class="material-icons priority-icon">drag_handle</span>Medium</span>`);
    });

    it('should map correct summary based on type - transaction_priority_changed - missing changed values', async () => {
      auditEventModelMock = new AuditEventModel(AuditEventTransactionPriorityChangedMock);
      auditEventModelMock.eventData.oldState = undefined;
      auditEventModelMock.eventData.newState = undefined;
      await component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe(`Application priority changed (Missing changed values)`);
    });

    it('should map correct summary based on type - transaction_priority_changed - unexpected change data', async () => {
      auditEventModelMock = new AuditEventModel(AuditEventTransactionPriorityChangedMock);
      auditEventModelMock.eventData.oldState = 'unexpectedData';
      auditEventModelMock.eventData.newState = 'unexpectedData';
      await component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe(`Application priority changed (Unable to render changed values)`);
    });

    it('should map correct summary based on type - document_unaccepted', () => {
      auditEventModelMock = new AuditEventModel(AuditEventDocumentUnacceptedMock);
      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Document reset back to New from Accepted');
    });

    it('should map correct summary based on type - document_unrejected', () => {
      auditEventModelMock = new AuditEventModel(AuditEventDocumentUnrejectedMock);
      component['_handleTransactionEventTitle'](auditEventModelMock);
      expect(auditEventModelMock.summary).toBe('Document reset back to New from Rejected');
    });

    it('should map correct summary based on type - transaction_assigned_to_changed - unassign', done => {
      auditEventModelMock = new AuditEventModel(AuditEventTransactionUnassignedModelMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === auditEventModelMock.eventData.newState);
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      component['_handleTransactionEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing unassigned this application');
        done();
      });
    });

    it('should map correct summary based on type - transaction_assigned_to_changed - assign', done => {
      auditEventModelMock = new AuditEventModel(AuditEventTransactionAssignedModelMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      const spy = jest.spyOn(userStateService, 'getUserDisplayName$');
      component['_handleTransactionEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing assigned this application to Chandler M Bing');
        expect(spy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('handleEmployerEventTitle', () => {
    let auditEventModelMock: AuditEventModel;

    it('should map correct summary based on type - employer_profile_user_added', done => {
      auditEventModelMock = new AuditEventModel(AuditEventProfileUserAddedMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      component['_handleEmployerEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing added Chandler M Bing');
        done();
      });
    });

    it('should map correct summary based on type - employer_profile_user_removed', done => {
      auditEventModelMock = new AuditEventModel(AuditEventProfileUserRemovedMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      component['_handleEmployerEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing removed Chandler M Bing');
        done();
      });
    });

    it('should map correct summary based on type - employer_profile_user_access_level_changed', done => {
      auditEventModelMock = new AuditEventModel(AuditEventProfileUserAcessChangedMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      component['_handleEmployerEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing edited access for Chandler M Bing');
        done();
      });
    });

    it('should map correct summary based on type - employer_profile_invitation_sent', done => {
      auditEventModelMock = new AuditEventModel(AuditEventProfileInvitationSentMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      component['_handleEmployerEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing invited Chandler M Bing');
        done();
      });
    });

    it('should map correct summary based on type - employer_profile_invitation_claimed', done => {
      auditEventModelMock = new AuditEventModel(AuditEventProfileInvitationClaimedMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      component['_handleEmployerEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing claimed invite from Chandler M Bing');
        done();
      });
    });

    it('should map correct summary based on type - employer_profile_invitation_deleted', done => {
      auditEventModelMock = new AuditEventModel(AuditEventProfileInvitationDeletedMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));

      component['_handleEmployerEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe("Gellar Bing deleted Chandler M Bing's invite");
        done();
      });
    });

    it('should map correct summary based on type - individual_profile_owner_changed', done => {
      auditEventModelMock = new AuditEventModel(AuditEventOwnerChangedMock);
      auditEventModelMock.displayName = 'Gellar Bing';

      const user2 = AgencyUsersMock.users.find(u => u.id === '222');
      const userStateService = TestBed.inject(UserStateService);
      userStateService.getUserDisplayName$ = jest
        .fn()
        .mockImplementationOnce(() => of('Gellar Bing'))
        .mockImplementationOnce(() => of(user2?.displayName));
      component['_handleEmployerEventTitle'](auditEventModelMock).then(() => {
        expect(auditEventModelMock.summary).toBe('Gellar Bing changed owner to Chandler M Bing');
        done();
      });
    });
  });
});
