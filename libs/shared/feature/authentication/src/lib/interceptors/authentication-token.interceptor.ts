import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable()
export class AuthenticationTokenInterceptor implements HttpInterceptor {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this._authenticationService.userToken$.pipe(
      take(1),
      switchMap(token => (token !== null ? next.handle(req.clone({ setHeaders: { ['Authorization']: `Bearer ${token}` } })) : next.handle(req))),
    );
  }
}
