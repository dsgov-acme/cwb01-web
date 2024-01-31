import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FOOTER_ACTIONS_OPEN_CLASS, INuverialMenuItem } from '../../models';
import { NuverialButtonComponent } from '../button';
import { NuverialMenuComponent } from '../menu';

export interface FooterAction {
  key: string;
  uiLabel: string;
  uiClass: 'Primary' | 'Secondary' | 'Adverse';
  buttonProps?: {
    style?: string;
    color?: string;
  };
}

/**
 * Nuverial Footer Actions Component
 *
 * The Footer Actions component provides a set of action buttons for the sticky footer
 * allowing users to perform common actions. The order of actions in the `footerActions` list
 * is important, as the component will automatically arrange them based on the number of actions:
 *
 * - If there are 3 buttons or less, they will be displayed from right to left in the footer.
 * - If there are 4 buttons or more, the first two buttons will be displayed from right to left,
 *   and the remaining buttons will be added to the menu action list, which can be accessed through
 *   the "..." button.
 *
 * ## Usage
 *
 * ```html
 *   <nuverial-footer-actions
 *           [buttonsDisabled]="false"
 *           [footerActions]="footerActionsList"
 *           (actionSelected)="onActionClick($event)">
 *   </nuverial-footer-actions>
 * ```
 *
 * - `[buttonsDisabled]`: Whether the buttons should be disabled.
 * - `[footerActions]`: An array of footer action objects specifying the actions to be displayed.
 * - `(actionSelected)`: An event emitted when an action button is clicked.
 *
 * Each `footerAction` object in the `footerActions` array should have the following properties:
 * - `key`: A unique identifier for the action.
 * - `uiLabel`: The label to display on the action button.
 * - `uiClass`: The class of the action button, which can be 'Primary', 'Secondary', or 'Adverse'.
 * - `buttonProps` (optional): Additional properties for styling the button, such as 'style' and 'color'.
 *
 * The component automatically styles the buttons based on the `uiClass` property.
 */
@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialButtonComponent, NuverialMenuComponent],
  selector: 'nuverial-footer-actions',
  standalone: true,
  styleUrls: ['./footer-actions.component.scss'],
  templateUrl: './footer-actions.component.html',
})
export class NuverialFooterActionsComponent implements OnDestroy {
  /**
   * Whether the button should be disabled.
   */
  @Input()
  public buttonsDisabled = false;

  /**
   * List of the footer actions
   */
  @Input()
  public set footerActions(actions: FooterAction[]) {
    this.buttonActionsList = [];
    this.menuActionsList = [];

    if (actions.length === 0) return;

    this._renderer.addClass(document.body, FOOTER_ACTIONS_OPEN_CLASS);

    if (actions.length <= 3) {
      this.buttonActionsList = this._applyButtonStylingToActions([...actions].reverse());
    } else {
      this.buttonActionsList = this._applyButtonStylingToActions(actions.slice(0, 2).reverse());
      this.menuActionsList = actions.slice(2).map(action => ({ disabled: false, key: action.key, label: action.uiLabel }));
    }
  }

  /**
   * Event emitter containing the string of the emitted action
   */
  @Output() public readonly actionSelected = new EventEmitter<string>();

  public buttonActionsList: FooterAction[] = [];
  public menuActionsList: INuverialMenuItem[] = [];

  constructor(private readonly _renderer: Renderer2) {}

  public onActionClick(event: string) {
    this.actionSelected.emit(event);
  }

  private _applyButtonStylingToActions(actions: FooterAction[]): FooterAction[] {
    return actions.map(action => {
      let buttonProps = {};

      switch (action.uiClass) {
        case 'Primary':
          buttonProps = { color: 'primary', style: 'filled' };
          break;
        case 'Secondary':
          buttonProps = { style: 'outlined' };
          break;
        case 'Adverse':
          buttonProps = { color: 'danger', style: 'outlined' };
          break;
      }

      return {
        ...action,
        buttonProps,
      };
    });
  }

  public trackByFn(index: number): number {
    return index;
  }

  public ngOnDestroy(): void {
    this._renderer.removeClass(document.body, FOOTER_ACTIONS_OPEN_CLASS);
  }
}
