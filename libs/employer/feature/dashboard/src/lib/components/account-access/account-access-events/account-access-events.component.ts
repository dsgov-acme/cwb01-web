import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { IUserEmployerProfile } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { EventsLogComponent, EventsLogService } from '@dsg/shared/feature/events';
import { firstValueFrom, take } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EventsLogComponent],
  selector: 'dsg-account-access-events',
  standalone: true,
  styleUrls: ['./account-access-events.component.scss'],
  templateUrl: './account-access-events.component.html',
})
export class AccountAccessEventsComponent implements OnDestroy {
  constructor(private readonly _eventsLogService: EventsLogService, private readonly _userStateService: UserStateService) {
    this.getEmployer().then(result => {
      this._eventsLogService.initialize('employer', result.id);
    });
  }

  public async getEmployer(): Promise<IUserEmployerProfile> {
    const userProfiles: IUserEmployerProfile[] = await firstValueFrom(this._userStateService.getUserProfiles$().pipe(take(1)));
    const firstEmployerId = userProfiles[0];

    return firstEmployerId;
  }

  public ngOnDestroy(): void {
    this._eventsLogService.cleanUp();
  }
}
