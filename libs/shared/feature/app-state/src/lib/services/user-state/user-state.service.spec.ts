import { TestBed } from '@angular/core/testing';
import { UserApiRoutesService, UserMock, UserModel, UserPreferencesModel } from '@dsg/shared/data-access/user-api';
import { UserEmployerProfilesListMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of, take } from 'rxjs';
import { UserStateService } from './user-state.service';

const UserModelMock = new UserModel(UserMock);
const ValidUserId = '3f7efb30-1a32-4a61-808a-64a60dbbee27';
const InvalidUserId = 'invalidId';

describe('UserStateService', () => {
  let service: UserStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(UserApiRoutesService, {
          createUpdateProfile$: jest.fn().mockImplementation(() => of(UserModelMock)),
          createUpdateUserPreferences$: jest.fn().mockImplementation(() => of(new UserPreferencesModel())),
          getUser$: jest.fn().mockImplementation(() => of(UserModelMock)),
          getUserById$: jest.fn().mockImplementation(() => of(UserModelMock)),
          getUsers$: jest.fn().mockImplementation(() => of({ users: [UserModelMock] })),
        }),
        MockProvider(WorkApiRoutesService, {
          getUserProfiles$: jest.fn().mockImplementation(() => of(UserEmployerProfilesListMock)),
        }),
      ],
    });
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize user profile', done => {
    const spy = jest.spyOn(service, 'getUserProfiles$');

    service.initializeUserProfile();

    service.userProfile$.pipe(take(1)).subscribe(profile => {
      expect(spy).toHaveBeenCalled();
      expect(profile).toEqual(UserEmployerProfilesListMock[0]);
      done();
    });
  });

  it('should initialize user', () => {
    const spy = jest.spyOn(service, 'getUser$');

    service.initializeUser();

    expect(spy).toHaveBeenCalled();
  });

  it('should initialize users cache', done => {
    const userManagementService = ngMocks.findInstance(UserApiRoutesService);
    const spy = jest.spyOn(userManagementService, 'getUsers$');

    service.initializeUsersCache$().subscribe(() => {
      expect(service['_usersCache'].get(UserModelMock.id)).toEqual(UserModelMock);
      expect(spy).toHaveBeenCalled();

      done();
    });
  });

  it('should cleanup users state', () => {
    const spy = jest.spyOn(service['_user'], 'next');

    service['_usersCache'].set(ValidUserId, UserModelMock);

    expect(service['_usersCache'].size).toBeTruthy();

    service.clearUserState();

    expect(spy).toBeCalledWith(null);
    expect(service['_usersCache'].size).toBeFalsy();
  });

  it('should save the user', done => {
    const userManagementService = ngMocks.findInstance(UserApiRoutesService);
    const updatePreferencesSpy = jest.spyOn(userManagementService, 'createUpdateUserPreferences$');
    const updateUserSpy = jest.spyOn(userManagementService, 'createUpdateProfile$');

    service.saveUser$(UserModelMock).subscribe(() => {
      expect(updatePreferencesSpy).toHaveBeenCalled();
      expect(updateUserSpy).toHaveBeenCalled();

      done();
    });
  });

  describe('getUserById$', () => {
    it('Should return undefined if no userId is provided', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service.getUserById$().subscribe(userModel => {
        expect(userModel).toEqual(undefined);
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return undefined when an invalid userId is provided', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service.getUserById$(InvalidUserId).subscribe(userModel => {
        expect(userModel).toEqual(undefined);
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return a user from the lruCache when the user does exist in the cache', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service['_usersCache'].clear();
      service['_usersCache'].set(ValidUserId, UserModelMock);
      service.getUserById$(ValidUserId).subscribe(userModel => {
        expect(userModel).toEqual(UserModelMock);
        expect(service['_usersCache'].get(ValidUserId)).toBe(UserModelMock);
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return a user from the api when the user does not exist in the cache', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service['_usersCache'].clear();
      expect(service['_usersCache'].get(ValidUserId)).toBe(undefined);
      service.getUserById$(ValidUserId).subscribe(userModel => {
        expect(userModel).toEqual(UserModelMock);
        expect(service['_usersCache'].get(ValidUserId)).toBe(UserModelMock);
        expect(spy).toHaveBeenCalled();

        done();
      });
    });
  });

  describe('getUserDisplayName$', () => {
    it('Should return an empty string if no userId is provided', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service.getUserDisplayName$().subscribe(displayName => {
        expect(displayName).toEqual('');
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return the provided id when an invalid userId is provided', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service.getUserDisplayName$(InvalidUserId).subscribe(displayName => {
        expect(displayName).toEqual(InvalidUserId);
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return the display name from the lruCache when the user does exist in the cache', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service['_usersCache'].clear();
      service['_usersCache'].set(ValidUserId, UserModelMock);
      service.getUserDisplayName$(ValidUserId).subscribe(displayName => {
        expect(displayName).toEqual(UserModelMock.displayName);
        expect(service['_usersCache'].get(ValidUserId)).toBe(UserModelMock);
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return a display name from the api when the user does not exist in the cache', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service['_usersCache'].clear();
      expect(service['_usersCache'].get(ValidUserId)).toBe(undefined);
      service.getUserDisplayName$(ValidUserId).subscribe(displayName => {
        expect(displayName).toEqual(UserModelMock.displayName);
        expect(service['_usersCache'].get(ValidUserId)).toBe(UserModelMock);
        expect(spy).toHaveBeenCalled();

        done();
      });
    });
  });

  describe('getUserEmail$', () => {
    it('Should return an empty string if no userId is provided', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service.getUserEmail$().subscribe(email => {
        expect(email).toEqual('');
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return the provided id when an invalid userId is provided', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service.getUserEmail$(InvalidUserId).subscribe(email => {
        expect(email).toEqual(InvalidUserId);
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return the email from the lruCache when the user does exist in the cache', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service['_usersCache'].clear();
      service['_usersCache'].set(ValidUserId, UserModelMock);
      service.getUserEmail$(ValidUserId).subscribe(email => {
        expect(email).toEqual(UserModelMock.email);
        expect(service['_usersCache'].get(ValidUserId)).toBe(UserModelMock);
        expect(spy).not.toHaveBeenCalled();

        done();
      });
    });

    it('Should return a email from the api when the user does not exist in the cache', done => {
      const userManagementService = ngMocks.findInstance(UserApiRoutesService);
      const spy = jest.spyOn(userManagementService, 'getUserById$');

      service['_usersCache'].clear();
      expect(service['_usersCache'].get(ValidUserId)).toBe(undefined);
      service.getUserEmail$(ValidUserId).subscribe(email => {
        expect(email).toEqual(UserModelMock.email);
        expect(service['_usersCache'].get(ValidUserId)).toBe(UserModelMock);
        expect(spy).toHaveBeenCalled();

        done();
      });
    });
  });
});
