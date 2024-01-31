import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { INuverialSelectOption, NuverialButtonComponent, NuverialIconComponent, NuverialSelectorButtonDropdownComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatMenuModule, NuverialSelectorButtonDropdownComponent, NuverialIconComponent, NuverialButtonComponent],
  selector: 'dsg-examples-selector-button-dropdown',
  standalone: true,
  styleUrls: ['./selector-button-dropdown.component.scss'],
  templateUrl: './selector-button-dropdown.component.html',
})
export class ExampleSelectorButtonDropdownComponent {
  public selectOption: INuverialSelectOption[] = [
    {
      disabled: false,
      displayTextValue: 'Financial Benefit',
      key: 'FinancialBenefit',
      selected: false,
    },
    {
      disabled: false,
      displayTextValue: 'Unemployment Insurance Proof',
      key: 'UnemploymentInsurance',
      selected: false,
    },
  ];

  public exampleNotificationsProjection = [{ label: 'Notification 1' }, { label: 'Notification 2' }, { label: 'Notification 3' }, { label: 'Notification 4' }];

  public trackByFn(index: number): number {
    return index;
  }
}
