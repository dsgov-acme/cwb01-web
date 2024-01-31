import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionModel } from '@dsg/shared/data-access/work-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'dsg-transaction-created',
  standalone: true,
  styleUrls: ['./transaction-created.component.scss'],
  templateUrl: './transaction-created.component.html',
})
export class TransactionCreatedComponent {
  @Input()
  public transaction?: TransactionModel;
}
