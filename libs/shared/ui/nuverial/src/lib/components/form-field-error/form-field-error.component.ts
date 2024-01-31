import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NuverialIconComponent } from '../icon';

/***
 *
 * Displays error message typically used in conjunction with components that require validation.
 *
 * FormFieldErrorComponent applies aria-live="polite" allowing assistive technologies to announce errors when they appear.
 *
 * ## Usage
 *
 * ```
 * import { NuverialFormFieldErrorComponent } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-form-field-error class="nuverial-form-field-icon-before">Error Message</nuverial-form-field-error>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatFormFieldModule, NuverialIconComponent],
  selector: 'nuverial-form-field-error',
  standalone: true,
  styleUrls: ['./form-field-error.component.scss'],
  templateUrl: './form-field-error.component.html',
})
export class NuverialFormFieldErrorComponent {}
