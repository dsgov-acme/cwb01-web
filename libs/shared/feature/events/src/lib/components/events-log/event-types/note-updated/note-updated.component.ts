import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AuditEventModel } from '@dsg/shared/data-access/audit-api';

interface NoteState {
  body: string;
  title: string;
  type: string;
  lastUpdatedTimestamp: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'dsg-note-updated',
  standalone: true,
  styleUrls: ['./note-updated.component.scss'],
  templateUrl: './note-updated.component.html',
})
export class NoteUpdatedComponent implements OnInit {
  @Input()
  public event?: AuditEventModel;

  public title = '';
  public body = '';

  public ngOnInit(): void {
    if (!this.event) return;
    this._handleNoteUpdatedEvent(this.event);
  }

  private _handleNoteUpdatedEvent(event: AuditEventModel) {
    const { oldState, newState } = event.eventData;

    if (oldState && newState) {
      const newStateValues: NoteState = JSON.parse(newState);

      this.title = newStateValues.title ?? '';
      this.body = newStateValues.body ?? '';
    }
  }
}
