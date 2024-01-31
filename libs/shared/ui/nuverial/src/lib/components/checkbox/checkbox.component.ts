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
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoggingService } from '@dsg/shared/utils/logging';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FormInputBaseDirective } from '../../common';
import { CardChange, NuverialCardCommonComponent } from '../../directives';
import { NuverialColorThemeType } from '../../models';
import { NuverialFormFieldErrorComponent } from '../form-field-error';
import { NuverialIconComponent } from '../icon';

/**
 * @ignore
 * Checkbox component Context
 */
const CONTEXT = 'NuverialCheckboxComponent';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCheckboxModule, NuverialFormFieldErrorComponent, NuverialIconComponent, MatFormFieldModule, ReactiveFormsModule],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NuverialCheckboxComponent),
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NuverialCheckboxComponent),
    },
    { provide: NuverialCardCommonComponent, useExisting: forwardRef(() => NuverialCheckboxComponent) },
  ],
  selector: 'nuverial-checkbox',
  standalone: true,
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
})
export class NuverialCheckboxComponent extends FormInputBaseDirective implements AfterViewInit, ControlValueAccessor, OnInit, OnDestroy {
  // We override formControl here because select requires the formControl to be created
  /**
   * The formControl
   */
  @Input() public override formControl: FormControl = new FormControl();

  /**
   * Checkbox aria label the aria-label attribute of the host element. This should be considered a required inputfield, if not provided a warning message will be logged
   */
  @Input() public ariaLabel!: string;
  /**
   * Checkbox aria described by
   */
  @Input() public ariaDescribedBy!: string;
  /**
   * Checkbox label position
   */
  @Input() public labelPosition: 'before' | 'after' = 'after';
  /**
   * Checkbox checked indicator
   */
  @Input() public checked = false;
  /**
   * Checkbox color theme
   */
  @Input() public colorTheme: NuverialColorThemeType = 'primary';
  /**
   * Checkbox disabled indicator
   */
  @Input() public disabled = false;
  /**
   * Checkbox display validation error indicator
   */
  @Input() public displayError = true;
  /**
   * Checkbox status indeterminate indicator
   */
  @Input() public indeterminate = false;
  /**
   * Checkbox display invalid indicator
   */
  @Input() public invalid = false;
  /**
   * Checkbox required indicator
   */
  @Input() public required = false;
  /**
   * @ignore
   * Card output change event
   */
  @Output() public readonly change = new EventEmitter<CardChange>();
  @ViewChild('formBaseInput', { static: true }) protected readonly _inputElementRef!: MatCheckbox;

  public invalid$: Observable<boolean> | undefined = undefined;
  public inputId: string | undefined;
  public formGroup!: FormGroup;

  @HostBinding('class.nuverial-checkbox') public componentClass = true;

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _elementRef: ElementRef,
    @Inject(Injector) protected override readonly _injector: Injector,
    protected readonly _focusMonitor: FocusMonitor,
    protected _loggingService: LoggingService,
  ) {
    super();
  }
  /**
   * @ignore
   * ngOnInit()
   */
  public ngOnInit() {
    !this.ariaLabel && this._loggingService.warn(CONTEXT, 'provide value for ariaLabel');
  }

  public ngAfterViewInit() {
    this.inputId = (this._elementRef.nativeElement as HTMLElement).querySelector('input[type="checkbox"]')?.id;

    this.formControl = this._modelFormControl();
    if (this.formControl && this.formControl.value) {
      this.checked = this.formControl.value;
    }
    this._initErrorHandler(this._focusMonitor.monitor(this._elementRef, true).pipe(filter(origin => origin === null)));
    this.error$ && (this.invalid$ = this.error$.pipe(map(error => this.formControl.touched && typeof error === 'string' && error.length > 0)));
    this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  public onChange(event: MatCheckboxChange): void {
    this.change.emit({ checked: event.checked, value: event.source.value });
    this.checked = event.checked;
    this.formControl?.setValue(event.checked);
    this.onTouched();
    this._changeDetectorRef.markForCheck();
  }

  public markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

  public validate(control: AbstractControl) {
    const isValid = coerceBooleanProperty(control.value) && control.touched;

    if (this.required) {
      return isValid ? null : { required: true };
    }

    return null;
  }
}
