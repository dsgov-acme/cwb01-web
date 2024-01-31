import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Mock, createMock, provideMock } from '@testing-library/angular/jest-utils';
import { lastValueFrom, of, take, tap } from 'rxjs';
import { AccessControlService } from '../services/access-control.service';
import { AccessControlGuardContract } from './access-control.guard';

const capability = 'test-capability';

describe('AccessControlGuard', () => {
  let accessControlGuard: AccessControlGuardContract;
  let accessControlService: Mock<AccessControlService>;

  beforeEach(() => {
    accessControlService = createMock(AccessControlService);

    TestBed.configureTestingModule({
      providers: [
        AccessControlGuardContract,
        {
          provide: AccessControlService,
          useValue: accessControlService,
        },
        provideMock(Router),
      ],
    });

    accessControlGuard = TestBed.inject(AccessControlGuardContract);
  });

  it('should create', () => {
    expect(accessControlGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('if capability is enabled it should return true', async () => {
      accessControlService.isAuthorized$.mockReturnValue(of(true));

      return lastValueFrom(
        accessControlGuard
          .canActivate({
            data: {
              capability,
            },
          } as unknown as ActivatedRouteSnapshot)
          .pipe(
            take(1),
            tap(result => {
              expect(result).toBe(true);
              expect(accessControlService.isAuthorized$).toHaveBeenCalledWith(capability);
            }),
          ),
      );
    });

    it('if feature is not enabled it should navigate to /testUrl', async () => {
      accessControlService.isAuthorized$.mockReturnValue(of(false));
      const routerMock = TestBed.inject(Router) as Mock<Router>;

      return lastValueFrom(
        accessControlGuard
          .canActivate({
            data: {
              capability,
              redirectUrl: '/testUrl',
            },
          } as unknown as ActivatedRouteSnapshot)
          .pipe(
            tap(_ => {
              expect(routerMock.parseUrl).toHaveBeenCalledWith('/testUrl');
              expect(accessControlService.isAuthorized$).toHaveBeenCalledWith(capability);
            }),
          ),
      );
    });
  });
});
