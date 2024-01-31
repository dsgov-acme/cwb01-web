import { FocusMonitor } from '@angular/cdk/a11y';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Injector, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggingService } from '@dsg/shared/utils/logging';
import { filter } from 'rxjs/operators';
import { FormInputBaseDirective } from '../../common';
import { NuverialButtonComponent } from '../button';
import { NuverialFormFieldErrorComponent } from '../form-field-error';
import { NuverialIconComponent } from '../icon';

// Max length of text input according to WSC3
const MAX_MAXLENGTH = 524288;
const CONTEXT = 'NuverialTextAreaComponent';
/***
 * A Text Area Form component
 *
 * ## Usage
 *
 * ```
 * import { NuverialTextAreaComponent } from '@dsg/shared/ui/nuverial';
 *   <nuverial-text-area
 *     placeholder="Form Control Placeholder"
 *     [required]="true"
 *     [autoSize]="true"
 *     [(value)]="Some text"
 *     [autoSizeMinRows]="5"
 *     [autoSizeMaxRows]="20"
 *     [formControl]="inputTextFormControl"
 *     [validationMessages]="inputTextValidationMessages"
 *     (validationErrors)="onValidationErrors($event)"
 *   ></nuverial-text-area>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NuverialButtonComponent,
    NuverialFormFieldErrorComponent,
    NuverialIconComponent,
    TextFieldModule,
  ],
  selector: 'nuverial-text-area',
  standalone: true,
  styleUrls: ['./text-area.component.scss'],
  templateUrl: './text-area.component.html',
})
export class NuverialTextAreaComponent extends FormInputBaseDirective implements ControlValueAccessor, OnInit, OnDestroy {
  public useMaxLength = false;
  private _maxlength = MAX_MAXLENGTH;
  /**
   * Attached to the aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  private _ariaLabel?: string;
  /**
   * TextArea aria described by
   */
  @Input() public ariaDescribedBy?: string;
  /**
   * Allows for the ability to set the text value for the input component
   */
  public set value(value: string) {
    this._formValue = value;
  }
  public get value(): string {
    return this.formControl.value as string;
  }

  /**
   * Whether the control element is in an enabled/disabled state
   */
  @Input() public disabled = false;
  /**
   * TextArea display of validation errors and setting of error state in cards. Default value true
   */
  @Input() public displayError = true;
  /**
   * TextArea automatically resize a textarea to fit its content. Default value false
   */
  @Input() public autoSize = false;
  /**
   * TextArea The minimum number of rows to expand when using autoSize.
   */
  @Input() public autoSizeMinRows?: number;
  /**
   * TextArea The maximum number of rows to expand when using autoSize.
   */
  @Input() public autoSizeMaxRows?: number;
  /**
  /**
   * Hint text to be shown underneath the form field control
   */
  @Input() public hint?: string;
  /**
   * The floating label for the form input field
   */
  @Input() public label?: string;
  /**
   * The maximum allowed text length. If this property is set, a hit will be displayed showing the number of used/available characters
   */
  @Input() public set maxlength(len: number) {
    len > 0 && (this._maxlength = len);
    this.useMaxLength = this._maxlength !== MAX_MAXLENGTH;
  }
  public get maxlength(): number {
    return this._maxlength;
  }
  /**
   * The place holder text for the form input field
   */
  @Input() public placeholder!: string;
  /**
   * Whether the control element is in an required state
   */
  @Input() public required = false;
  /**
   * Number of rows to display on the text area. Default value 4
   */
  @Input() public rows = 4;

  @Input()
  public get ariaLabel(): string | undefined {
    return this._ariaLabel || this.label;
  }

  public set ariaLabel(value: string | undefined) {
    this._ariaLabel = value;
  }

  @ViewChild('formBaseInput', { static: true }) private readonly _inputElementRef!: ElementRef;

  constructor(
    protected readonly _focusMonitor: FocusMonitor,
    @Inject(Injector) protected override readonly _injector: Injector,
    @Self() @Optional() protected override readonly _ngControl: NgControl,
    protected _loggingService: LoggingService,
  ) {
    super();
    this._ngControl && (this._ngControl.valueAccessor = this);
  }

  public ngOnInit() {
    this.formControl = this._modelFormControl();
    this._initErrorHandler(this._focusMonitor.monitor(this._inputElementRef, true).pipe(filter(origin => origin === null)));

    !this.ariaLabel && this._loggingService.warn(CONTEXT, 'provide value for ariaLabel');
  }

  public ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._inputElementRef);
  }
}
