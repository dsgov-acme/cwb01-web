import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Filter, HttpTestingModule, PagingRequestModel, PagingResponseModel } from '@dsg/shared/utils/http';
import { IUser, IUsersPaginationResponse, RolesMock, UserMock, UserModel, UserModelMock } from '../models';
import { PreferencesModelMock } from '../models/preferences.mock';
import { UserApiRoutesService } from './user-api-routes.service';

describe('UserApiService', () => {
  let service: UserApiRoutesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
    });
    service = TestBed.inject(UserApiRoutesService);
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.spyOn<any, any>(service, '_handlePost$');
    jest.spyOn<any, any>(service, '_handleGet$');
    jest.spyOn<any, any>(service, '_handlePut$');
    jest.spyOn<any, any>(service, '_handleDelete$');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service['_baseUrl']).toEqual('https://dsgov-test.com/um/api');
  });

  it('createUpdateProfile$', done => {
    service.createUpdateProfile$(UserMock).subscribe(user => {
      expect(user).toEqual(UserMock);
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/myself`, UserMock.toSchema());
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/myself`);
    expect(req.request.method).toEqual('PUT');
    req.flush(UserModelMock);
  });

  it('getUser$', done => {
    service.getUser$().subscribe(user => {
      expect(user).toEqual(UserMock);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/myself`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/myself`);
    expect(req.request.method).toEqual('GET');
    req.flush(UserModelMock);
  });

  it('getUserById$', done => {
    service.getUserById$('4534546575675').subscribe(user => {
      expect(user).toEqual(UserMock);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/users/4534546575675`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/users/4534546575675`);
    expect(req.request.method).toEqual('GET');
    req.flush(UserModelMock);
  });

  it('createUpdateUserPreferences$', done => {
    service.createUpdateUserPreferences$('4534546575675', PreferencesModelMock).subscribe(() => {
      expect(service['_handlePut$']).toHaveBeenCalledWith(`/v1/users/4534546575675/preferences`, PreferencesModelMock.toSchema());
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/users/4534546575675/preferences`);
    expect(req.request.method).toEqual('PUT');
    req.flush(null);
  });

  describe('getUsers$', () => {
    const usersMock: IUsersPaginationResponse<IUser> = {
      pagingMetadata: new PagingResponseModel(),
      users: [UserModelMock],
    };
    it('getUsers$ without arguments', done => {
      service.getUsers$().subscribe(user => {
        expect(user).toEqual({ pagingMetadata: new PagingResponseModel(user.pagingMetadata), users: [new UserModel(UserModelMock)] });
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/users/`, '');
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/users/`, '');
      expect(req.request.method).toEqual('GET');
      req.flush({ users: [UserModelMock] });
    });

    it('getUsers$ with filters and pagingRequestModel', done => {
      const pagingRequestModel = new PagingRequestModel();
      const filters: Filter[] = [{ field: 'name', value: 'test' }];

      service.getUsers$(filters, pagingRequestModel).subscribe(user => {
        expect(user).toEqual({ pagingMetadata: new PagingResponseModel(user.pagingMetadata), users: [new UserModel(UserModelMock)] });
        expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/users/${pagingRequestModel.toSchema()}`, { params: expect.anything() });
        done();
      });

      const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/users/?pageNumber=0&pageSize=10&sortOrder=ASC&name=test`, '');
      expect(req.request.method).toEqual('GET');
      req.flush(usersMock);
    });
  });

  it('getRoles$', done => {
    service.getRoles$().subscribe(roles => {
      expect(roles).toEqual(RolesMock);
      expect(service['_handleGet$']).toHaveBeenCalledWith(`/v1/roles`);
      done();
    });

    const req = httpTestingController.expectOne(`${service['_baseUrl']}/v1/roles`);
    expect(req.request.method).toEqual('GET');
    req.flush(RolesMock);
  });
});
