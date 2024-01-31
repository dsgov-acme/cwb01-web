import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';

export enum ConfirmationModalReponses {
  PrimaryAction = 'primary',
  SecondaryAction = 'secondary',
  Cancel = 'cancel',
}

export interface ConfirmationModalData {
  title?: string;
  contentText: string;
  primaryAction: string;
  secondaryAction?: string;
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, NuverialButtonComponent, NuverialIconComponent],
  selector: 'nuverial-confirmation-modal',
  standalone: true,
  styleUrls: ['./confirmation-modal.component.scss'],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  public title?: string;
  public contentText = '';
  public primaryAction = '';
  public secondaryAction = 'Cancel';

  public confirmationModalResponses = ConfirmationModalReponses;

  constructor(public dialog: MatDialogRef<ConfirmationModalComponent>, @Inject(MAT_DIALOG_DATA) private readonly _data: ConfirmationModalData) {
    this.title = this._data?.title;
    this.contentText = this._data?.contentText;
    this.primaryAction = this._data?.primaryAction;
    this._data?.secondaryAction && (this.secondaryAction = this._data.secondaryAction);
  }
}
