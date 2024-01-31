import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, tap } from 'rxjs';
import { ActiveTabChangeEvent, INavigableTab, NuverialTabsComponent } from '../tabs';

/***
 * Navigable tabs component that displays dynamic html content. Navigable tabs is a wrapper for
 * the tabs component that will automatically navigate to the correct route when a tab is clicked.
 *
 * ## Usage
 *
 * ```
 * import { NuverialNavigableTabsComponent } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-navigable-tabs [tabs]="tabs"></nuverial-navigable-tabs>
 * ```
 */
@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTabsComponent],
  selector: 'nuverial-navigable-tabs',
  standalone: true,
  styleUrls: ['./navigable-tabs.component.scss'],
  templateUrl: './navigable-tabs.component.html',
})
export class NuverialNavigableTabsComponent implements OnInit {
  /**
   * Tab aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel!: string;

  /**
   * Tab aria described by attribute. Default undefined
   */
  @Input() public ariaDescribedBy!: string;

  /**
   * Tab list orientation. Default orientation-vertical
   */
  @Input() public orientation = 'orientation-vertical';

  /**
   * List of tabs to be rendered in the component.
   */
  @Input() public tabs: INavigableTab[] = [];

  /**
   * Base route to navigate to when a tab is clicked. If not provided, the current route will be used.
   */
  @Input() public baseRoute = '';

  public activeTabIndex = 0;

  public ngOnInit(): void {
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this._setTabIndex();
        }),
        untilDestroyed(this),
      )
      .subscribe();
    this._setTabIndex();
  }

  private _setTabIndex() {
    let currentRoute = this._router.url;
    if (this.baseRoute && currentRoute.startsWith(this.baseRoute)) {
      currentRoute = currentRoute.replace(this.baseRoute, '');
    }
    this.activeTabIndex =
      this.tabs.findIndex(tab => currentRoute.startsWith(`/${tab.relativeRoute}`)) !== -1
        ? this.tabs.findIndex(tab => currentRoute.startsWith(`/${tab.relativeRoute}`))
        : 0;
    this._cdr.detectChanges();
  }

  constructor(private readonly _router: Router, private readonly _cdr: ChangeDetectorRef, private readonly _route: ActivatedRoute) {}

  public handleActiveTabChange(event: ActiveTabChangeEvent) {
    this._router.navigate([this.tabs[event.index].relativeRoute], { relativeTo: this._route });
  }
}
