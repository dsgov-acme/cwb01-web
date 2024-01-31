import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FormInputBaseDirective } from '../../common';
import { Card, CardChange, CardTypes, NuverialCardCommonComponent } from '../../directives';
import { NuverialCardImagePositionType, NuverialColorThemeType } from '../../models';
import { NuverialCardGroupComponent } from '../card-group';
import { NuverialFormFieldErrorComponent } from '../form-field-error';
import { NuverialIconComponent } from '../icon';

/**
 * @ignore
 * Checkbox Card component Context
 */
const CONTEXT = 'NuverialCheckboxCardComponent';

/**
 * CheckboxCard checkbox component maybe used as a standalone singleton or within the CardGroup allowing a used to select options from an array of options.
 *
 * It uses a combination of content projection add directives to identify content, image and title elements.
 *
 * ## Usage
 *
 * ```
 * import { NuverialCheckboxCardComponent } from '@dsg/shared/ui/nuverial';
 * import { NuverialCardContentDirective } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-checkbox-card
 *     [formControl]="imageFormControl"
 *     [validationMessages]="validationMessages"
 *     (change)="onCardChange($event)"
 *     (validationErrors)="onValidationErrors($event)">
 *   <img nuverialCardImage src="/assets/images/image.png" alt="Alternate Test" />
 *   <div nuverialCardTitle>Card Title</div>
 *   <div nuverialCardContent>Card Content</div>
 * </nuverial-checkbox-card>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCheckboxModule, NuverialFormFieldErrorComponent, NuverialIconComponent],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NuverialCheckboxCardComponent),
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NuverialCheckboxCardComponent),
    },
    { provide: NuverialCardCommonComponent, useExisting: forwardRef(() => NuverialCheckboxCardComponent) },
  ],
  selector: 'nuverial-checkbox-card',
  standalone: true,
  styleUrls: ['./checkbox-card.component.scss'],
  templateUrl: './checkbox-card.component.html',
})
export class NuverialCheckboxCardComponent extends FormInputBaseDirective implements AfterViewInit, Card, ControlValueAccessor, OnInit, OnDestroy {
  public get cardDisabled(): boolean {
    return this.disabled;
  }

  /**
   * Card label
   */
  @Input() public label?: string;
  /**
   * Card arial described by
   */
  @Input() public ariaDescribedBy?: string;
  /**
   * Card checked indicator
   */
  @Input() public checked = false;
  /**
   * Card color theme
   */
  @Input() public colorTheme: NuverialColorThemeType = 'primary';
  /**
   * Card disabled indicator
   */
  @Input() public disabled = false;
  /**
   * Card display validation error indicator
   */
  @Input() public displayError = true;
  /**
   * Checkbox card status indeterminate indicator
   */
  @Input() public indeterminate = false;
  /**
   * Card display validation error indicator
   */
  @Input() public invalid = false;
  /**
   * Card's image position above or before checkbox
   */
  @Input() public imagePosition: NuverialCardImagePositionType = 'before';
  /**
   * Card's point value associated with card used primarily with Card Groups
   */
  @Input() public pointValue = 0;
  /**
   * Card is required indicator
   */
  @Input() public required = false;
  /**
   * Card value associated with the card and included with change events |
   */
  @Input() public value = '';
  /**
   * @ignore
   * Card output change event
   */
  @Output() public readonly change = new EventEmitter<CardChange>();
  @ViewChild('formBaseInput', { static: true }) protected readonly _inputElementRef!: MatCheckbox;

  private _ariaLabel?: string;

  public cardType: CardTypes = 'checkbox';
  public invalid$: Observable<boolean> | undefined = undefined;
  public inputId: string | undefined;

  protected _cardGroupComponent: NuverialCardGroupComponent | null = null;

  /**
   * Card arial label the aria-label attribute of the host element. This should be considered a required inputfield, if not provided a warning message will be logged
   */
  @Input()
  public get ariaLabel(): string | undefined {
    return this._ariaLabel || this.label;
  }

  public set ariaLabel(value: string | undefined) {
    this._ariaLabel = value;
  }

  @HostBinding('class.nuverial-checkbox-card') public componentClass = true;

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _elementRef: ElementRef,
    @Inject(Injector) protected override readonly _injector: Injector,
    protected readonly _focusMonitor: FocusMonitor,
    protected _loggingService: LoggingService,
  ) {
    super();
    this._cardGroupComponent = this._injector.get(NuverialCardGroupComponent, null);
  }

  public ngOnInit() {
    !this.ariaLabel && this._loggingService.warn(CONTEXT, 'provide value for ariaLabel');
    if (this._cardGroupComponent) {
      this.displayError = false;
    }
  }

  public ngAfterViewInit() {
    this.inputId = (this._elementRef.nativeElement as HTMLElement).querySelector('input[type="checkbox"]')?.id;

    if (!this._cardGroupComponent) {
      this.formControl = this._modelFormControl();
      if (this.formControl && this.formControl.value) {
        this.checked = this.formControl.value;
      }
      this.onTouched();
      this._initErrorHandler(this._focusMonitor.monitor(this._elementRef, true).pipe(filter(origin => origin === null)));
      this.error$ && (this.invalid$ = this.error$.pipe(map(error => this.formControl.touched && typeof error === 'string' && error.length > 0)));
    }

    this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy() {
    if (!this._cardGroupComponent) {
      this._focusMonitor.stopMonitoring(this._elementRef);
    }
  }

  public onChange(event: MatCheckboxChange): void {
    this.change.emit({ checked: event.checked, pointValue: this.pointValue, value: event.source.value });
    this.checked = event.checked;
    this.formControl?.setValue(event.checked);
  }

  public markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

  public validate(control: AbstractControl) {
    const isValid = coerceBooleanProperty(control.value);

    if (this.required) {
      return isValid ? null : { required: true };
    }

    return null;
  }
}
