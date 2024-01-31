import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_CONFIGURATION } from '@dsg/shared/utils/environment';
import { take } from 'rxjs';
import { DEFAULT_FEATURE_FLAGS, FeatureKeys } from '../feature-flag.const';
import { FeatureFlagUserModel } from '../models/feature-flag-user.model';
import { EnvironmentFeatureFlagAdapter } from './environment-feature-flag.adapter';

const defaultFeatureFlags = { 'test-feature': false };
const environmentFeatureFlags = {};
const environmentConfiguration = { featureFlags: environmentFeatureFlags };

describe('EnvironmentFeatureFlagAdapter', () => {
  let adapter: EnvironmentFeatureFlagAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnvironmentFeatureFlagAdapter,
        { provide: DEFAULT_FEATURE_FLAGS, useValue: defaultFeatureFlags },
        { provide: ENVIRONMENT_CONFIGURATION, useValue: environmentConfiguration },
      ],
    });
    adapter = TestBed.inject(EnvironmentFeatureFlagAdapter);
  });

  test('should create', () => {
    expect(adapter).toBeTruthy();
  });

  describe('_initialize', () => {
    it('should set the when the environment flags do not exist', () => {
      jest.spyOn(adapter['_featureFlags'], 'next');
      jest.spyOn(adapter['_initialLoaded'], 'next');
      jest.spyOn(adapter['_initialLoaded'], 'complete');

      (adapter['_environment'] as any) = {};

      expect(adapter['_environment']).toEqual({});

      adapter['_initialize']();

      expect(adapter['_featureFlags'].next).toHaveBeenCalledWith({});
      expect(adapter['_initialLoaded'].next).toHaveBeenCalled();
      expect(adapter['_initialLoaded'].complete).toHaveBeenCalled();
    });
    it('should set the flags from the environment', () => {
      jest.spyOn(adapter['_featureFlags'], 'next');
      jest.spyOn(adapter['_initialLoaded'], 'next');
      jest.spyOn(adapter['_initialLoaded'], 'complete');

      expect(adapter['_environment']).toEqual({ featureFlags: environmentFeatureFlags });

      adapter['_initialize']();

      expect(adapter['_featureFlags'].next).toHaveBeenCalledWith(environmentFeatureFlags);
      expect(adapter['_initialLoaded'].next).toHaveBeenCalled();
      expect(adapter['_initialLoaded'].complete).toHaveBeenCalled();
    });
  });

  describe('getFeatureFlagValue$', () => {
    it('should return the correct value from the default flags', done => {
      adapter
        .getFeatureFlagValue$('test-feature')
        .pipe(take(1))
        .subscribe(value => {
          expect(value).toBe(false);
          done();
        });
    });

    it('should return the correct value from the environment flags', done => {
      adapter['_featureFlags'].next({ 'test-feature': true });

      adapter
        .getFeatureFlagValue$('test-feature' as FeatureKeys)
        .pipe(take(1))
        .subscribe(value => {
          expect(value).toBe(true);
          done();
        });
    });

    it('should replay latest 1 feature flag when subscribing', () => {
      // Arrange
      const values: any = [{ feature1: false }, { feature1: true }, { feature1: false }, { feature2: true }];
      const subscriberFn = jest.fn();

      // Act
      values.forEach((value: any) => {
        adapter['_featureFlags'].next(value);
      });
      adapter['_featureFlags'].subscribe(subscriberFn);

      // Assert
      expect(subscriberFn).toHaveBeenCalled();
    });

    describe('getFeatureFlagValue', () => {
      it('should return the correct value from the default flags', () => {
        expect(adapter.getFeatureFlagValue('test-feature')).toBe(false);
      });

      it('should return the correct value from the environment flags', () => {
        adapter['_featureFlags'].next({ 'test-feature': true });

        expect(adapter.getFeatureFlagValue('test-feature')).toBe(true);
      });
    });
  });

  it('identify should not be implemented', () => {
    expect(() => adapter.identify(new FeatureFlagUserModel())).toThrow('Environment adapter cannot identify');
  });
});
