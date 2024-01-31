import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * A Nuverial slide toggle component
 *
 * ## Usage
 *
 * ```
 *   import { NuverialSlideToggleComponent } from '@dsg/shared/ui/nuverial';
 *
 *   <nuverial-slide-toggle
 *                 [checked]=""
 *                 (change)="toggleChange()"></nuverial-slide-toggle>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatSlideToggleModule],
  selector: 'nuverial-slide-toggle',
  standalone: true,
  styleUrls: ['./slide-toggle.component.scss'],
  templateUrl: './slide-toggle.component.html',
})
export class NuverialSlideToggleComponent {
  /**
   * Input property for the checked state of the radio button
   */
  @Input() public checked = false;

  /**
   * Toggle's event emitter for toggle events
   */
  @Output() public readonly change = new EventEmitter();

  public onChange() {
    this.checked = !this.checked;
    this.change.emit();
  }
}
