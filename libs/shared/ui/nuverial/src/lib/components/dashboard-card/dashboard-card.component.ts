import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NuverialIconComponent } from '../icon';
import { ITag, NuverialTagComponent } from '../tag';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NuverialIconComponent, CommonModule, NuverialTagComponent],
  selector: 'nuverial-dashboard-card',
  standalone: true,
  styleUrls: ['./dashboard-card.component.scss'],
  templateUrl: './dashboard-card.component.html',
})
export class NuverialDashboardCardComponent {
  /**
   * Card Icon (Material Icon Name)
   */
  @Input() public icon?: string;

  /**
   * Card Title / Name
   */
  @Input() public name!: string;

  /**
   * Card description
   */
  @Input() public description?: string;

  /**
   * Card Route
   */
  @Input() public route!: string;

  /**
   * Card Tooltip
   */
  @Input() public tooltip?: string;

  /**
   * Card Chips
   */
  @Input() public tags?: ITag[];

  public trackByFn(index: number): number {
    return index;
  }
}
