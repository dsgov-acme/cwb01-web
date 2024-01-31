import { INuverialSnackBarAction, NuverialSnackBarType } from '../../models';

export interface INuverialSnackBarComponentOptions {
  ariaLabelDismiss: string;
  dismissible: boolean;
  message?: string;
  nuverialActions?: INuverialSnackBarAction[];
  title?: string;
  type: NuverialSnackBarType;
}

export interface INuverialSnackBarData {
  config: INuverialSnackBarComponentOptions;
}
