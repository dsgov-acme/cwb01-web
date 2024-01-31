import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggingService } from '@dsg/shared/utils/logging';
import { NuverialColorThemeType } from '../../models';
import { NuverialButtonStyleType } from './button.models';

const CONTEXT = 'NuverialButtonComponent';

/**
 * Nuverial button component
 *
 * The Button component supports four button styles and may optionally display a loading indicator.
 *
 * ## Usage
 *
 * ```
 *   import { NuverialButton } from '@dsg/shared/ui/nuverial';
 *
 *   <nuverial-button
 *           ariaDescribedBy=""
 *           ariaLabel=""
 *           buttonStyle=""
 *           [disabled]=""
 *           colorTheme=""
 *           [loading]=""
 *           (click)="onClickEvent($event)">button label</nuverial-button>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  selector: 'nuverial-button',
  standalone: true,
  styleUrls: ['./button.component.scss'],
  templateUrl: './button.component.html',
})
export class NuverialButtonComponent implements OnInit {
  /**
   * Button's aria label
   */
  @Input() public ariaLabel = '';
  /**
   * Button's aria described by
   */
  @Input() public ariaDescribedBy = '';
  /**
   * Button's style filled, icon, outlined or text'
   */
  @Input() public buttonStyle: NuverialButtonStyleType = 'text';
  /**
   * Button's type e.g, button, submit or reset
   */
  @Input() public buttonType: 'button' | 'submit' | 'reset' = 'button';
  /**
   * Button's color theme e.g. primary or warn
   */
  @Input() public colorTheme: NuverialColorThemeType = '';
  /**
   * Button's state
   */
  @Input() public disabled = false;
  /**
   * Button's loading state, displays loading indicator if set
   */
  @Input() public loading = false;
  /**
   * Button's uppercase button label text
   */
  @Input() public uppercaseText = true;
  /**
   * Button's event emitter for click events
   */
  @Output() public readonly click = new EventEmitter<Event>();

  @HostBinding('class.nuverial-button') public componentClass = true;

  public nativeElement = this._elementRef.nativeElement;

  constructor(private readonly _elementRef: ElementRef, protected _loggingService: LoggingService) {}

  public ngOnInit() {
    !this.ariaLabel && this._loggingService.warn(CONTEXT, 'provide value for ariaLabel');
  }

  public onClick(event: Event) {
    event.stopPropagation();
    this.click.emit(event);
  }
}
