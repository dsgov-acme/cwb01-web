import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { filter } from 'rxjs/operators';
import { FormInputBaseDirective } from '../../common';
import { NuverialInputFieldType } from '../../models';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';

// Max length of text input according to WSC3
const MAX_MAXLENGTH = 524288;
/**
 * A Text Form Input component
 *
 * ## Usage
 *
 * ```
 * import { NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';
 *   <nuverial-text-input
 *     label="Form Control"
 *     placeholder="Form Control Placeholder"
 *     prefixIcon="search_outlined"
 *     [required]="true"
 *     [formControl]="inputTextFormControl"
 *     [validationMessages]="inputTextValidationMessages"
 *     (validationErrors)="onValidationErrors($event)"
 *   ></nuverial-text-input>
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
    NuverialIconComponent,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
  selector: 'nuverial-text-input',
  standalone: true,
  styleUrls: ['./text-input.component.scss'],
  templateUrl: './text-input.component.html',
})
export class NuverialTextInputComponent extends FormInputBaseDirective implements ControlValueAccessor, OnInit, OnDestroy {
  public useMaxLength = false;
  private _maxlength = MAX_MAXLENGTH;
  /**
   * Attached to the aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel?: string;
  /**
   * TextInput aria described by
   */
  @Input() public ariaDescribedBy?: string;
  /**
   * Whether the control element is in an enabled/disabled state
   */
  @Input() public disabled = false;
  /**
   * TextInput display of validation errors and setting of error state in cards. Default value true
   */
  @Input() public displayError = true;
  /**
   * Hint text to be shown underneath the form field control
   */
  @Input() public hint?: string;
  /**
   * The floating label for the form input field
   */
  @Input() public label?: string;
  /**
   * The masking pattern to apply to the form input field
   * ie: (000) 000-0000
   */
  @Input() public maskPattern!: string;

  /**
   * The maximum allowed text length. If this property is set, a hit will be displayed showing the number of used/available characters
   */
  @Input()
  public set maxlength(len: number) {
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
   * Name of icon that may optionally be displayed at the start of the form input field. Supports named Material icons e.g. search_outlined
   */
  @Input() public prefixIcon?: string;
  /**
   * Aria Label associated with prefix icon
   */
  @Input() public prefixAriaLabel!: string;
  /**
   * Whether the control element is in an required state
   */
  @Input() public required = false;
  /**
   * Name of icon that may optionally be displayed at the end of the form input field. Supports named Material icons e.g. search_outlined
   */
  @Input() public suffixIcon?: string;
  /**
   * Aria Label associated with suffix icon
   */
  @Input() public suffixAriaLabel!: string;
  /**
   * Text for optional tooltip
   */
  @Input() public tooltip?: string;
  /**
   * Option type of input element e.g. date or text. Defaults to text
   */
  @Input() public type: NuverialInputFieldType = 'text';
  /**
   * Autocomplete attribute options
   */
  @Input() public autocomplete?: string;

  /**
   * Show/hide password option
   */
  @Input() public togglePassword?: boolean = false;

  /**
   * Click event on prefix/suffix icons
   */
  @Output() public readonly clickIcon: EventEmitter<'prefix' | 'suffix'> = new EventEmitter<'prefix' | 'suffix'>();

  @ViewChild('formBaseInput', { static: true }) private readonly _inputElementRef!: ElementRef;

  /**
   * this getter is so directives can access the private view child of the input
   */
  public get inputElementRef(): ElementRef {
    return this._inputElementRef;
  }

  public passwordVisible = false;

  public get inputType() {
    if (!this.type) {
      return 'text';
    }
    if (this.type === 'password' && this.togglePassword) {
      return this.passwordVisible ? 'text' : 'password';
    }

    return this.type;
  }

  public get inputSuffixIcon() {
    if (this.type === 'password' && !this.suffixIcon && this.togglePassword) {
      return this.passwordVisible ? 'visibility' : 'visibility_off';
    }

    return this.suffixIcon;
  }

  constructor(
    protected readonly _focusMonitor: FocusMonitor,
    @Inject(Injector) protected override readonly _injector: Injector,
    @Self() @Optional() protected override readonly _ngControl: NgControl,
  ) {
    super();
    this._ngControl && (this._ngControl.valueAccessor = this);
  }

  public ngOnInit() {
    this.formControl = this._modelFormControl();
    this._initErrorHandler(this._focusMonitor.monitor(this._inputElementRef, true).pipe(filter(origin => origin === null)));
  }

  public ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._inputElementRef);
  }

  public handleClickSuffixIcon() {
    if (this.type === 'password' && this.togglePassword) {
      this.passwordVisible = !this.passwordVisible;
    }
    this.clickIcon.emit('suffix');
  }
}
