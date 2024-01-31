import { MatSnackBarRef } from '@angular/material/snack-bar';
import { merge, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { NuverialSnackbarComponent } from './snackbar.component';

/**
 * SnackBar Reference
 */

export class NuverialSnackBarRef {
  constructor(protected _matSnackBarRef: MatSnackBarRef<NuverialSnackbarComponent>) {
    merge(this._matSnackBarRef.instance.closed$, this._matSnackBarRef.instance.action$)
      .pipe(
        take(1),
        tap(_event => {
          this._matSnackBarRef.dismiss();
        }),
      )
      .subscribe();
  }

  public action(): Observable<unknown> {
    return this._matSnackBarRef.instance.action$;
  }

  public closed(): Observable<void> {
    return this._matSnackBarRef.instance.closed$;
  }

  public afterOpened(): Observable<void> {
    return this._matSnackBarRef.afterOpened();
  }
}
