import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon/icon.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, NuverialButtonComponent, NuverialIconComponent],
  selector: 'nuverial-alert-modal-view',
  standalone: true,
  styleUrls: ['./alert-modal.component.scss'],
  templateUrl: './alert-modal.component.html',
})
export class AlertModalViewComponent {
  @Input() public icon? = '';
  @Input() public title = '';
  @Input() public body? = '';
  @Input() public dismissalButtonLabel = '';
}
