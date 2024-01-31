import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';
import { BehaviorSubject, debounceTime, map, Observable, ReplaySubject } from 'rxjs';
import { FeatureFlagAdapter } from '../feature-flag.adapter';
import { DefaultFeatureFlags, DEFAULT_FEATURE_FLAGS, FeatureFlags, FeatureKeys, FeatureValues } from '../feature-flag.const';
import { FeatureFlagUserModel } from '../models/feature-flag-user.model';

@Injectable()
export class EnvironmentFeatureFlagAdapter implements FeatureFlagAdapter {
  public readonly initialLoaded$: Observable<boolean>;

  private readonly _featureFlags: BehaviorSubject<Record<string, FeatureValues>> = new BehaviorSubject<Record<string, FeatureValues>>({});
  private readonly _initialLoaded = new ReplaySubject<boolean>(1);

  constructor(
    @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment,
    // using a default to have an initial flag set, as a fail safe in case there is a problem with the configuration doesn't initialize
    @Inject(DEFAULT_FEATURE_FLAGS)
    private readonly _defaultFeatureFlags: typeof DefaultFeatureFlags,
  ) {
    this.initialLoaded$ = this._initialLoaded.asObservable();
    this._initialize();
  }

  public identify(_featureFlagUserModel: FeatureFlagUserModel): void {
    throw new Error('Environment adapter cannot identify');
  }

  public getFeatureFlagValue$(featureKey: FeatureKeys): Observable<FeatureValues> {
    return this._featureFlags.pipe(
      debounceTime(100),
      map(flags => this._getFeatureFlagValue(flags, featureKey)),
    );
  }

  public getFeatureFlagValue(featureKey: FeatureKeys): FeatureValues {
    return this._getFeatureFlagValue(this._featureFlags.value, featureKey);
  }

  private _getFeatureFlagValue(flags: Record<FeatureKeys, FeatureValues>, featureKey: FeatureKeys) {
    return flags[featureKey] ?? this._defaultFeatureFlags[featureKey];
  }

  private _initialize(): void {
    this._featureFlags.next((this._environment.featureFlags ?? {}) as FeatureFlags);
    this._initialLoaded.next(true);
    this._initialLoaded.complete();
  }
}
