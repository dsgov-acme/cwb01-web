import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AuditEventModel } from '@dsg/shared/data-access/audit-api';

interface NoteData {
  agentId: string;
  noteId: string;
  noteTitle: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'dsg-note-base-event',
  standalone: true,
  styleUrls: ['./note-base-event.component.scss'],
  templateUrl: './note-base-event.component.html',
})
export class NoteBaseEventComponent implements OnInit {
  @Input()
  public event?: AuditEventModel;

  public content = '';

  public ngOnInit(): void {
    if (!this.event) return;

    this._handleNoteBaseEventEvent(this.event);
  }

  private _handleNoteBaseEventEvent(event: AuditEventModel) {
    const { data } = event.eventData;

    if (data) {
      const { noteTitle }: NoteData = JSON.parse(data);
      this.content = noteTitle;
    }
  }
}
