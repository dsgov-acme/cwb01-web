import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NuverialDividerComponent } from '../divider/divider.component';

/***
 *
 * Basic section header component that display's label and divider
 *
 * ## Usage
 *
 * ```
 * import { NuverialComponent } from '@dsg/shared/ui/nuverial';
 * import { NuverialCardContentDirective } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-section-header>
 *  <div nuverialContentType="label">{{headerLabel}}</div>
 * </nuverial-section-header>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatFormFieldModule, NuverialDividerComponent],
  selector: 'nuverial-section-header',
  standalone: true,
  styleUrls: ['./section-header.component.scss'],
  templateUrl: './section-header.component.html',
})
export class NuverialSectionHeaderComponent {}
