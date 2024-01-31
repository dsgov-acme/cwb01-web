import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { PROCESSING_RESULT_ID } from '@dsg/shared/data-access/document-api';
import { EnumMapType, ICustomerProvidedDocument, ICustomerProvidedDocumentGroup } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import { DocumentFormService, FormRendererComponent } from '@dsg/shared/feature/form-nuv';
import {
  INuverialSelectOption,
  NuverialAccordionComponent,
  NuverialBreadcrumbComponent,
  NuverialFileProcessorTooltipComponent,
  NuverialSelectComponent,
  NuverialSelectorButtonDropdownComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTabKeyDirective,
} from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, Observable, catchError, finalize, map, switchMap, take, tap } from 'rxjs';
import { NeedsCorrectionModalComponent, RejectedReason } from '../needs-correction-modal';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormRendererComponent,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    FormRendererComponent,
    MatDialogModule,
    NuverialSelectComponent,
    NuverialSpinnerComponent,
    NuverialBreadcrumbComponent,
    NuverialTabKeyDirective,
    NuverialFileProcessorTooltipComponent,
    NuverialSelectorButtonDropdownComponent,
    NuverialAccordionComponent,
  ],
  selector: 'dsg-documents-review',
  standalone: true,
  styleUrls: ['./documents-review.component.scss'],
  templateUrl: './documents-review.component.html',
})
export class DocumentsReviewComponent implements OnInit {
  public rejectedReasonsLabels: Record<string, string> = {};
  public loading = false;

  public processingId = PROCESSING_RESULT_ID;

  private readonly _transactionId = this._activatedRoute.parent?.snapshot.paramMap.get('transactionId') ?? '';

  public customerDocuments$: Observable<ICustomerProvidedDocumentGroup[]> = this._transactionDetailService.customerProvidedDocuments$;

  public reviewReasonsSelectOptions$: Observable<INuverialSelectOption[]> = this._enumService.getEnumMap$(EnumMapType.DocumentReviewStatuses).pipe(
    map(statuses => {
      const reviewStatusSelectOptions: INuverialSelectOption[] = [];
      for (const [key, value] of statuses.entries()) {
        reviewStatusSelectOptions.push({
          disabled: false,
          displayTextValue: value.label,
          key: key,
          selected: false,
        });
      }

      return reviewStatusSelectOptions;
    }),
  );

  constructor(
    private readonly _transactionDetailService: TransactionDetailService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _documentFormService: DocumentFormService,
    private readonly _enumService: EnumerationsStateService,
  ) {}

  public ngOnInit() {
    this._enumService
      .getEnumMap$(EnumMapType.DocumentRejectionReasons)
      .pipe(
        take(1),
        tap(reasons => {
          const result: Record<string, string> = {};
          for (const [key, value] of reasons.entries()) {
            result[key] = value.label;
          }

          this.rejectedReasonsLabels = result;
        }),
      )
      .subscribe();
  }

  public handleReviewStatus(selectedOption: INuverialSelectOption, document: ICustomerProvidedDocument): void {
    this.loading = true;
    const selectedKey = selectedOption.key;
    let dialogRef: MatDialogRef<NeedsCorrectionModalComponent> | undefined;
    switch (selectedKey) {
      case 'NEW':
      case 'PENDING':
      case 'ACCEPTED':
        this._handleUpdateDocument(document, selectedKey).subscribe();
        break;
      case 'REJECTED':
        this._transactionDetailService
          .getDocumentRejectionReasons$()
          .pipe(
            take(1),
            switchMap(reasons => {
              const rejectedReasons: RejectedReason[] = [];
              reasons.forEach((reason, id) => {
                rejectedReasons.push({
                  displayTextValue: reason.label,
                  key: id,
                });
              });
              dialogRef = this._dialog.open(NeedsCorrectionModalComponent, {
                autoFocus: false,
                data: { document: document, rejectedReasons: rejectedReasons, transactionId: this._transactionId },
                disableClose: true,
              });

              return dialogRef.afterClosed().pipe(take(1));
            }),
            switchMap(rejectedReasonKeys => {
              if (!rejectedReasonKeys) return EMPTY;

              return this._handleUpdateDocument(document, selectedKey, rejectedReasonKeys);
            }),
            finalize(() => {
              this.loading = false;
              this._changeDetectorRef.detectChanges();
            }),
            untilDestroyed(this),
          )
          .subscribe();
        dialogRef?.componentInstance.onCancel
          .pipe(
            take(1),
            finalize(() => {
              this.loading = false;
              this._changeDetectorRef.detectChanges();
            }),
          )
          .subscribe();
        break;
      default:
        this.loading = false;
    }
  }
  private _handleUpdateDocument(document: ICustomerProvidedDocument, reviewStatus: string, rejectionReasons?: string[]): Observable<ICustomerProvidedDocument> {
    return this._transactionDetailService
      .updateCustomerProvidedDocument(this._transactionId, document.id, {
        ...document,
        rejectionReasons,
        reviewStatus,
      })
      .pipe(
        catchError(_error => {
          this._nuverialSnackBarService.notifyApplicationError();

          return EMPTY;
        }),
        take(1),
        finalize(() => {
          this.loading = false;
          this._changeDetectorRef.detectChanges();
        }),
      );
  }

  public trackByFn(index: number) {
    return index;
  }

  public openDocument(id: string) {
    this._documentFormService
      .openDocument$(id)
      .pipe(
        take(1),
        catchError(error => {
          if (error.status < 200 || error.status >= 300) {
            this._nuverialSnackBarService.notifyApplicationError('Document information could not be retrieved.');
          }

          return EMPTY;
        }),
      )
      .subscribe();
  }
}
