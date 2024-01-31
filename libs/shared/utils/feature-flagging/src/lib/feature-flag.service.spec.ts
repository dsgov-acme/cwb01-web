import { TestBed } from '@angular/core/testing';
import { createMockWithValues, Mock } from '@testing-library/angular/jest-utils';
import { of, take, toArray } from 'rxjs';
import { FeatureFlagAdapter } from './feature-flag.adapter';
import { DefaultFeatureFlags, DEFAULT_FEATURE_FLAGS, FeatureKeys } from './feature-flag.const';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagUserModel } from './models/feature-flag-user.model';
import { MockFeatureFlagAdapter } from './test/feature-flag.adapter.mock';

const testKey = 'test-feature' as FeatureKeys;

describe('FeatureFlagService', () => {
  let featureFlagService: FeatureFlagService;
  let featureFlagAdapter: Mock<MockFeatureFlagAdapter>;

  beforeEach(() => {
    featureFlagAdapter = createMockWithValues(MockFeatureFlagAdapter, {
      initialLoaded$: of(true),
    });

    TestBed.configureTestingModule({
      providers: [
        FeatureFlagService,
        {
          provide: FeatureFlagAdapter,
          useValue: featureFlagAdapter,
        },
        { provide: DEFAULT_FEATURE_FLAGS, useValue: { 'test-features': false } },
      ],
    });
    featureFlagService = TestBed.inject(FeatureFlagService);
  });

  it('should create', () => {
    expect(featureFlagService).toBeTruthy();
  });

  it('getFeatureFlagValue$ should call feature flag adapter', () => {
    featureFlagService.getFeatureFlagValue$(testKey).pipe(take(1)).subscribe();

    expect(featureFlagAdapter.getFeatureFlagValue$).toBeCalledWith(testKey);
  });

  it('isFeatureFlagEnabled$ should always return true for a feature that does not exist', done => {
    featureFlagAdapter.getFeatureFlagValue$.mockReturnValue(of(undefined));

    // Act
    featureFlagService
      .isFeatureFlagEnabled$(testKey)
      .pipe(take(1))
      .subscribe(value => {
        // Assert
        expect(value).toBe(DefaultFeatureFlags[testKey]);
        done();
      });
  });

  it('isFeatureFlagEnabled$ should update the value when the featureFlagValue updates', done => {
    featureFlagAdapter.getFeatureFlagValue$.mockReturnValue(of(false, true));

    // Act
    featureFlagService
      .isFeatureFlagEnabled$(testKey)
      .pipe(toArray())
      .subscribe((values: boolean[]) => {
        // Assert
        expect(values).toEqual([DefaultFeatureFlags[testKey], true]);
        done();
      });
  });

  it('getFeatureFlagValue should call the adapter', () => {
    featureFlagService.isFeatureFlagEnabled(testKey);
    expect(featureFlagAdapter.getFeatureFlagValue).toBeCalledWith(testKey);
  });

  it('identify should call the adapter', () => {
    featureFlagService.identify(new FeatureFlagUserModel());

    expect(featureFlagAdapter.identify).toBeCalled();
  });

  it('initialLoaded initial loaded should complete with the value of true', done => {
    featureFlagAdapter.getFeatureFlagValue$.mockReturnValue(of(undefined));

    // Act
    featureFlagService.initialLoaded$.pipe(take(1)).subscribe(value => {
      // Assert
      expect(value).toBe(true);
      done();
    });
  });
});
