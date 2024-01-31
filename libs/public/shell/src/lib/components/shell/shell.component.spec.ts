import { Router } from '@angular/router';
import { PublicFeatureProfileService } from '@dsg/public/feature/profile';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { AuthenticationService } from '@dsg/shared/feature/authentication';
import { LoadingService, NuverialMenuOptions } from '@dsg/shared/ui/nuverial';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { ShellComponent } from './shell.component';
const dependencies = MockBuilder(ShellComponent)
  .provide(
    MockProvider(AuthenticationService, {
      isAuthenticated$: of(true),
      signOut: jest.fn(),
    }),
  )
  .provide(
    MockProvider(PublicFeatureProfileService, {
      getProfile$: jest.fn().mockImplementation(() => of(getUserProfile())),
    }),
  )
  .provide(MockProvider(LoadingService))
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

  return { fixture };
};

describe('ShellComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  it('should have default values set for nav menu options', async () => {
    const { fixture } = await getFixture({});
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

  it('should set userAuthenticated$ to true when authenticated', async () => {
    const { fixture } = await getFixture({});
    fixture.componentInstance.userAuthenticated$.subscribe((val: boolean) => {
      expect(val).toEqual(true);
    });
  });

  it('should have no accessibility violations', async () => {
    const { fixture } = await getFixture({});
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should logout', async () => {
    const { fixture } = await getFixture({});
    const service = ngMocks.findInstance(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.LOGOUT);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not trigger signout on preferences', async () => {
    const { fixture } = await getFixture({});
    const service = ngMocks.findInstance(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PREFERENCES);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should load user profile information', async () => {
    const { fixture } = await getFixture({});
    const service = ngMocks.findInstance(PublicFeatureProfileService);
    const spy = jest.spyOn(service, 'getProfile$');
    fixture.componentInstance.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(fixture.componentInstance.profileMenuItemList[0].label).toEqual('John Doe');
    expect(fixture.componentInstance.profileMenuItemList[0].subTitle).toEqual('john.doe@example.com');
  });

  it('should not trigger signout on profile', async () => {
    const { fixture } = await getFixture({});
    const service = ngMocks.findInstance(AuthenticationService);
    const spy = jest.spyOn(service, 'signOut').mockImplementation(() => of(undefined));
    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PROFILE);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should navigate to the profile page when the profile menu item is selected', async () => {
    const { fixture } = await getFixture({});
    const router = fixture.debugElement.injector.get(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.componentInstance.onMenuItemSelect(NuverialMenuOptions.PROFILE);

    expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
  });

  it('should not navigate or sign out for an unknown menu option', async () => {
    const { fixture } = await getFixture({});
    const router = ngMocks.findInstance(Router);
    const authenticationService = ngMocks.findInstance(AuthenticationService);

    const navigateSpy = jest.spyOn(router, 'navigate');
    const signOutSpy = jest.spyOn(authenticationService, 'signOut');

    fixture.componentInstance.onMenuItemSelect('unknown_option');

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(signOutSpy).not.toHaveBeenCalled();
  });

  it('should handle null user profile gracefully', async () => {
    const { fixture } = await getFixture({});
    const service = ngMocks.findInstance(PublicFeatureProfileService);
    jest.spyOn(service, 'getProfile$').mockReturnValue(of(null));

    fixture.componentInstance.ngOnInit();

    expect(fixture.componentInstance.profileMenuItemList[0].label).toEqual('John Doe');
    expect(fixture.componentInstance.profileMenuItemList[0].subTitle).toEqual('john.doe@example.com');
  });

  it('should have all dependencies injected', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    expect(component['_router']).toBeDefined();
    expect(component['_authenticationService']).toBeDefined();
    expect(component['_profileService']).toBeDefined();
  });

  it('should initialize with correct initial state', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.userAuthenticated$.subscribe(isAuthenticated => {
      expect(isAuthenticated).toBe(true);
    });

    expect(component.currentTimestamp).toBeLessThanOrEqual(Date.now());
  });
});
