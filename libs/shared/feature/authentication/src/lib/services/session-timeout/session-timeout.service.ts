import { Inject, Injectable, Optional } from '@angular/core';
import { IAuthenticationConfiguration } from '@dsg/shared/utils/environment';
import { filter, fromEvent, interval, map, merge, Observable, of, switchMap, tap, throttleTime } from 'rxjs';
import { ADAPTER_AUTHENTICATION } from '../../models';

const _sessionTimeoutServiceExpiration = 'sessionTimeoutServiceExpiration';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  protected readonly _idle$ = merge(
    of(''),
    fromEvent(document, 'DOMMouseScroll'),
    fromEvent(document, 'click'),
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'mousewheel'),
    fromEvent(document, 'touchmove'),
    fromEvent(window, 'keypress'),
    fromEvent(window, 'resize'),
    fromEvent(window, 'scroll'),
  ).pipe(
    throttleTime(1000),
    tap(_ => this._setExpiredTime()),
  );

  protected _timeOutMilliseconds = 0;

  constructor(@Optional() @Inject(ADAPTER_AUTHENTICATION) protected readonly _configuration: IAuthenticationConfiguration) {}

  /**
   * Start watching for idle when user is authenticated
   */
  public watchForIdle(): Observable<boolean> {
    if (!this._configuration?.sessionExpiration?.idleTimeSeconds) {
      return of(false);
    }

    this._timeOutMilliseconds = this._configuration.sessionExpiration?.idleTimeSeconds * 1000;
    // Return true if idle time is expired on load
    if (this._isIdleTimeExpired()) {
      return of(true);
    }

    return this._idle$.pipe(
      switchMap(() =>
        interval(1000).pipe(
          map(_ => this._isIdleTimeExpired()),
          filter(expired => expired),
        ),
      ),
    );
  }

  /**
   * Reset the storage on login
   */
  public reset(): void {
    localStorage.removeItem(_sessionTimeoutServiceExpiration);
  }

  private get _expiredTime(): number {
    return +(localStorage.getItem(_sessionTimeoutServiceExpiration) || Date.now());
  }

  private _setExpiredTime(): void {
    localStorage.setItem(_sessionTimeoutServiceExpiration, (Date.now() + this._timeOutMilliseconds).toString());
  }

  private _isIdleTimeExpired(): boolean {
    return this._expiredTime < Date.now();
  }
}
