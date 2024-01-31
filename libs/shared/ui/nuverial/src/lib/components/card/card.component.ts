import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NuverialIconComponent } from '../icon';

/***
 *
 * Basic card component that display's title, content and footer elements
 *
 *
 * ## Usage
 *
 * ```
 * import { NuverialComponent } from '@dsg/shared/ui/nuverial';
 * import { NuverialCardContentDirective } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-card>
 *  <div nuverialCardContentType="title">{{cardTitle}}</div>
 *  <div nuverialCardContentType="content">{{cardContent}}</div>
 *  <div nuverialCardContentType="footer">{{cardFooter}}</div>
 * </nuverial-card>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatFormFieldModule, NuverialIconComponent],
  selector: 'nuverial-card',
  standalone: true,
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
})
export class NuverialCardComponent {
  @HostBinding('class.nuverial-card') public componentClass = true;
}
