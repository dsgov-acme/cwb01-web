import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { DashboardCategoriesMock2, DashboardService } from '@dsg/employer/feature/dashboard';
import { EmployerFeatureProfileService } from '@dsg/employer/feature/profile';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { AuthenticationService } from '@dsg/shared/feature/authentication';
import { LoadingService, NuverialMenuOptions, NuverialSideNavMenuComponent } from '@dsg/shared/ui/nuverial';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockProvider, ngMocks } from 'ng-mocks';
import { Observable, Subject, of } from 'rxjs';
import { ShellComponent } from './shell.component';

const dependencies = MockBuilder(ShellComponent)
  .provide(
    MockProvider(AuthenticationService, {
      isAuthenticated$: of(true),
      signOut: jest.fn(),
    }),
  )
  .provide(
    MockProvider(EmployerFeatureProfileService, {
      getProfile$: jest.fn().mockImplementation(() => of(getUserProfile())),
    }),
  )
  .mock(UserStateService, {
    initializeUserProfile: jest.fn(),
  })
  .mock(DashboardService, {
    getDashboardCategories: jest.fn().mockImplementation(() => DashboardCategoriesMock2),
  })
  .provide(
    MockProvider(Router, {
      events: new Observable(),
      url: '/dashboard',
    }),
  )
  .provide(MockProvider(LoadingService))
  .keep(NuverialSideNavMenuComponent)
  .build();

function getUserProfile(): UserModel {
  const user = new UserModel();
  user.displayName = 'John Doe';
  user.email = 'john.doe@example.com';

  return user;
}

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(ShellComponent, {
    ...dependencies,
    ...props,
  });

  return fixture;
};

describe('ShellComponent', () => {
  it('should create', async () => {
    const fixture = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  it('should have default values set for nav menu options', async () => {
    const fixture = await getFixture({});
    const menuItemList = [
      {
        disabled: false,
        icon: 'account_circle-outline',
        key: NuverialMenuOptions.PROFILE,
        label: 'John Doe',
        subTitle: 'john.doe@example.com',
      },
      {
        disabled: false,
        icon: 'settings-outline',
        key: NuverialMenuOptions.PREFERENCES,
        label: 'Preferences',
      },
      {
        disabled: false,
        icon: 'logout-outline',
        key: NuverialMenuOptions.LOGOUT,
        label: 'Logout',
      },
    ];
    expect(fixture.componentInstance.profileMenuItemList).toEqual(menuItemList);
  });

  it('should get the menu items', async () => {
    const fixture = await getFixture({});
    fixture.detectChanges();

    const menuItemList = DashboardCategoriesMock2.map(category => ({
      icon: category.icon,
      label: category.name,
      navigationRoute: `/dashboard/${category.route}`,
      navigationSubRoute: category.hasTransactionList ? '' : `/${category.subCategories[0].relativeRoute}`,
    }));

    expect(fixture.componentInstance.menuItemList).toEqual(menuItemList);
  });

  it('should set userAuthenticated$ to true when authenticated', async () => {
    const fixture = await getFixture({});
    fixture.componentInstance.userAuthenticated$.subscribe((val: boolean) => {
      expect(val).toEqual(true);
    });
  });

  it('should have no accessibility violations', async () => {
    const fixture = await getFixture({});
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should logout', async () => {
    const fixture = await getFixture({});
    const service = ngMocks.findInstance(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.LOGOUT);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not trigger signout on preferences', async () => {
    const fixture = await getFixture({});
    const service = ngMocks.findInstance(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PREFERENCES);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should load user profile information', async () => {
    const fixture = await getFixture({});
    const profileService = ngMocks.findInstance(EmployerFeatureProfileService);
    const getSpy = jest.spyOn(profileService, 'getProfile$');
    const stateSpy = ngMocks.findInstance(UserStateService);
    const initSpy = jest.spyOn(stateSpy, 'initializeUserProfile');
    fixture.componentInstance.ngOnInit();
    expect(getSpy).toHaveBeenCalled();
    expect(initSpy).toHaveBeenCalled();
    expect(fixture.componentInstance.profileMenuItemList[0].label).toEqual('John Doe');
    expect(fixture.componentInstance.profileMenuItemList[0].subTitle).toEqual('john.doe@example.com');
  });

  it('should not trigger signout on profile', async () => {
    const fixture = await getFixture({});
    const service = ngMocks.findInstance(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PROFILE);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should navigate to the profile page when the profile menu item is selected', async () => {
    const fixture = await getFixture({});
    const router = fixture.debugElement.injector.get(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PROFILE);

    expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
  });

  it('should not navigate or sign out for an unknown menu option', async () => {
    const fixture = await getFixture({});
    const router = ngMocks.findInstance(Router);
    const authenticationService = ngMocks.findInstance(AuthenticationService);

    const navigateSpy = jest.spyOn(router, 'navigate');
    const signOutSpy = jest.spyOn(authenticationService, 'signOut');

    fixture.componentInstance.onMenuItemSelect('unknown_option');

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(signOutSpy).not.toHaveBeenCalled();
  });

  it('should handle null user profile gracefully', async () => {
    const fixture = await getFixture({});
    const service = ngMocks.findInstance(EmployerFeatureProfileService);
    jest.spyOn(service, 'getProfile$').mockReturnValue(of(null));

    fixture.componentInstance.ngOnInit();

    expect(fixture.componentInstance.profileMenuItemList[0].label).toEqual('John Doe');
    expect(fixture.componentInstance.profileMenuItemList[0].subTitle).toEqual('john.doe@example.com');
  });

  it('should have all dependencies injected', async () => {
    const fixture = await getFixture({});
    const component = fixture.componentInstance;

    expect(component['_router']).toBeDefined();
    expect(component['_authenticationService']).toBeDefined();
    expect(component['_profileService']).toBeDefined();
  });

  it('should initialize with correct initial state', async () => {
    const fixture = await getFixture({});
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.userAuthenticated$.subscribe(isAuthenticated => {
      expect(isAuthenticated).toBe(true);
    });

    expect(component.currentTimestamp).toBeLessThanOrEqual(Date.now());
  });

  describe('_hideMenuByURL', () => {
    let fixture: ComponentFixture<ShellComponent>;
    let component: ShellComponent;
    const routerEventsSubject: Subject<Event> = new Subject<Event>();

    beforeEach(async () => {
      fixture = await getFixture({});
      component = fixture.componentInstance;

      const routerService = ngMocks.findInstance(Router);
      Object.defineProperty(routerService, 'events', {
        value: routerEventsSubject.asObservable(),
      });

      fixture.detectChanges();
    });

    it('should set isDashboard to true if _router.url is "dashboard"', () => {
      Object.defineProperty(component['_router'], 'url', {
        get: () => '/dashboard',
      });

      component['_hideMenuByURL']();
      expect(component.isDashboard).toEqual(true);
    });

    it('should set isDashboard to false if _router.url doesn\'t match "dashboard"', () => {
      Object.defineProperty(component['_router'], 'url', {
        get: () => '/dashboard/test-category',
      });

      component['_hideMenuByURL']();
      expect(component.isDashboard).toEqual(false);
    });

    it('should call _hideMenuByURL when a NavigationEnd event is emitted', fakeAsync(() => {
      component.ngOnInit();
      const spy = jest.spyOn(component as any, '_hideMenuByURL');

      routerEventsSubject.next(new NavigationEnd(1, '/admin/some-path', '/admin/some-path') as any);

      tick();

      expect(spy).toHaveBeenCalled();
    }));
  });
});
