import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { FormInputBaseDirective } from '../../common';
import { NuverialIconComponent } from '../icon';

/**
 * Copy Button is a component that displays a copy button that when clicked will copy the contents to the clipboard and display a tooltip
 *
 * ## Usage
 *
 * ```
 * import { NuverialCopyButtonComponent } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-copy-button copyText="'ABCDEFG'" tooltipText="You just copied 'ABCDEFG'" beforeTooltipText="Copy ABCDEFG" />
 *
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialIconComponent, MatTooltipModule],
  selector: 'nuverial-copy-button',
  standalone: true,
  styleUrls: ['./copy-button.component.scss'],
  templateUrl: './copy-button.component.html',
})
export class NuverialCopyButtonComponent extends FormInputBaseDirective {
  /**
   * Text that should be copied to the clipboard
   */
  @Input() public copyText!: string;
  /**
   * The text that should be displayed in a tooltip after the copy button is clicked
   */
  @Input() public tooltipText = 'Copied!';
  /**
   * The text that should be displayed in a tooltip before the copy button is clicked
   */
  @Input() public beforeCopyTooltipText = 'Copy to clipboard';

  @ViewChild('copyButtonTooltip') public copyButtonTooltip!: MatTooltip;

  public copy(): void {
    navigator.clipboard.writeText(this.copyText);
    this.copyButtonTooltip.disabled = false;
    this.copyButtonTooltip.show();
    setTimeout(() => {
      this.copyButtonTooltip.disabled = true;
    }, 2000);
  }
}
