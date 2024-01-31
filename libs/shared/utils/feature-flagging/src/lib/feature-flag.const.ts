import { InjectionToken } from '@angular/core';

export const DefaultFeatureFlags = {
  'test-feature': false, // Do not delete, this is used in the tests
};

export type FeatureKeys = keyof typeof DefaultFeatureFlags;
export type FeatureValues = typeof DefaultFeatureFlags[FeatureKeys];
export type FeatureFlags = Record<FeatureKeys, FeatureValues>;

export const DEFAULT_FEATURE_FLAGS = new InjectionToken<Record<FeatureKeys, FeatureValues>>('DEFAULT_FEATURE_FLAGS');
