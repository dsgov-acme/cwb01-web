import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormRendererService, FormTransactionConfirmationComponent } from '@dsg/shared/feature/form-nuv';
import { of, switchMap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormTransactionConfirmationComponent],
  selector: 'dsg-confirmation',
  standalone: true,
  styleUrls: ['./confirmation.component.scss'],
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent {
  public externalTransactionId$ = this._formRendererService.transaction$.pipe(
    switchMap(transactionModel => {
      return of(transactionModel.externalId);
    }),
  );

  constructor(private readonly _formRendererService: FormRendererService) {}
}
