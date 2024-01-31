import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NuverialSafeHtmlPipe } from './../../../pipes/safe-html/safe-html.pipe';

/***
 * A rick text editor component
 *
 * ## Usage
 *
 * ```
 * import { NuverialRichTextViewerComponent } from '@dsg/shared/ui/nuverial';
 *   <nuverial-rich-text-viewer class="note-card-body" [content]="note.body"></nuverial-rich-text-viewer>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSafeHtmlPipe],
  selector: 'nuverial-rich-text-viewer',
  standalone: true,
  styleUrls: ['./rich-text-viewer.component.scss'],
  templateUrl: './rich-text-viewer.component.html',
})
export class NuverialRichTextViewerComponent {
  /**
   * The content to display, generally an HTML string
   */
  @Input() public content?: string;
}
