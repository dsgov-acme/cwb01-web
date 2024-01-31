import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';
import { HttpBaseService } from '@dsg/shared/utils/http';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable } from 'rxjs';

/**
 * This service is only used to expose endpoints, no logic should go in this service
 */
@Injectable({
  providedIn: 'root',
})
export class PortalApiRoutesService extends HttpBaseService {
  constructor(
    protected override readonly _http: HttpClient,
    @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment,
    protected override readonly _loggingService: LoggingService,
  ) {
    super(_http, `${_environment.httpConfiguration.baseUrl}/portal/api`, _loggingService);
  }

  /**
   *
   * Provider SignOut
   */
  public postSignOut$(): Observable<void> {
    return this._handlePost$<void>(`/v1/signOut`, {});
  }
}
