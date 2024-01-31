import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

/**
 * DividerComponent component displays a line separator in vertical or horizontal orientations.
 *
 * ## Usage
 *
 * ```
 * import { DividerComponent } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-divider [vertical]="true"></nuverial-divider>
 * ```
 *
 * ### Accessibility
 * Applies the ARIA role="separator" attribute to the DividerComponent.
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nuverial-divider',
  standalone: true,
  styleUrls: ['./divider.component.scss'],
  template: ``,
})
export class NuverialDividerComponent {
  /**
   * DividerComponent component vertical orientation. Default false
   */
  @Input() public vertical = false;
  /**
   * Assigns the ARIA role attribute
   */
  @HostBinding('attr.role') public componentRole = 'separator';
  /**
   * Components CSS class name
   */
  @HostBinding('class.nuverial-divider') public componentClass = true;
  /**
   * Components CSS class vertical name
   */
  @HostBinding('class.nuverial-divider-vertical') public get verticalStyle() {
    return this.vertical;
  }
  /**
   * Assigns the ARIA orientation attribute
   */
  @HostBinding('attr.aria-orientation') public get ariaOrientation() {
    return this.vertical ? 'vertical' : 'horizontal';
  }
}
