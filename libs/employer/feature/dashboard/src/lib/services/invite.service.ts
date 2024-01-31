import { Injectable } from '@angular/core';
import { IEmployerProfileInvite, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InviteService {
  constructor(private readonly _workApiRoutesService: WorkApiRoutesService) {}

  public inviteUserEmployerProfile$(profileId: string, email: string, accessLevel: string): Observable<IEmployerProfileInvite> {
    return this._workApiRoutesService.inviteUserEmployerProfile$(profileId, email, accessLevel);
  }

  public deleteEmployerProfileInvite$(profileId: string, inviteId: string): Observable<void> {
    return this._workApiRoutesService.deleteEmployerProfileInvite$(profileId, inviteId);
  }

  public resendInvite$(profileId: string, inviteId: string, email: string, accessLevel: string): Observable<IEmployerProfileInvite> {
    return this.deleteEmployerProfileInvite$(profileId, inviteId).pipe(switchMap(() => this.inviteUserEmployerProfile$(profileId, email, accessLevel)));
  }
}
