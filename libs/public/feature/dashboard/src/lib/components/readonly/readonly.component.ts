import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IRendererFormConfigurationSchema } from '@dsg/shared/data-access/work-api';
import { FormRendererComponent, FormRendererService, NuvalenceFormRendererOptions, PublicPortalReviewRendererOptions } from '@dsg/shared/feature/form-nuv';
import {
  NuverialAccordionComponent,
  NuverialBreadcrumbComponent,
  NuverialButtonComponent,
  NuverialFooterComponent,
  NuverialIconComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  TitleService,
} from '@dsg/shared/ui/nuverial';
import { Observable, map, take, tap } from 'rxjs';

export enum StatusLabelColors {
  Black = 'status__label--black',
  Green = 'status__label--green',
  Red = 'status__label--red',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormRendererComponent,
    NuverialAccordionComponent,
    NuverialBreadcrumbComponent,
    NuverialSpinnerComponent,
    NuverialIconComponent,
    NuverialButtonComponent,
    NuverialFooterComponent,
  ],
  selector: 'dsg-readonly',
  standalone: true,
  styleUrls: ['./readonly.component.scss'],
  templateUrl: './readonly.component.html',
})
export class ReadonlyComponent implements OnInit, OnDestroy {
  public reviewRendererOptions: NuvalenceFormRendererOptions = PublicPortalReviewRendererOptions;
  public statusLabelColorClass = StatusLabelColors.Black;
  public externalTransactionId = '';

  public transaction$ = this._formRendererService.transaction$.pipe(
    tap(transactionModel => {
      !transactionModel && this._nuverialSnackBarService.notifyApplicationError();
    }),
    tap(transactionModel => {
      if (!transactionModel) return;

      const status = transactionModel.status;
      if (status === 'Approved') {
        this.statusLabelColorClass = StatusLabelColors.Green;
      } else if (status === 'Denied') {
        this.statusLabelColorClass = StatusLabelColors.Red;
      } else {
        this.statusLabelColorClass = StatusLabelColors.Black;
      }

      this.externalTransactionId = transactionModel.externalId;
    }),
  );

  public reviewFormFields$?: Observable<IRendererFormConfigurationSchema[]> = this._formRendererService.formConfiguration$.pipe(
    tap(formConfigurationModel => {
      !formConfigurationModel && this._nuverialSnackBarService.notifyApplicationError();
    }),
    map(formConfigurationModel => formConfigurationModel?.toReviewForm()),
  );

  public formData$?: Observable<Record<string, unknown>> = this.transaction$.pipe(
    map(transactionModel => transactionModel?.data as unknown as Record<string, unknown>),
  );

  constructor(
    private readonly _formRendererService: FormRendererService,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _titleService: TitleService,
  ) {}

  public ngOnInit(): void {
    this.transaction$
      .pipe(
        take(1),
        tap(transaction => this._titleService.setHtmlTitle(`${transaction?.transactionDefinitionName} - Review`)),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this._titleService.resetHtmlTitle();
  }
}
