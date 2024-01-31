import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

/**
 * A Nuverial radio button component
 *
 * ## Usage
 *
 * ```
 *   import { NuverialRadioButtonComponent } from '@dsg/shared/ui/nuverial';
 *
 *   <nuverial-radio-button
 *                 [checked]=""
 *                 (click)="onClickEvent($event)"></nuverial-radio-button>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatRadioModule],
  selector: 'nuverial-radio-button',
  standalone: true,
  styleUrls: ['./radio-button.component.scss'],
  templateUrl: './radio-button.component.html',
})
export class NuverialRadioButtonComponent {
  /**
   * Button's event emitter for click events
   */
  @Output() public readonly click = new EventEmitter<Event>();

  /**
   * Input property for the checked state of the radio button
   */
  @Input() public checked = false;

  public onClick(event: Event) {
    event.stopPropagation();
    this.click.emit(event);
  }
}
