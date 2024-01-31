import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  pipe,
  startWith,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { NuverialSnackBarService } from '../snackbar/snackbar.service';

interface ILoadingOperator {
  errorNotification?: boolean | string;
  successNotification?: boolean | string;
}
const startLoading = 'startLoading';
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _loadingMap: Map<string, unknown> = new Map();
  private readonly _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this._loadingMap.size);

  /**
   * Observable that emits a boolean value indicating whether the loading state is active or not.
   */
  public loading$: Observable<boolean> = this._loading.asObservable();

  constructor(private readonly _nuverialSnackBarService: NuverialSnackBarService) {}

  /**
   * Applies a loading indicator to an observable stream, with optional error notification.
   *
   * Note: This operator is intended for simpler streams that do not require a switchMap operator, if using switchMap prefer switchMapWithLoading.
   *
   * ```ts
   *  Observable.pipe(withLoading(Observable, options))
   * ```
   *
   * @param options - The options for the loading operator.
   * @param options.errorNotification - Whether to show an error notification. Defaults to true.
   * @param options.successNotification A boolean or a string that indicates whether to show a success notification.
   * @returns A MonoTypeOperatorFunction that applies the loading indicator and handles errors.
   */
  public withLoading<T>(
    { errorNotification, successNotification }: ILoadingOperator = { errorNotification: true, successNotification: false },
  ): MonoTypeOperatorFunction<T> {
    const id = uuidv4();

    return pipe(
      tap(_ => this._handleSuccess(successNotification)),
      catchError(error => this._handleError(error, errorNotification)),
      startWith(this._startWith(id)),
      filter(res => res !== startLoading),
      finalize(() => this._finalize(id)),
    );
  }

  /**
   * Applies a switchMap operator to an observable source with loading behavior.
   *
   * ```ts
   *  Observable.pipe(switchMapWithLoading(Observable, options))
   * ```
   *
   * @template T The type of the source observable.
   * @template R The type of the projected observable.
   * @param projection$ A function that projects each value emitted by the source observable into an observable.
   * @param options An optional object that specifies the loading handling behavior.
   * @param options.errorNotification A boolean or a string that indicates whether to show an error notification.
   * @param options.successNotification A boolean or a string that indicates whether to show a success notification.
   * @returns An operator function that applies the switchMap operator with loading handling.
   */
  public switchMapWithLoading<T, R>(
    projection$: (value: T, index: number) => Observable<R>,
    { errorNotification, successNotification }: ILoadingOperator = { errorNotification: true, successNotification: false },
  ): OperatorFunction<T, R> {
    return (source: Observable<T>) =>
      source.pipe(switchMap((value, index) => projection$(value, index).pipe(this.withLoading({ errorNotification, successNotification }))));
  }

  /**
   * Wraps an observable with loading behavior.
   *
   * ```ts
   *  observableWithLoading$(Observable, options)
   * ```
   * @template T The type of the observable value.
   * @param {Observable<T>} observable$ The observable to wrap.
   * @param {ILoadingOperator} options The loading options.
   * @param {boolean} options.errorNotification Whether to show error notifications. Default is true.
   * @param {boolean} options.successNotification Whether to show success notifications. Default is false.
   * @returns {Observable<T>} The wrapped observable.
   */
  public observableWithLoading$<T>(
    observable$: Observable<T>,
    { errorNotification, successNotification }: ILoadingOperator = { errorNotification: true, successNotification: false },
  ): Observable<T> {
    return observable$.pipe(take(1), this.withLoading({ errorNotification, successNotification }));
  }

  private _startWith(id: string) {
    this._loadingMap.set(id, undefined);
    this._loading.next(!!this._loadingMap.size);

    return startLoading;
  }

  private _finalize(id: string) {
    this._loadingMap.delete(id);
    this._loading.next(!!this._loadingMap.size);
  }

  private _handleError<T>(error: T, errorNotification?: boolean | string): Observable<T> {
    if (errorNotification) {
      typeof errorNotification === 'boolean'
        ? this._nuverialSnackBarService.notifyApplicationError()
        : this._nuverialSnackBarService.notifyApplicationError(errorNotification);
    }

    return throwError(() => error);
  }

  private _handleSuccess(successNotification?: boolean | string): void {
    if (successNotification) {
      typeof successNotification === 'boolean'
        ? this._nuverialSnackBarService.notifyApplicationSuccess()
        : this._nuverialSnackBarService.notifyApplicationSuccess(successNotification);
    }
  }
}
