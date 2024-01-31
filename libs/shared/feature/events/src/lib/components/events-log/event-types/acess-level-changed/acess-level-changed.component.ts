import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AuditEventModel } from '@dsg/shared/data-access/audit-api';

export enum AccessLevelType {
  Admin = 'ADMIN',
  AgencyReadOnly = 'AGENCY_READONLY',
  Reader = 'READER',
  Writer = 'WRITER',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'dsg-acess-level-changed',
  standalone: true,
  styleUrls: ['./acess-level-changed.component.scss'],
  templateUrl: './acess-level-changed.component.html',
})
export class AcessLevelChangedComponent implements OnInit {
  @Input()
  public event?: AuditEventModel;

  public message = '';

  public accessLevelDescMap: Record<AccessLevelType, string> = {
    [AccessLevelType.Admin]: 'Admin',
    [AccessLevelType.AgencyReadOnly]: 'Agency Read-Only',
    [AccessLevelType.Reader]: 'Read-Only',
    [AccessLevelType.Writer]: 'Write',
  };

  public ngOnInit(): void {
    if (!this.event) return;
    this._handleAccessLevelChangedEvent(this.event);
  }

  private _handleAccessLevelChangedEvent(event: AuditEventModel) {
    const { oldState, newState } = event.eventData;
    if (oldState && newState) {
      const oldAccess = JSON.parse(oldState).accessLevel as keyof typeof this.accessLevelDescMap;
      const newAccess = JSON.parse(newState).accessLevel as keyof typeof this.accessLevelDescMap;
      this.message = `from '${this.accessLevelDescMap[oldAccess]}' to '${this.accessLevelDescMap[newAccess]}'`;
    }
  }
}
