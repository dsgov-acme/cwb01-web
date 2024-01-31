import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { PagingRequestModel } from './paging-request.model';

describe('PaginationModel', () => {
  let paginationModel: PagingRequestModel;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let activatedRouteSpy: { snapshot: any };

  beforeEach(async () => {
    activatedRouteSpy = {
      snapshot: {
        paramMap: convertToParamMap({
          pageNumber: 3,
        }),
      },
    };
    paginationModel = new PagingRequestModel();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        MockProvider(Router),
      ],
    });
    router = TestBed.inject(Router);
  });

  describe('set page number', () => {
    test('should set the page number', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const paginationModelWithRoute = new PagingRequestModel(undefined, router, activatedRoute);
      paginationModelWithRoute.pageNumber = 3;
      expect(navigateSpy).toHaveBeenCalledWith([activatedRoute], {
        queryParams: {
          pageNumber: paginationModelWithRoute.pageNumber,
          pageSize: null,
          sortBy: null,
          sortOrder: null,
        },
        queryParamsHandling: 'merge',
        relativeTo: undefined,
      });
      expect(paginationModelWithRoute.pageNumber).toEqual(3);
      expect(activatedRouteSpy.snapshot.paramMap.params.pageNumber).toEqual(paginationModelWithRoute.pageNumber);
    });

    test('should set the page size', () => {
      paginationModel.pageSize = 6;
      expect(paginationModel.pageSize).toEqual(6);
    });

    test('should set the pageSize', () => {
      paginationModel.sortOrder = 'DESC';
      expect(paginationModel.sortOrder).toEqual('DESC');
    });

    test('should set to all public properties', () => {
      paginationModel = new PagingRequestModel({
        pageNumber: 10,
        pageSize: 100,
        sortBy: 'test',
        sortOrder: 'DESC',
      });

      expect(paginationModel.pageNumber).toEqual(10);
      expect(paginationModel.pageSize).toEqual(100);
      expect(paginationModel.sortBy).toEqual('test');
      expect(paginationModel.sortOrder).toEqual('DESC');
    });
  });

  describe('resetToDefaultValues', () => {
    test('should reset all values to defaults', () => {
      paginationModel.reset();
      expect(paginationModel.pageNumber).toEqual(0);
      expect(paginationModel.pageSize).toEqual(10);
      expect(paginationModel.sortBy).toEqual('');
      expect(paginationModel.sortOrder).toEqual('ASC');
    });
  });

  describe('fromSchema', () => {
    test('should set all public properties to defaults', () => {
      expect(paginationModel.pageNumber).toEqual(0);
      expect(paginationModel.pageSize).toEqual(10);
      expect(paginationModel.sortBy).toEqual('');
      expect(paginationModel.sortOrder).toEqual('ASC');
    });

    test('should set default values when called with empty object', () => {
      paginationModel.fromSchema({});

      expect(paginationModel.pageNumber).toEqual(0);
      expect(paginationModel.pageSize).toEqual(10);
      expect(paginationModel.sortBy).toEqual('');
      expect(paginationModel.sortOrder).toEqual('ASC');
    });

    test('should set to all public properties', () => {
      paginationModel = new PagingRequestModel({
        pageNumber: 10,
        pageSize: 100,
        sortBy: 'test',
        sortOrder: 'DESC',
      });

      expect(paginationModel.pageNumber).toEqual(10);
      expect(paginationModel.pageSize).toEqual(100);
      expect(paginationModel.sortBy).toEqual('test');
      expect(paginationModel.sortOrder).toEqual('DESC');
    });
  });

  describe('toSchema', () => {
    test('should set to default query string', () => {
      expect(paginationModel.toSchema()).toEqual(`?pageNumber=0&pageSize=10&sortOrder=ASC`);
    });

    test('should set query string with sortBy', () => {
      paginationModel.sortBy = 'createdTimestamp';

      expect(paginationModel.toSchema()).toEqual(`?pageNumber=0&pageSize=10&sortOrder=ASC&sortBy=createdTimestamp`);
    });
  });
});
