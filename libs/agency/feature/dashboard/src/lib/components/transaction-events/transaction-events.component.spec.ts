import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { AuditEventModel } from '@dsg/shared/data-access/audit-api';
import { AgencyUsersMock, UserModel } from '@dsg/shared/data-access/user-api';
import { IUserEmployerProfile, TransactionMock, TransactionModel, TransactionPrioritiesMock, UserEmployerProfileModel } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { EventsLogComponent, EventsLogService } from '@dsg/shared/feature/events';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { PagingResponseModel } from '@dsg/shared/utils/http';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';
import { TransactionEventsComponent } from './transaction-events.component';

describe('TransactionEventsComponent', () => {
  let component: TransactionEventsComponent;
  let fixture: ComponentFixture<TransactionEventsComponent>;
  let events: ReplaySubject<AuditEventModel[]>;
  let pagingMetadata: PagingResponseModel;
  const user = AgencyUsersMock.users.find(u => u.id === '111');
  const userMockModel = new UserModel(user);
  const transactionModelMock = new TransactionModel(TransactionMock);

  const userProfiles: IUserEmployerProfile = {
    displayName: 'Test Employer',
    id: '680f61b1-9225-4d88-92b2-3f3e695844a3',
    level: 'ADMIN',
    type: 'EMPLOYER',
  };
  const userProfiles2: IUserEmployerProfile = {
    displayName: 'Test Employer 2',
    id: '5acd9cb6-a426-4bd0-836a-a01125ce8ad8',
    level: 'WRITER',
    type: 'EMPLOYER',
  };
  const userProfilesMock = new UserEmployerProfileModel(userProfiles);
  const userProfilesMock2 = new UserEmployerProfileModel(userProfiles2);
  const userProfilesMockList = [userProfilesMock, userProfilesMock2];

  beforeEach(async () => {
    events = new ReplaySubject<AuditEventModel[]>(1);
    pagingMetadata = new PagingResponseModel({ nextPage: '1', pageNumber: 0, pageSize: 10, totalCount: 15 });

    await TestBed.configureTestingModule({
      imports: [TransactionEventsComponent, EventsLogComponent],
      providers: [
        MockProvider(HttpClient),
        MockProvider(EventsLogService, {
          clearEvents: jest.fn().mockImplementation(),
          events$: events.asObservable(),
          eventsPagination: pagingMetadata,
          initialize: jest.fn().mockImplementation(),
          loadEvents$: jest.fn().mockImplementation(() => of([])),
        }),
        MockProvider(UserStateService, {
          getUserById$: jest.fn().mockImplementation(() => of(userMockModel)),
          getUserProfiles$: jest.fn().mockImplementation(() => of(userProfilesMockList)),
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

    fixture = TestBed.createComponent(TransactionEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
