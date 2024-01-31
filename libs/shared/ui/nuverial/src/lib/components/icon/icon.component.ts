import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

/***
 * Displays a named icon from the [Google Fonts Material Icon library](https://fonts.google.com/icons)
 *
 * ## Usage
 *
 * ```
 * import { NuverialIconComponent } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-icon [ariaHidden]="true" iconName="error_outline"></nuverial-icon>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  selector: 'nuverial-icon',
  standalone: true,
  styleUrls: ['./icon.component.scss'],
  templateUrl: './icon.component.html',
})
export class NuverialIconComponent {
  @Input() public ariaHidden = true;
  @Input() public iconName?: string;
  @Input() public outlined?: boolean;
  @Input() public tooltip = '';
  @Input() public tooltipDirection: TooltipPosition = 'below';

  @HostBinding('class.nuverial-icon') public componentClass = true;

  public get isOutlined(): boolean {
    return this.outlined || (this.iconName && this.iconName.endsWith('outline')) || false;
  }
}
