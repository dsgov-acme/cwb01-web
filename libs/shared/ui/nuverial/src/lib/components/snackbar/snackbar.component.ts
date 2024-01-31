import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { INuverialSnackBarAction } from '../../models';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';
import { INuverialSnackBarComponentOptions } from './snackbar.models';

/**
 * ###NuverialSnackBarService
 * Is a service for displaying Snackbars.
 *
 * ####Opening
 * The services provides two open methods the first covers the majority of use case the second allows
 * the passing of a configuration object
 *
 * ```
 * import { NuverialButtonComponent, NuverialSnackBarService, NuverialSnackBarType } from '@dsg/shared/ui/nuverial';
 *
 * let nuverialSnackBarRef = nuverialSnackBarService.open('success', 'title', 'message', duration, dismissible);
 *
 * let nuverialSnackBarRef = nuverialSnackBarService.openConfigured({
 *    ariaLabelDismiss: 'Close SnackBar',
 *    dismissible: true,
 *    horizontalPosition?: MatSnackBarHorizontalPosition,
 *    message: 'message,
 *    nuverialActions: [{
 *      ariaLabel: 'label',
 *      buttonStyle: 'outlined',
 *      colorTheme: 'primary',
 *      context: 'action1',
 *      label: 'action 1',
 *    }],
 *    title: 'Title Message',
 *    type: 'success'
 *    verticalPosition?: MatSnackBarVerticalPosition;
 *  });
 * ```
 *
 * ###NuverialSnackBar component
 * The SnackBar component displays title, message and options action buttons. It may be close after a specified duration
 * of be dismissed by clicking on an action button or a dismiss icon.
 *
 * ###NuverialSnackBarService
 * Controls the opening of a SnackBar return an instance of NuverialSnackBarRef
 *
 * ###NuverialSnackBarRef
 * Returned the NuverialSnackBarService allowing subscription to open and close events
 *
 *
 * Emits an event with an action context if a SnackBar closed using an optional action
 *
 * ```
 * public action(): Observable<unknown>
 * ```
 *
 * Emits and event if the Snackbar is closed by clicking the dismiss icon
 *
 * ```
 * public closed(): Observable<void>
 * ```
 *
 * Emits and event when the Snackbar opened
 *
 * ```
 * public afterOpened(): Observable<void>
 * ```
 *
 * ###Accessibility
 * NuverialSnackBarService announces messages via an aria-live region using configurable setting that defaults to polite
 * setting by default.
 *
 * Avoid setting a duration for snackbars that have an action available, as screen reader users may want to navigate to
 * the snackbar element to activate the action.
 *
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatSnackBarModule, NuverialButtonComponent, NuverialIconComponent],
  selector: 'nuverial-snack-bar',
  standalone: true,
  styleUrls: ['./snackbar.component.scss'],
  templateUrl: './snackbar.component.html',
})
export class NuverialSnackbarComponent {
  private readonly _action: Subject<unknown> = new Subject<unknown>();
  private readonly _closed: Subject<void> = new Subject<void>();

  public get iconName(): string {
    switch (this.nuverialSnackBarConfiguration.type) {
      case 'error':
        return 'error_outline';
      case 'success':
        return 'done';
      case 'warn':
        return 'warning_outline';
    }
  }

  /**
   * Action event emits action context when action element clicked
   * @ignore
   */
  public action$: Observable<unknown> = this._action.asObservable();

  /**
   * Closed event emitted on action or dismiss click event
   * @ignore
   */
  public closed$: Observable<void> = this._closed.asObservable();

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public nuverialSnackBarConfiguration: INuverialSnackBarComponentOptions,
  ) {}

  public trackByAction(index: number, _action: INuverialSnackBarAction) {
    return index;
  }

  public onActionClick(context: unknown): void {
    this._action.next(context);
  }

  public onClosedClick(): void {
    this._closed.next();
  }
}
