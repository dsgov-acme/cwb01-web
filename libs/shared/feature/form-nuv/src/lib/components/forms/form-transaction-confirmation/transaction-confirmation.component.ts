import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NuverialButtonComponent, NuverialIconComponent, NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSpinnerComponent, NuverialIconComponent, NuverialButtonComponent],
  selector: 'dsg-form-transaction-confirmation',
  standalone: true,
  styleUrls: ['./transaction-confirmation.component.scss'],
  templateUrl: './transaction-confirmation.component.html',
})
export class FormTransactionConfirmationComponent {
  @Input() public externalTransactionId = '';

  public navigateToTransactionsDashboard() {
    const currentUrl = this._router.url;
    const urlSplit = currentUrl.split('/');
    const dashboardUrl = urlSplit.slice(0, 3);
    this._router.navigate([dashboardUrl.join('/')]);
  }

  constructor(private readonly _router: Router) {}
}
