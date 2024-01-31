import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';
import { INuverialSelectOption } from '../select/select.models';
/**
 * A Button with a selector dropdown component
 *
 * ## Normal Usage (Text Label Menu)
 *
 * ```
 *   <nuverial-selector-button-dropdown
 *       [maxHeight]="400"
 *       [menuItems]="selectOption"
 *       (buttonClickedEvent)="createNewTransaction($event)"
 *       buttonText="New Application">
 *   </nuverial-selector-button-dropdown>
 * ```
 *
 *  ## Content Projection Usage (Custom Menu)
 *
 *  ### HTML and TS
 *
 * ```
 *   import { MatMenuModule } from '@angular/material/menu';  // and import it in your module
 *
 *   <nuverial-selector-button-dropdown  // do not specify menuItems
 *       buttonText="New Application"
 *       [maxHeight]="400"
 *   >
 *       <button
 *           *ngFor="let item of selectOption; trackBy: trackByFn"
 *           (click)="createNewTransaction(item)"
 *           mat-menu-item  // this is required for each menu item
 *           type="submit"
 *       >
 *           <ng-container> ... </ng-container>
 *       </button>
 *   </nuverial-selector-button-dropdown>
 * ```
 *
 *  ### Styling
 *
 * ```
 *   ::ng-deep .mat-mdc-menu-content {
 *        // your styles here for content
 *   }
 * ```
 * *
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatMenuModule, NuverialButtonComponent, NuverialIconComponent],
  selector: 'nuverial-selector-button-dropdown',
  standalone: true,
  styleUrls: ['./selector-button-dropdown.component.scss'],
  templateUrl: './selector-button-dropdown.component.html',
})
export class NuverialSelectorButtonDropdownComponent {
  /**
   * Input of a string, the text that will be displayed on the button
   */
  @Input() public buttonText!: string;
  /**
   * Input of INuverialSelectOption objects, the displayTextValue key will be displayed in a item inside the menu
   */
  @Input() public menuItems?: INuverialSelectOption[];
  /**
   * Dropdown Icon (Material Icon Name)
   */
  @Input() public icon?: string;
  /**
   * Input of a number, the max height of the dropdown menu
   */
  @Input() public maxHeight?: number;
  /**
   * Click event on selecting a dropdown item which will emit the key of the selected item
   */
  @Output() public readonly buttonClickedEvent: EventEmitter<INuverialSelectOption> = new EventEmitter<INuverialSelectOption>();

  public selectItem(item: INuverialSelectOption): void {
    this.buttonClickedEvent.emit(item);
  }

  public trackByFn(index: number): number {
    return index;
  }

  public onMenuOpened(): void {
    if (this.maxHeight) {
      const panel = document.querySelector('.mat-mdc-menu-panel') as HTMLElement;
      if (panel) {
        panel.style.maxHeight = `${this.maxHeight}px`;
      }
    }
  }
}
