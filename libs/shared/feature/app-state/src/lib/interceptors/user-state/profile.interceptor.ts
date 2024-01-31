import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from '../../services';
@Injectable()
export class ProfileInterceptor implements HttpInterceptor {
  constructor(private readonly _userStateService: UserStateService) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentEmployerId = this._userStateService.getCurrentEmployerId();
    if (currentEmployerId) {
      const modifiedReq = req.clone({
        headers: req.headers.set('X-Application-Profile-ID', currentEmployerId),
      });

      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
