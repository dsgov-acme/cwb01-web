import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { INuverialPanel } from '../../models';
import { NuverialIconComponent } from '../icon';

interface BodyTemplateContext {
  $implicit: INuverialPanel;
}

/**
 * Nuverial accordion component
 *
 * The Accordion component supports either text content in each panel or html through content projection.
 *
 * ## Usage
 *
 * ```
 *   import { NuverialAccordion } from '@dsg/shared/ui/nuverial';
 *
 *   <nuverial-accordion
 *           panelList="[]"
 *           [multiExpansion]="false"
 *          ></nuverial-accordion>
 *
 *   <nuverial-accordion
 *           panelList="[]"
 *           [multiExpansion]="true"
 *          >
 *      <ng-template let-panel #body>
 *         <div>
 *           <nuverial-section-header>
 *              {{panel.panelTitle}}
 *           </nuverial-section-header>
 *           <nuverial-button buttonStyle="outlined" ariaLabel="testing"
 *            colorTheme="primary">
 *              Primary
 *           </nuverial-button>
 *           <nuverial-footer>{{ firstAccordion.footer }}</nuverial-footer>
 *         </div>
 *      </ng-template>
 *   </nuverial-accordion>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatExpansionModule, NuverialIconComponent],
  selector: 'nuverial-accordion',
  standalone: true,
  styleUrls: ['./accordion.component.scss'],
  templateUrl: './accordion.component.html',
})
export class NuverialAccordionComponent {
  /**
   * Determines whether or not multiple panels can be expanded at the same time. Default value is one at a time.
   */
  @Input() public multiExpansion? = false;
  /**
   * Menu aria described by
   */
  @Input() public ariaDescribedBy?: string;
  /**
   * The prefix icon name
   */
  @Input() public prefixIconName?: string;
  /**
   * The suffix header text shown when the accordion is open
   */
  @Input() public openSuffixHeaderText?: string;
  /**
   * The suffix header text shown when the accordion is closed
   */
  @Input() public closeSuffixHeaderText?: string;
  /**
   * The warning header text shown next to the accordion in the header
   */
  @Input() public warningHeaderText?: string;
  /**
   * List of menu items to render menu options and icons
   */
  @Input() public panelList?: INuverialPanel[];
  /**
   * Content child used to project the body of the panel when expanded
   */
  @ContentChild('body', { static: false }) public bodyTemplateRef?: TemplateRef<BodyTemplateContext>;

  public isOpen = false;

  public onOpened() {
    this.isOpen = true;
  }

  public onClosed() {
    this.isOpen = false;
  }

  public trackByFn(index: number, _item: INuverialPanel) {
    return index;
  }
}
