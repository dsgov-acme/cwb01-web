import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon/icon.component';

export interface AlertModalData {
  icon: string;
  title: string;
  body: string;
  dismissalButtonLabel?: string;
}

/**
 * Generic and configurable modal, it consists of a modal with a title and optionally an icon, body text 
 * and a button with configurable text
 * 
 ## Usage
 *
 * ```
 * const dialogConfig = new MatDialogConfig();
 *  dialogConfig.autoFocus = false;
 *  dialogConfig.data = {
 *    body: this.props.modalBody,
 *    dismissalButtonLabel: this.props.dismissalButtonLabel,
 *    icon: this.props.modalIcon,
 *    title: this.props.modalTitle,
 *   };
 *  this._dialog.open(AlertModalComponent, dialogConfig).afterClosed().subscribe();
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, NuverialButtonComponent, NuverialIconComponent],
  selector: 'nuverial-alert-modal',
  standalone: true,
  styleUrls: ['./alert-modal.component.scss'],
  templateUrl: './alert-modal.component.html',
})
export class AlertModalComponent {
  public icon = '';
  public title = '';
  public body = '';
  public dismissalButtonLabel = '';

  constructor(public dialog: MatDialogRef<AlertModalComponent>, @Inject(MAT_DIALOG_DATA) public data: AlertModalData) {
    this.icon = data.icon;
    this.title = data.title;
    this.body = data.body;
    this.dismissalButtonLabel = data.dismissalButtonLabel ?? 'Close';
  }

  public close(): void {
    this.dialog.close();
  }
}
