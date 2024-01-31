import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActiveTabChangeEvent, INuverialTab } from './tabs.model';

/***
 * Tabs component that displays dynamic html content. Tabs will be the input
 * and the nuverialTabKey should match a label name of what's in the tabs
 * object list.
 *
 * ## Usage
 *
 * ```
 * import { NuverialTabsComponent } from '@dsg/shared/ui/nuverial';
 * import { NuverialTabKeyDirective } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-tabs [tabs]="tabs">
 *  <ng-template nuverialTabKey="formly" let-form>
 *    <div>Formly Content</div>
 *    <button type="submit">Click</button>
 *  </ng-template>
 *  <ng-template nuverialTabKey="formio" let-form>
 *    <span>FormIO Content</span>
 *  </ng-template>
 * </nuverial-tabs>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTabsModule],
  selector: 'nuverial-tabs',
  standalone: true,
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
})
export class NuverialTabsComponent {
  /**
   * Tab aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel!: string;

  /**
   * Tab aria described by attribute. Default undefined
   */
  @Input() public ariaDescribedBy!: string;

  /**
   * Index of the active tab
   */
  @Input() public activeTabIndex = 0;

  /**
   * List of tabs to be rendered in the component.
   */
  @Input() public tabs: INuverialTab[] = [];

  /**
   * Emits the key of the active tab on change
   */
  @Output() public readonly activeTabChange: EventEmitter<ActiveTabChangeEvent> = new EventEmitter<ActiveTabChangeEvent>();

  /**
   * Emits the index of the active tab on change
   */
  @Output() public readonly activeTabIndexChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Assigns the template by a conditional comparison between the label
   * value associated with the template.
   */
  public addTemplate(key: string, template: TemplateRef<unknown>): void {
    this.tabs.forEach(tab => {
      if (tab.key === key) {
        tab.template = template;
      }
    });
  }

  public trackByFn(_index: number, _item: INuverialTab) {
    return _index;
  }

  public handleActiveTabChange(event: MatTabChangeEvent) {
    this.activeTabIndexChange.emit(event.index);
    this.activeTabChange.emit({
      index: event.index,
      tab: this.tabs[event.index],
    });
  }
}
