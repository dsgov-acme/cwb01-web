import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormRendererService, FormTransactionConfirmationComponent } from '@dsg/shared/feature/form-nuv';
import { INuverialBreadCrumb, NuverialBreadcrumbComponent, TitleService } from '@dsg/shared/ui/nuverial';
import { of, switchMap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormTransactionConfirmationComponent, NuverialBreadcrumbComponent],
  selector: 'dsg-confirmation',
  standalone: true,
  styleUrls: ['./confirmation.component.scss'],
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  public breadCrumbs: INuverialBreadCrumb[] = [{ label: 'Dashboard', navigationPath: '/dashboard' }];
  public externalTransactionId$ = this._formRendererService.transaction$.pipe(
    switchMap(transactionModel => {
      return of(transactionModel.externalId);
    }),
  );

  constructor(private readonly _formRendererService: FormRendererService, private readonly _titleService: TitleService) {}

  public ngOnInit(): void {
    this._titleService.setHtmlTitle(`${this._formRendererService.transaction.transactionDefinitionName} - Application Submitted`);
  }

  public ngOnDestroy(): void {
    this._titleService.resetHtmlTitle();
  }
}
