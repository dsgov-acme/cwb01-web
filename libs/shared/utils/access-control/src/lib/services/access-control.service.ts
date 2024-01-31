import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';
import { HttpBaseService } from '@dsg/shared/utils/http';
import { LoggingService } from '@dsg/shared/utils/logging';
import { BehaviorSubject, debounceTime, finalize, last, map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Capabilities } from '../models/access-control.model';

@Injectable({
  providedIn: 'root',
})
export class AccessControlService extends HttpBaseService {
  public readonly initialLoaded$: Observable<boolean>;

  private readonly _capabilities: BehaviorSubject<Map<string, boolean>> = new BehaviorSubject<Map<string, boolean>>(new Map<string, boolean>());
  private readonly _initialLoaded = new ReplaySubject<boolean>(1);

  constructor(
    protected override readonly _http: HttpClient,
    @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment,
    protected override readonly _loggingService: LoggingService,
  ) {
    super(_http, `${_environment.httpConfiguration.baseUrl}`, _loggingService);
    this.initialLoaded$ = this._initialLoaded.asObservable();
  }

  /**
   * Initializes the AccessControlService.
   * This method loads and stores the capabilities state.
   */
  public initialize(): void {
    this._getCapabilities$().pipe(take(1)).subscribe();
  }

  public isAuthorized$(capability: Capabilities): Observable<boolean> {
    return this.initialLoaded$.pipe(
      last(),
      switchMap(() =>
        this._capabilities.pipe(
          debounceTime(100),
          map(capabilitiesMap => capabilitiesMap.get(capability) ?? false),
        ),
      ),
    );
  }

  /**
   * Cleans up the access control service by resetting the capabilities.
   */
  public cleanup(): void {
    this._capabilities.next(new Map<string, boolean>());
  }

  /**
   * Retrieves the capabilities as an observable array of strings.
   * @returns An observable that emits an array of strings representing the capabilities.
   */
  private _getCapabilities$(): Observable<string[]> {
    return this._handleGet$<string[]>(`/portal/api/v1/capabilities`).pipe(
      tap(capabilities => {
        const capabilitiesMap = new Map<string, boolean>();

        for (const capability of capabilities) {
          capabilitiesMap.set(capability, true);
        }

        this._capabilities.next(capabilitiesMap);
      }),
      finalize(() => {
        this._initialLoaded.next(true);
        this._initialLoaded.complete();
      }),
    );
  }
}
