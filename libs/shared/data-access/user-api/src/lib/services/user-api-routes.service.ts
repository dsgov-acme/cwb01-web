import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from '@dsg/shared/utils/environment';
import { Filter, HttpBaseService, PagingRequestModel, PagingResponseModel } from '@dsg/shared/utils/http';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable, map } from 'rxjs';
import { IUser, IUserRole, IUsersPaginationResponse, UserModel } from '../models';
import { UserPreferencesModel } from '../models/preferences.model';

/**
 * This service is only used to expose endpoints, no logic should go in this service
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiRoutesService extends HttpBaseService {
  constructor(
    protected override readonly _http: HttpClient,
    @Inject(ENVIRONMENT_CONFIGURATION) protected readonly _environment: IEnvironment,
    protected override readonly _loggingService: LoggingService,
  ) {
    super(_http, `${_environment.httpConfiguration.baseUrl}/um/api`, _loggingService);
  }

  /**
   * Update the user details given the id and user object
   */
  public createUpdateProfile$(user: UserModel): Observable<UserModel> {
    return this._handlePut$<IUser>(`/v1/myself`, user.toSchema()).pipe(map(userModel => new UserModel(userModel)));
  }

  /**
   * Get the currentUser
   */
  public getUser$(): Observable<UserModel> {
    return this._handleGet$<IUser>(`/v1/myself`).pipe(map(user => new UserModel(user)));
  }

  /**
   * Get a user by id
   */
  public getUserById$(userId: string): Observable<UserModel> {
    return this._handleGet$<IUser>(`/v1/users/${userId}`).pipe(map(user => new UserModel(user)));
  }

  /**
   * Update user preferences
   */
  public createUpdateUserPreferences$(userId: string, prefs: UserPreferencesModel): Observable<void> {
    return this._handlePut$<void>(`/v1/users/${userId}/preferences`, prefs.toSchema());
  }

  /**
   * Get all users with an optional filter
   */
  public getUsers$(filters?: Filter[], pagingRequestModel?: PagingRequestModel): Observable<IUsersPaginationResponse<UserModel>> {
    let httpParams = new HttpParams();

    filters?.forEach(filter => {
      httpParams = httpParams.append(filter.field, filter.value);
    });

    return this._handleGet$<IUsersPaginationResponse<IUser>>(
      `/v1/users/${pagingRequestModel ? pagingRequestModel.toSchema() : ''}`,
      filters
        ? {
            params: httpParams,
          }
        : '',
    ).pipe(
      map(userSchema => ({
        pagingMetadata: new PagingResponseModel(userSchema.pagingMetadata),
        users: userSchema.users?.map((users: IUser) => new UserModel(users)),
      })),
    );
  }

  public getRoles$(): Observable<IUserRole[]> {
    return this._handleGet$<IUserRole[]>('/v1/roles');
  }
}
