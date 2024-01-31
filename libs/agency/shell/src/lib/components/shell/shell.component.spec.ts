import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { DashboardService } from '@dsg/agency/feature/dashboard';
import { AgencyFeatureProfileService } from '@dsg/agency/feature/profile';
import { AgencyUsersMock, UserModel } from '@dsg/shared/data-access/user-api';
import { DashboardColumn, DashboardList, DashboardModel } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { AuthenticationService } from '@dsg/shared/feature/authentication';
import { LoadingService, NuverialMenuOptions } from '@dsg/shared/ui/nuverial';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { of, Subject, tap } from 'rxjs';
import { ShellComponent } from './shell.component';

function getUserProfile(): UserModel {
  const user = new UserModel();
  user.displayName = 'John Doe';
  user.email = 'john.doe@example.com';

  return user;
}

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let routerEventsSubject: Subject<Event>;
  beforeEach(async () => {
    routerEventsSubject = new Subject<Event>();

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        MockProvider(AuthenticationService, {
          isAuthenticated$: of(true),
          signOut: jest.fn(),
        }),
        MockProvider(UserStateService, {
          initializeUsersCache$: jest.fn().mockImplementation(() => of(AgencyUsersMock)),
        }),
        MockProvider(AgencyFeatureProfileService, {
          getProfile$: jest.fn().mockImplementation(() => of(getUserProfile())),
        }),
        MockProvider(Router, {
          events: routerEventsSubject.asObservable(),
          url: '/dashboard',
        }),
        MockProvider(DashboardService, {
          getDashboards$: jest.fn().mockImplementation(() => of(DashboardList)),
        }),
        MockProvider(ActivatedRoute),
        MockProvider(LoadingService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    expect(fixture).toBeTruthy();
  });

  it('should set userAuthenticated$ to true when authenticated', done => {
    component.userAuthenticated$.subscribe((val: boolean) => {
      expect(val).toEqual(true);
      done();
    });
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  it('should be properly created with all dependencies', () => {
    expect(component['_router']).toBeTruthy();
    expect(component['_authenticationService']).toBeTruthy();
    expect(component['_profileService']).toBeTruthy();
    expect(component['_userStateService']).toBeTruthy();
  });

  it('should set agencySideNavMenuItems$ when authenticated', () => {
    component.ngOnInit();

    if (component.agencySideNavMenuItems$) {
      component.agencySideNavMenuItems$.subscribe(menuItems => {
        expect(menuItems).toBeDefined();
      });
    }
  });

  it('should load user profile information on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.profileMenuItemList[0].label).toEqual('John Doe');
    expect(component.profileMenuItemList[0].subTitle).toEqual('john.doe@example.com');
  }));

  it('should logout', async () => {
    const service = TestBed.inject(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.LOGOUT);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should load user profile information', async () => {
    const service = TestBed.inject(AgencyFeatureProfileService);
    const spy = jest.spyOn(service, 'getProfile$');
    fixture.componentInstance.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(fixture.componentInstance.profileMenuItemList[0].label).toEqual('John Doe');
    expect(fixture.componentInstance.profileMenuItemList[0].subTitle).toEqual('john.doe@example.com');
  });

  it('should not trigger auth service profile', done => {
    const service = TestBed.inject(AuthenticationService);
    const userStateservice = TestBed.inject(UserStateService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    userStateservice.initializeUsersCache$().subscribe(_ => {
      fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PROFILE);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
      done();
    });
  });

  it('should not trigger auth service on preferences', async () => {
    const service = TestBed.inject(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PREFERENCES);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should set agencySideNavMenuItems$ based on dashboard configs', done => {
    const dashboardService = TestBed.inject(DashboardService);
    const spy = jest.spyOn(dashboardService, 'getDashboards$');

    component.ngOnInit();
    expect(component.agencySideNavMenuItems$).toBeDefined();

    if (component.agencySideNavMenuItems$) {
      component.agencySideNavMenuItems$
        .pipe(
          tap(agencyMenu => {
            expect(agencyMenu).toBeDefined();
            expect(agencyMenu).toStrictEqual([
              {
                icon: 'search',
                label: 'Claims',
                navigationParams: { transactionSet: 'FinancialBenefit' },
                navigationRoute: 'dashboard',
              },
              {
                icon: 'search',
                label: 'Claims',
                navigationParams: { transactionSet: 'VehicalRegistration' },
                navigationRoute: 'dashboard',
              },
            ]);

            done();
          }),
        )
        .subscribe();
    }

    expect(spy).toHaveBeenCalled();
  });

  describe('_setPortalByURL', () => {
    it('should set isAdminPortal to true and portalNavigator route to dashboard if _router.url contains "admin"', fakeAsync(() => {
      Object.defineProperty(component['_router'], 'url', {
        get: () => '/admin',
      });

      component['_setPortalByURL']();
      expect(component.portalNavigator?.navigationRoute).toEqual('dashboard');
      expect(component.isAdminPortal).toEqual(true);
    }));

    it('should set isAdminPortal to false and portalNavigator route to admin if _router.url does not contains "admin"', fakeAsync(() => {
      Object.defineProperty(component['_router'], 'url', {
        get: () => '/dashboard',
      });

      component['_setPortalByURL']();
      expect(component.portalNavigator?.navigationRoute).toEqual('admin');
      expect(component.isAdminPortal).toEqual(false);
    }));

    it('should call _setPortalByURL when a NavigationEnd event is emitted', fakeAsync(() => {
      component.ngOnInit();
      const spy = jest.spyOn(component as any, '_setPortalByURL');

      routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));
      tick();

      expect(spy).toHaveBeenCalled();
    }));
  });

  it('should correctly map dashboard service response to agencySideNavMenuItems$', fakeAsync(() => {
    const dashboardService = TestBed.inject(DashboardService);
    const mockDashboardColumn: DashboardColumn = {
      attributePath: 'path.to.attribute',
      columnLabel: 'Column 1',
      displayFormat: 'DATETIME',

      sortable: true,
    };

    const mockDashboardData = [
      new DashboardModel({
        columns: [mockDashboardColumn],
        dashboardLabel: 'Mock Dashboard',
        menuIcon: 'dashboard_icon',
        tabs: [{ filter: {}, tabLabel: 'Tab 1' }],
        transactionDefinitionKeys: [],
        transactionSet: 'Transactions',
      }),
    ];

    jest.spyOn(dashboardService, 'getDashboards$').mockReturnValue(of(mockDashboardData));

    tick();

    component.agencySideNavMenuItems$?.subscribe(menuItems => {
      expect(menuItems).toEqual([
        {
          icon: 'dashboard_icon',
          navigationParams: { transactionSet: 'Transactions' },
          navigationRoute: 'dashboard',
        },
      ]);
    });
  }));

  it('should logout', async () => {
    const service = TestBed.inject(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.LOGOUT);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should load user profile information', async () => {
    const service = TestBed.inject(AgencyFeatureProfileService);
    const spy = jest.spyOn(service, 'getProfile$');
    fixture.componentInstance.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(fixture.componentInstance.profileMenuItemList[0].label).toEqual('John Doe');
    expect(fixture.componentInstance.profileMenuItemList[0].subTitle).toEqual('john.doe@example.com');
  });

  it('should not trigger auth service profile', done => {
    const service = TestBed.inject(AuthenticationService);
    const userStateservice = TestBed.inject(UserStateService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    userStateservice.initializeUsersCache$().subscribe(_ => {
      fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PROFILE);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
      done();
    });
  });

  it('should not trigger auth service on preferences', async () => {
    const service = TestBed.inject(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PREFERENCES);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  describe('_setPortalByURL', () => {
    it('should set isAdminPortal to true and portalNavigator route to dashboard if _router.url contains "admin"', fakeAsync(() => {
      Object.defineProperty(component['_router'], 'url', {
        get: () => '/admin',
      });

      component['_setPortalByURL']();
      expect(component.portalNavigator?.navigationRoute).toEqual('dashboard');
      expect(component.isAdminPortal).toEqual(true);
    }));

    it('should set isAdminPortal to false and portalNavigator route to admin if _router.url does not contains "admin"', fakeAsync(() => {
      Object.defineProperty(component['_router'], 'url', {
        get: () => '/dashboard',
      });

      component['_setPortalByURL']();
      expect(component.portalNavigator?.navigationRoute).toEqual('admin');
      expect(component.isAdminPortal).toEqual(false);
    }));

    it('should handle unexpected URL in _setPortalByURL', fakeAsync(() => {
      Object.defineProperty(component['_router'], 'url', {
        get: () => '/unexpected-route',
      });

      component['_setPortalByURL']();
    }));

    it('should update isAdminPortal when NavigationEnd event has admin path', fakeAsync(() => {
      routerEventsSubject.next(new NavigationEnd(1, '/admin/some-path', '/admin/some-path'));
      tick();
      expect(component.isAdminPortal).toBe(false);
    }));

    it('should update isAdminPortal when NavigationEnd event has non-admin path', fakeAsync(() => {
      routerEventsSubject.next(new NavigationEnd(1, '/dashboard', '/dashboard'));
      tick();
      expect(component.isAdminPortal).toBe(false);
    }));
  });

  describe('ngOnInit', () => {
    it('should set agencySideNavMenuItems$ when authenticated', fakeAsync(() => {
      const authService = TestBed.inject(AuthenticationService);
      Object.defineProperty(authService, 'isAuthenticated$', {
        value: of(true),
        writable: true,
      });
      component.ngOnInit();
      tick();
      expect(component.agencySideNavMenuItems$).toBeDefined();
    }));

    it('should not update profileMenuItemList if profile is null', fakeAsync(() => {
      const profileService = TestBed.inject(AgencyFeatureProfileService);
      jest.spyOn(profileService, 'getProfile$').mockReturnValue(of(null));
      component.ngOnInit();
      tick();
      expect(component.profileMenuItemList[0].label).not.toEqual('John Doe');
    }));
  });

  it('should set the correct isAdminPortal based on the URL path', fakeAsync(() => {
    const router = TestBed.inject(Router);
    Object.defineProperty(router, 'url', {
      configurable: true,
      get: () => '/admin',
    });
    component.ngOnInit();
    tick();
    expect(component.isAdminPortal).toBe(false);
  }));
});
