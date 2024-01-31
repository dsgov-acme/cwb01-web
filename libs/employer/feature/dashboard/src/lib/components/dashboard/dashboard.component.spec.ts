import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { UserEmployerProfilesListMock } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import {
  ConfirmationModalReponses,
  NuverialDashboardCardComponent,
  NuverialDashboardCardsGroupComponent,
  NuverialSnackBarService,
} from '@dsg/shared/ui/nuverial';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const mockDialog: Partial<MatDialog> = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of(ConfirmationModalReponses.PrimaryAction),
    }),
  };
  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    const userProfileSubject = new BehaviorSubject(UserEmployerProfilesListMock[0]);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, BrowserAnimationsModule],
      providers: [
        NuverialDashboardCardsGroupComponent,
        NuverialDashboardCardComponent,
        MockProvider(ActivatedRoute),
        MockProvider(UserStateService, {
          getCurrentEmployerId: UserStateService.prototype.getCurrentEmployerId,
          setCurrentEmployerId: jest.fn((employerId: string) => {
            const newProfile = UserEmployerProfilesListMock.find(profile => profile.id === employerId);
            if (newProfile) {
              userProfileSubject.next(newProfile);
            }
          }),
          userEmployerProfiles$: of(UserEmployerProfilesListMock),
          userProfile$: userProfileSubject.asObservable(),
        }),
        { provide: LoggingAdapter, useValue: { debug: jest.fn(), error: jest.fn(), info: jest.fn(), warn: jest.fn() } },
        { provide: MatDialog, useValue: mockDialog },
        MockProvider(NuverialSnackBarService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial employer to first one returned from service', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.currentEmployer).toBe(UserEmployerProfilesListMock[0].displayName);
    expect(component.selectedEmployerId).toBe(UserEmployerProfilesListMock[0].id);
  });
  it('should update selectedEmployerId and currentEmployer based on dropdown selection', async () => {
    jest.spyOn(component['_dialog'], 'open').mockReturnValue({
      afterClosed: () => of(ConfirmationModalReponses.PrimaryAction),
    } as MatDialogRef<unknown, unknown>);
    const newEmployerId = UserEmployerProfilesListMock[1].id;
    component.onEmployerSelect(newEmployerId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.selectedEmployerId).toBe(newEmployerId);
    expect(component.currentEmployer).toBe(UserEmployerProfilesListMock[1].displayName);
  });
  it('should not update selectedEmployerId and currentEmployer based on dropdown selection if user cancels', async () => {
    const mockDialogRef = {
      afterClosed: () => of(ConfirmationModalReponses.SecondaryAction),
    };
    jest.spyOn(component['_dialog'], 'open').mockReturnValue(mockDialogRef as MatDialogRef<unknown, unknown>);

    const initialEmployerId = component.selectedEmployerId;
    const newEmployerId = UserEmployerProfilesListMock[1].id;

    component.onEmployerSelect(newEmployerId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.selectedEmployerId).toBe(initialEmployerId);
  });

  it('should not update selectedEmployerId if dialog is dismissed', async () => {
    jest.spyOn(component['_dialog'], 'open').mockReturnValue({
      afterClosed: () => of(null),
    } as MatDialogRef<unknown, unknown>);
    const currentEmployerId = component.selectedEmployerId;
    component.onEmployerSelect('newEmployerId');
    expect(component.selectedEmployerId).toBe(currentEmployerId);
  });
});
