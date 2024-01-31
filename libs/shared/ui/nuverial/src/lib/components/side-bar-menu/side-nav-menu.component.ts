import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { INuverialNavBarMenuItem } from '../../models';
import { NuverialIconComponent } from '../icon/icon.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialIconComponent, MatListModule, MatSidenavModule, MatTooltipModule, RouterModule],
  selector: 'nuverial-side-nav-menu',
  standalone: true,
  styleUrls: ['./side-nav-menu.component.scss'],
  templateUrl: './side-nav-menu.component.html',
})
export class NuverialSideNavMenuComponent {
  @HostBinding('class.nuverial-side-nav-menu') public componentClass = true;
  /**
   * List of side bar menu items to render on the side bar
   */
  @Input() public navBarMenuItemList?: INuverialNavBarMenuItem[];

  /**
   * List of side bar menu items to render on the side bar
   */
  @Input() public navBarMenuBottomItem?: INuverialNavBarMenuItem;

  /**
   * If it should include a return home menu item
   */
  @Input() public navBarReturnHome = false;

  /**
   * List of side bar menu items to render on the side bar
   */
  @Input() public theme: 'light' | 'dark' = 'light';

  /**
   * Position of the menu item tooltips
   */
  @Input() public tooltipPosition: 'above' | 'below' | 'left' | 'right' = 'right';

  constructor(private readonly _router: Router) {}

  public trackByFn(index: number, _item: INuverialNavBarMenuItem): number {
    return index;
  }

  public onMenuClick(navMenuItem: INuverialNavBarMenuItem) {
    if (navMenuItem.navigationSubRoute) {
      this._router.navigate([navMenuItem.navigationRoute + navMenuItem.navigationSubRoute]);
    }
  }
}
