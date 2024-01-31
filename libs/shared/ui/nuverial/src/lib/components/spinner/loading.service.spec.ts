import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { delay, filter, of, throwError } from 'rxjs';
import { NuverialSnackBarService } from '../snackbar/snackbar.service';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  let snackBarService: NuverialSnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(NuverialSnackBarService)],
    });

    service = TestBed.inject(LoadingService);
    snackBarService = TestBed.inject(NuverialSnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('withLoading', () => {
    it('should apply loading indicator and handle errors', fakeAsync(() => {
      const errorNotification = 'An error occurred';
      const successNotification = 'Operation completed successfully';
      const mockObservable = throwError(() => 'error');
      const handleErrorSpy = jest.spyOn(service as any, '_handleError').mockReturnValue(throwError(() => 'error'));
      jest.spyOn(snackBarService, 'notifyApplicationError');

      expect(service['_loading'].value).toBeFalsy();

      mockObservable.pipe(service.withLoading({ errorNotification, successNotification })).subscribe({
        complete: () => {
          expect(snackBarService.notifyApplicationError).toHaveBeenCalledWith(successNotification);
        },
        error: _error => {
          expect(handleErrorSpy).toHaveBeenCalledWith('error', errorNotification);
        },
        next: () => {
          expect(service['_loading'].value).toBeTruthy();
        },
      });

      tick(); // Advance the virtual clock

      expect(service['_loading'].value).toBeFalsy();
      expect(handleErrorSpy).toHaveBeenCalledWith('error', errorNotification);
    }));

    it('should apply loading indicator and handle success', fakeAsync(() => {
      const errorNotification = 'An error occurred';
      const successNotification = 'Operation completed successfully';
      const mockObservable = of('data');
      const handleErrorSpy = jest.spyOn(service as any, '_handleError').mockReturnValue(throwError(() => 'error'));
      jest.spyOn(snackBarService, 'notifyApplicationSuccess');

      expect(service['_loading'].value).toBeFalsy();

      mockObservable.pipe(service.withLoading({ errorNotification, successNotification })).subscribe({
        complete: () => {
          expect(snackBarService.notifyApplicationSuccess).toHaveBeenCalledWith(successNotification);
        },
        error: _error => {
          expect(handleErrorSpy).toHaveBeenCalledWith('error', errorNotification);
        },
        next: () => {
          expect(service['_loading'].value).toBeTruthy();
        },
      });

      tick(); // Advance the virtual clock

      expect(service['_loading'].value).toBeFalsy();
      expect(snackBarService.notifyApplicationSuccess).toHaveBeenCalledWith(successNotification);
    }));
    it('should not emit "startLoading" to subscribers', fakeAsync(() => {
      const source$ = of('startLoading', 'nextValue').pipe(filter(res => res !== 'startLoading'));

      const results: any[] = [];
      source$.subscribe(result => {
        results.push(result);
      });

      tick();

      expect(results).toEqual(['nextValue']);
    }));
  });

  describe('switchMapWithLoading', () => {
    it('should apply switchMap operator with loading behavior', fakeAsync(() => {
      const errorNotification = 'An error occurred';
      const successNotification = 'Operation completed successfully';
      const mockSourceObservable = of('source');
      const mockProjectedObservable = of('projected');
      const startWithSpy = jest.spyOn(service as any, '_startWith');
      jest.spyOn(snackBarService, 'notifyApplicationSuccess');

      expect(service['_loading'].value).toBeFalsy();

      mockSourceObservable.pipe(service.switchMapWithLoading(_ => mockProjectedObservable, { errorNotification, successNotification })).subscribe();

      tick(); // Advance the virtual clock

      expect(service['_loading'].value).toBeFalsy();
      expect(startWithSpy).toHaveBeenCalled();
    }));
  });

  describe('observableWithLoading$', () => {
    it('should wrap an observable with loading behavior', fakeAsync(() => {
      const mockObservable = of('data');
      const startWithSpy = jest.spyOn(service as any, '_startWith');

      service.observableWithLoading$(mockObservable).subscribe();

      tick();

      expect(startWithSpy).toHaveBeenCalled();
      expect(service['_loading'].value).toBeFalsy();
    }));
  });

  describe('_handleError', () => {
    it('should notify application error when errorNotification is true', () => {
      const error = 'An error occurred';
      const errorNotification = true;
      const notifyApplicationErrorSpy = jest.spyOn(snackBarService, 'notifyApplicationError');

      service['_handleError'](error, errorNotification).subscribe({
        error: _error => {
          expect(notifyApplicationErrorSpy).toHaveBeenCalled();
        },
      });
    });

    it('should notify application error with custom message when errorNotification is a string', () => {
      const error = 'An error occurred';
      const errorNotification = 'Custom error message';
      const notifyApplicationErrorSpy = jest.spyOn(snackBarService, 'notifyApplicationError');

      service['_handleError'](error, errorNotification).subscribe({
        error: _error => {
          expect(notifyApplicationErrorSpy).toHaveBeenCalledWith(errorNotification);
        },
      });
    });

    it('should return the error as an observable', () => {
      const error = 'An error occurred';

      service['_handleError'](error).subscribe({
        error: _error => {
          expect(_error).toBe(error);
        },
      });
    });
  });

  describe('_handleSuccess', () => {
    it('should notify application success when successNotification is true', () => {
      const successNotification = true;
      const notifyApplicationSuccessSpy = jest.spyOn(snackBarService, 'notifyApplicationSuccess');

      service['_handleSuccess'](successNotification);

      expect(notifyApplicationSuccessSpy).toHaveBeenCalled();
    });

    it('should notify application success with custom message when successNotification is a string', () => {
      const successNotification = 'Custom success message';
      const notifyApplicationSuccessSpy = jest.spyOn(snackBarService, 'notifyApplicationSuccess');

      service['_handleSuccess'](successNotification);

      expect(notifyApplicationSuccessSpy).toHaveBeenCalledWith(successNotification);
    });

    it('should not notify application success when successNotification is falsy', () => {
      const successNotification = false;
      const notifyApplicationSuccessSpy = jest.spyOn(snackBarService, 'notifyApplicationSuccess');

      service['_handleSuccess'](successNotification);

      expect(notifyApplicationSuccessSpy).not.toHaveBeenCalled();
    });
  });
  describe('LoadingService Concurrent Operations', () => {
    it('should manage loading state correctly for concurrent operations', fakeAsync(() => {
      const fastOperation$ = of('fast result').pipe(
        delay(100),
        service.withLoading({ errorNotification: 'Error in fast operation', successNotification: 'Fast operation successful' }),
      );

      const slowOperation$ = of('slow result').pipe(
        delay(200),
        service.withLoading({ errorNotification: 'Error in slow operation', successNotification: 'Slow operation successful' }),
      );

      const loadingStates: any[] = [];
      service.loading$.subscribe(state => loadingStates.push(state));

      fastOperation$.subscribe();
      slowOperation$.subscribe();
      tick(100);
      expect(loadingStates).toEqual([true, true]);

      tick(100);
      expect(loadingStates).toEqual([true, true, false]);
    }));
  });
});
