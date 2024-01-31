import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventsLogComponent } from '@dsg/shared/feature/events';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EventsLogComponent],
  selector: 'dsg-transaction-events',
  standalone: true,
  styleUrls: ['./transaction-events.component.scss'],
  templateUrl: './transaction-events.component.html',
})
export class TransactionEventsComponent {}
