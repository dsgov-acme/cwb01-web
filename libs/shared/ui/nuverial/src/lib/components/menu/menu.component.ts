import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { INuverialMenuItem } from '../../models';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon/icon.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatMenuModule, NuverialIconComponent, NuverialButtonComponent],
  selector: 'nuverial-menu',
  standalone: true,
  styleUrls: ['./menu.component.scss'],
  templateUrl: './menu.component.html',
})
export class NuverialMenuComponent {
  /**
   * Attached to the aria-label attribute of the host button. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel?: string;

  /**
   * Attached to the aria-label attribute of the host menu. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public menuAriaLabel?: string;
  /**
   * Menu aria described by
   */
  @Input() public ariaDescribedBy?: string;

  /**
   * Icon for the menu trigger button
   */
  @Input() public buttonIcon?: string;

  /**
   * List of menu items to render menu options and icons
   */
  @Input() public menuItemList?: INuverialMenuItem[];

  /**
   * Custom class to target the cdk overlay panel
   */
  @Input() public overlayPanelClass = '';

  /**
   * Event emitter containing the string of the emitted menu item
   */
  @Output() public readonly menuItemEvent = new EventEmitter<string>();

  public trackByFn(index: number, _item: INuverialMenuItem) {
    return index;
  }

  public onMenuClick(item: string) {
    this.menuItemEvent.emit(item);
  }
}
