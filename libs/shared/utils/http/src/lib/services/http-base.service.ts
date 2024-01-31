import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LoggingService } from '@dsg/shared/utils/logging';
import { catchError, Observable, throwError } from 'rxjs';

const CONTEXT = 'httpBaseService';

@Injectable()
export class HttpBaseService {
  constructor(
    protected readonly _http: HttpClient,
    @Inject('baseUrl') protected readonly _baseUrl: string,
    protected readonly _loggingService: LoggingService,
  ) {
    if (!_baseUrl) {
      throw new Error('Base Url not set');
    }
  }

  protected _handleGet$<T>(urlSubstring: string, options = {}): Observable<T> {
    return this._http.get<T>(`${this._baseUrl}${urlSubstring}`, options).pipe(catchError(error => this._handleError(error)));
  }

  protected _handlePost$<T>(urlSubstring: string, body = {}, options = {}): Observable<T> {
    return this._http.post<T>(`${this._baseUrl}${urlSubstring}`, body, options).pipe(catchError(error => this._handleError(error)));
  }

  protected _handlePut$<T>(urlSubstring: string, body = {}, options = {}): Observable<T> {
    return this._http.put<T>(`${this._baseUrl}${urlSubstring}`, body, options).pipe(catchError(error => this._handleError(error)));
  }

  protected _handleDelete$<T>(urlSubstring: string, options = {}): Observable<T> {
    return this._http.delete<T>(`${this._baseUrl}${urlSubstring}`, options).pipe(catchError(error => this._handleError(error)));
  }

  private _handleError(error: HttpErrorResponse): Observable<never> {
    this._loggingService.error(CONTEXT, '', error);

    return throwError(() => error);
  }
}
