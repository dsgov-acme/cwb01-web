import { TestBed } from '@angular/core/testing';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { EmployerDetailModel } from '@dsg/shared/data-access/work-api';
import { ApiEmployerDetailMock, ApiEmployerUserMock, EmployerDetailService } from './employer-detail.service';

describe('EmployerDetailService', () => {
  let service: EmployerDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployerDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEmployerDetails$', () => {
    it('should return correct EmployerDetailModel', done => {
      service.getEmployerDetails$().subscribe(employerDetail => {
        expect(employerDetail).toBeInstanceOf(EmployerDetailModel);
        expect(employerDetail.toSchema()).toEqual(ApiEmployerDetailMock);
        done();
      });
    });
  });

  describe('getEmployerAgents$', () => {
    it('should return correct UserModel', done => {
      service.getEmployerAgents$().subscribe(users => {
        expect(users[0]).toBeInstanceOf(UserModel);
        expect(users[0].toSchema()).toEqual(ApiEmployerUserMock.toSchema());
        done();
      });
    });
  });
});
