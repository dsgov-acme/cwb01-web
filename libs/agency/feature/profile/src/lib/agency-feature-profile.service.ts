import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@dsg/shared/utils/http';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { AuthenticationService } from '@dsg/shared/feature/authentication';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgencyFeatureProfileService extends HttpBaseService {
  constructor(
    @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment,
    protected readonly _authenticationService: AuthenticationService,
    protected override readonly _http: HttpClient,
    protected override readonly _loggingService: LoggingService,
    protected readonly _userState: UserStateService,
  ) {
    super(_http, `${_environment.httpConfiguration.baseUrl}/um/api`, _loggingService);
  }

  public getProfile$(): Observable<UserModel | null> {
    return this._userState.user$;
  }
}
