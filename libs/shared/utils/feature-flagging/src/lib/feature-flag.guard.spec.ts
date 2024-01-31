import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Mock, createMock, provideMock } from '@testing-library/angular/jest-utils';
import { lastValueFrom, of, take, tap } from 'rxjs';
import { FeatureFlagGuardContract } from './feature-flag.guard';
import { FeatureFlagService } from './feature-flag.service';

const featureFlag = 'test-feature';

describe('FeatureFlagGuard', () => {
  let featureFlagGuard: FeatureFlagGuardContract;
  let featureFlagService: Mock<FeatureFlagService>;

  beforeEach(() => {
    featureFlagService = createMock(FeatureFlagService);

    TestBed.configureTestingModule({
      providers: [
        FeatureFlagGuardContract,
        {
          provide: FeatureFlagService,
          useValue: featureFlagService,
        },
        provideMock(Router),
      ],
    });

    featureFlagGuard = TestBed.inject(FeatureFlagGuardContract);
  });

  it('should create', () => {
    expect(featureFlagGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('if feature enabled it should return true', async () => {
      featureFlagService.isFeatureFlagEnabled$.mockReturnValue(of(true));

      return lastValueFrom(
        featureFlagGuard
          .canActivate({
            data: {
              featureFlag,
            },
          } as unknown as ActivatedRouteSnapshot)
          .pipe(
            take(1),
            tap(result => {
              expect(result).toBe(true);
              expect(featureFlagService.isFeatureFlagEnabled$).toHaveBeenCalledWith(featureFlag);
            }),
          ),
      );
    });

    it('if feature is not enabled it should navigate to /testUrl', async () => {
      featureFlagService.isFeatureFlagEnabled$.mockReturnValue(of(false));
      const routerMock = TestBed.inject(Router) as Mock<Router>;

      return lastValueFrom(
        featureFlagGuard
          .canActivate({
            data: {
              featureFlag,
              redirectUrl: '/testUrl',
            },
          } as unknown as ActivatedRouteSnapshot)
          .pipe(
            tap(_ => {
              expect(routerMock.parseUrl).toHaveBeenCalledWith('/testUrl');
              expect(featureFlagService.isFeatureFlagEnabled$).toHaveBeenCalledWith(featureFlag);
            }),
          ),
      );
    });
  });
});
