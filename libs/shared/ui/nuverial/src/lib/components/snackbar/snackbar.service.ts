import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { INuverialSnackBarConfiguration, NuverialSnackBarType, NUVERIAL_DEFAULT_SNACKBAR_CONFIGURATION } from '../../models';
import { NuverialSnackBarRef } from './snackbar-ref';
import { NuverialSnackbarComponent } from './snackbar.component';

/**
 * SnackBar Service
 */

@Injectable({
  providedIn: 'root',
})
export class NuverialSnackBarService {
  protected _nuverialSnackBarRef!: NuverialSnackBarRef;

  constructor(protected readonly _snackBar: MatSnackBar) {}

  public open(type: NuverialSnackBarType, title: string, message: string, duration: number, dismissible: boolean): NuverialSnackBarRef {
    return this.openConfigured({
      dismissible,
      duration,
      message,
      title,
      type,
    });
  }

  /**
   * Handle an application error, this is a last resort fallback to notify users of an error that hasn't been gracefully handled
   */
  public notifyApplicationError(message?: string): NuverialSnackBarRef {
    return this.openConfigured({
      message: message || 'The application encountered an error',
      type: 'error',
      verticalPosition: 'bottom',
    });
  }

  /**
   * Handle an application success, this is a last resort fallback to notify users his action was successful
   */
  public notifyApplicationSuccess(message?: string): NuverialSnackBarRef {
    return this.openConfigured({
      message: message || 'Changes saved successfully',
      type: 'success',
      verticalPosition: 'bottom',
    });
  }

  public openConfigured(config: INuverialSnackBarConfiguration): NuverialSnackBarRef {
    let dismissible = config.dismissible;
    if (dismissible === undefined) {
      dismissible = NUVERIAL_DEFAULT_SNACKBAR_CONFIGURATION.dismissible;
    }

    const horizontalPosition = config?.horizontalPosition || NUVERIAL_DEFAULT_SNACKBAR_CONFIGURATION.horizontalPosition;

    const verticalPosition = config?.verticalPosition || NUVERIAL_DEFAULT_SNACKBAR_CONFIGURATION.verticalPosition;

    const _matSnackBarRef: MatSnackBarRef<NuverialSnackbarComponent> = this._snackBar.openFromComponent(NuverialSnackbarComponent, {
      data: {
        ...config,
        ariaLabelDismiss: config?.ariaLabelDismiss || 'Close snackbar',
        dismissible,
        type: config?.type || NUVERIAL_DEFAULT_SNACKBAR_CONFIGURATION.type,
      },
      duration: !dismissible && !config?.duration ? 0 : config?.duration || NUVERIAL_DEFAULT_SNACKBAR_CONFIGURATION.duration,
      horizontalPosition,
      panelClass: [`nuverial-snackbar-container`, `snackbar-${config.type}`],
      verticalPosition,
    });

    this._nuverialSnackBarRef = new NuverialSnackBarRef(_matSnackBarRef);

    return this._nuverialSnackBarRef;
  }
}
