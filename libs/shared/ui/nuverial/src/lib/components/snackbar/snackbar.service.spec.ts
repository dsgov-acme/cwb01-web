import { MatSnackBar } from '@angular/material/snack-bar';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { NuverialSnackbarComponent } from './snackbar.component';
import { NuverialSnackBarService } from './snackbar.service';

describe('NuverialSnackBarService', () => {
  let service: NuverialSnackBarService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    snackBar = MockService(MatSnackBar, {
      openFromComponent: jest.fn().mockImplementation(() => {
        return { instance: { closed: of(undefined) } };
      }),
    });
    service = new NuverialSnackBarService(snackBar);
  });

  it('should  initialized', () => {
    expect(service).toBeTruthy();
  });

  it('should open default values', () => {
    const spy = jest.spyOn(snackBar, 'openFromComponent');
    service.openConfigured({ type: 'success' });

    expect(spy).toHaveBeenCalledWith(NuverialSnackbarComponent, {
      data: { ariaLabelDismiss: 'Close snackbar', dismissible: true, type: 'success' },
      duration: 5000,
      horizontalPosition: 'left',
      panelClass: ['nuverial-snackbar-container', 'snackbar-success'],
      verticalPosition: 'bottom',
    });
  });

  it('should open all config', () => {
    const spy = jest.spyOn(snackBar, 'openFromComponent');
    service.openConfigured({ ariaLabelDismiss: 'Test close snackbar', duration: 100, type: 'warn' });

    expect(spy).toHaveBeenCalledWith(NuverialSnackbarComponent, {
      data: { ariaLabelDismiss: 'Test close snackbar', dismissible: true, duration: 100, type: 'warn' },
      duration: 100,
      horizontalPosition: 'left',
      panelClass: ['nuverial-snackbar-container', 'snackbar-warn'],
      verticalPosition: 'bottom',
    });
  });

  it('should open dismiss config', () => {
    const spy = jest.spyOn(snackBar, 'openFromComponent');
    service.openConfigured({ dismissible: false, type: 'warn' });

    expect(spy).toHaveBeenCalledWith(NuverialSnackbarComponent, {
      data: { ariaLabelDismiss: 'Close snackbar', dismissible: false, type: 'warn' },
      duration: 0,
      horizontalPosition: 'left',
      panelClass: ['nuverial-snackbar-container', 'snackbar-warn'],
      verticalPosition: 'bottom',
    });
  });

  it('should open with correct error configs when notifyApplicationError is called', () => {
    const spy = jest.spyOn(snackBar, 'openFromComponent');
    service.notifyApplicationError();

    expect(spy).toHaveBeenCalledWith(NuverialSnackbarComponent, {
      data: {
        ariaLabelDismiss: 'Close snackbar',
        dismissible: true,
        message: 'The application encountered an error',
        type: 'error',
        verticalPosition: 'bottom',
      },
      duration: 5000,
      horizontalPosition: 'left',
      panelClass: ['nuverial-snackbar-container', 'snackbar-error'],
      verticalPosition: 'bottom',
    });
  });

  it('should open with correct success configs when notifyApplicationSuccess is called', () => {
    const spy = jest.spyOn(snackBar, 'openFromComponent');
    service.notifyApplicationSuccess();

    expect(spy).toHaveBeenCalledWith(NuverialSnackbarComponent, {
      data: {
        ariaLabelDismiss: 'Close snackbar',
        dismissible: true,
        message: 'Changes saved successfully',
        type: 'success',
        verticalPosition: 'bottom',
      },
      duration: 5000,
      horizontalPosition: 'left',
      panelClass: ['nuverial-snackbar-container', 'snackbar-success'],
      verticalPosition: 'bottom',
    });
  });
});
