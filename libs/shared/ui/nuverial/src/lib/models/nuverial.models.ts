import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Params } from '@angular/router';
import { NuverialButtonStyleType } from '../components/button';

// Used as input/output for validation messaging where the key is the validation type e.g. {required: 'is required'}
export type NuverialValidationErrorType = Record<string, string>;

export enum NuverialCrudActions {
  CREATE,
  UPDATE,
}

export enum NuverialMenuOptions {
  LOGOUT = 'logout',
  PREFERENCES = 'preferences',
  PROFILE = 'profile',
}

export const NUVERIAL_FILE_UPLOAD_STATUS = {
  failure: 'failure',
  initial: 'initial',
  pending: 'pending',
  processing: 'processing',
  success: 'success',
};

export type NuverialSnackBarType = 'error' | 'warn' | 'success';
export type NuverialColorThemeType = '' | 'primary' | 'accent' | 'warn' | 'danger';
export type NuverialCardImagePositionType = 'before' | 'top';
export type NuverialFieldLabelPositionType = 'before' | 'after';

export interface INuverialSnackBarAction {
  ariaLabel?: string;
  buttonStyle: NuverialButtonStyleType;
  colorTheme: NuverialColorThemeType;
  context: unknown;
  label: string;
  uppercaseText?: boolean;
}

export interface INuverialSnackBarConfiguration {
  ariaLabelDismiss?: string;
  dismissible?: boolean;
  duration?: number;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  message?: string;
  nuverialActions?: INuverialSnackBarAction[];
  politeness?: string;
  title?: string;
  type: NuverialSnackBarType;
  verticalPosition?: MatSnackBarVerticalPosition;
}

export interface INuverialPanel {
  ariaLabel?: string;
  disabled?: boolean;
  expanded?: boolean;
  id?: string;
  panelContent?: string;
  panelDescription?: string;
  panelTitle?: string;
}

export interface INuverialMenuItem {
  label: string;
  subTitle?: string;
  disabled?: boolean;
  icon?: string;
  key: string;
}

export interface INuverialNavBarMenuItem {
  icon: string;
  label?: string;
  navigationRoute: string;
  navigationParams?: Params;
  navigationSubRoute?: string;
}

export type NuverialInputFieldType =
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';
