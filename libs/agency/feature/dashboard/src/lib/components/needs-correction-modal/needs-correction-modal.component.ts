import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICustomerProvidedDocument } from '@dsg/shared/data-access/work-api';
import {
  INuverialSelectOption,
  NuverialButtonComponent,
  NuverialIconComponent,
  NuverialSelectComponent,
  NuverialSnackBarService,
} from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, tap } from 'rxjs';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';

export interface RejectedReason {
  key: string;
  displayTextValue: string;
}

export interface NeedsCorrectionModalData {
  document: ICustomerProvidedDocument;
  transactionId: string;
  rejectedReasons: RejectedReason[];
}
@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, NuverialSelectComponent, NuverialButtonComponent, NuverialIconComponent],
  selector: 'dsg-needs-correction-modal',
  standalone: true,
  styleUrls: ['./needs-correction-modal.component.scss'],
  templateUrl: './needs-correction-modal.component.html',
})
export class NeedsCorrectionModalComponent implements OnInit {
  public formGroup = new FormGroup({});
  public selectedReasons: INuverialSelectOption[] = [];
  public rejectionReasonSelectOptions: INuverialSelectOption[] = [];

  public onCancel = new EventEmitter();

  public onCancelClick() {
    this.onCancel.emit();
  }

  constructor(
    public readonly transactionDetailService: TransactionDetailService,
    protected readonly _changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialogRef<NeedsCorrectionModalComponent>,
    protected readonly _nuverialSnackBarService: NuverialSnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: NeedsCorrectionModalData,
  ) {}

  public ngOnInit() {
    this.data.rejectedReasons.forEach(({ key, displayTextValue }) => {
      this.rejectionReasonSelectOptions.push({
        disabled: false,
        displayTextValue,
        key,
        selected: false,
      });
    });

    this.formGroup.addControl('rejectionReason', new FormControl({ disabled: false, value: undefined }));
    this.formGroup
      .get('rejectionReason')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        tap(value => {
          const selectedReason = this.rejectionReasonSelectOptions.find(reason => reason.key === value);
          const isReasonNotSelected = this.selectedReasons.filter(reason => selectedReason?.key === reason.key).length === 0;
          if (selectedReason && isReasonNotSelected) this.selectedReasons.push(selectedReason);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  public removeSelectedReason(reason: INuverialSelectOption) {
    const index = this.selectedReasons.indexOf(reason);
    if (index !== undefined && index >= 0) this.selectedReasons.splice(index, 1);
  }

  public saveNeedsCorrection() {
    const rejectedReasonKeys = this.selectedReasons.map(item => {
      return item.key;
    });

    this.dialog.close(rejectedReasonKeys);
  }

  public trackByFn(index: number) {
    return index;
  }
}
