import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IRendererFormConfigurationSchema, TransactionMockWithDocuments } from '@dsg/shared/data-access/work-api';
import { AgencyDetailsReviewRendererOptions, FormRendererComponent, FormRendererService, NuvalenceFormRendererOptions } from '@dsg/shared/feature/form-nuv';
import {
  INuverialTab,
  NuverialBreadcrumbComponent,
  NuverialIconComponent,
  NuverialSpinnerComponent,
  NuverialTabKeyDirective,
  NuverialTabsComponent,
} from '@dsg/shared/ui/nuverial';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, map, take } from 'rxjs';
import { DocumentsReviewComponent } from '../documents-review';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormRendererComponent,
    DocumentsReviewComponent,
    NuverialSpinnerComponent,
    NuverialBreadcrumbComponent,
    NuverialTabsComponent,
    NuverialIconComponent,
    NuverialTabKeyDirective,
  ],
  selector: 'dsg-review-form',
  standalone: true,
  styleUrls: ['./review-form.component.scss'],
  templateUrl: './review-form.component.html',
})
export class ReviewFormComponent implements OnInit {
  public transactionMock = TransactionMockWithDocuments;

  public rendererOptions: NuvalenceFormRendererOptions = AgencyDetailsReviewRendererOptions;

  public formRendererConfiguration$?: Observable<IRendererFormConfigurationSchema[]> = this._formRendererService.formConfiguration$.pipe(
    map(formConfigurationModel => formConfigurationModel?.toReviewForm()),
  );

  public tabs: INuverialTab[] = [
    { key: 'claimantInformation', label: 'Claimant Information' },
    { key: 'documents', label: 'Documents' },
  ];

  constructor(private readonly _formRendererService: FormRendererService, private readonly _transactionDetailService: TransactionDetailService) {}

  public ngOnInit() {
    this._transactionDetailService.storeCustomerDocuments$().pipe(take(1)).subscribe();
  }
}
