import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Injector, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { DateFilterFn, MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, combineLatest, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs';
import { FormInputBaseDirective } from '../../common';
import { NuverialDateMaskDirective } from '../../directives/date-mask';
import { NuverialFormFieldErrorComponent } from '../form-field-error';
import { NuverialIconComponent } from '../icon';
import { DateRangePickerControl } from './date-picker.models';
import { convertMaterialErrors } from './date-picker.utils';
import { DateRangeErrorStateMatcher } from './date-range-picker.error-state-matcher';

const VALIDATE_REQUIRED = (control: AbstractControl): ValidationErrors | null => {
  const value: DateRangePickerControl = control?.value;

  if (value?.endDate && value?.startDate) {
    return null;
  }

  return { datePickerRequired: { endDate: value?.endDate, startDate: value?.startDate } };
};

/***
 * NuverialDateRangePickerComponent
 * The datepicker allows users to enter a date range either through text input, or by choosing a date from the calendar.
 *
 * Validations
 * The following validation errors maybe generated in addition to the standard validation errors e.g. required
 *
 *  daterPickerFilter
 *
 *  datePickerParse
 *
 *  datePickerMax
 *
 *  datePickerMin
 *
 * ## Usage
 * Start and end date values provided into a form control of the type DateRangePickerControl
 * ```
 * import { MatNativeDateModule } from '@angular/material/core';
 * import { NuverialDatePickerComponent } from '@dsg/shared/ui/nuverial';
 *
 * dateControl = new FormControl<DateRangePickerControl>({ endDate: Date | null, startDate: Date | null });
 * <nuverial-date-range-picker
 *   [formControl]="dateControl"
 * ></nuverial-date-range-picker>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    NuverialFormFieldErrorComponent,
    NuverialIconComponent,
    NuverialDateMaskDirective,
  ],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: NuverialDateRangePickerComponent,
    },
  ],
  selector: 'nuverial-date-range-picker',
  standalone: true,
  styleUrls: ['./date-picker.component.scss'],
  templateUrl: './date-range-picker.component.html',
})
export class NuverialDateRangePickerComponent extends FormInputBaseDirective implements ControlValueAccessor, OnInit {
  /**
   * DatePicker aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel!: string;

  /**
   * DateRangePicker aria described by attribute. Default undefined
   */
  @Input() public ariaDescribedBy!: string;

  /**
   * Function that can be used to filter out dates within the date range picker.
   */
  @Input() public dateFilter!: DateFilterFn<Date>;
  /**
   * DateRangePicker display of validation errors and setting of error state in cards. Default value true
   */
  @Input() public displayError = true;
  /**
   * DateRangePicker aria disabled attribute. Default false
   */
  @Input() public disabled = false;
  /**
   * DatePicker place holder end date input field. Default undefined
   */
  @Input() public set endDatePlaceholder(value: string) {
    this._endDatePlaceholder = this.truncateDate(value);
  }

  public get endDatePlaceholder(): string {
    return this._endDatePlaceholder;
  }
  /**
   * Hint text to be shown underneath the form field control
   */
  @Input() public hint!: string;
  /**
   * The floating label for the form input field
   */
  @Input() public label!: string;

  // Material inputs
  /**
   * Whether the calendar is open.
   */
  @Input() public opened = false;
  /**
   * Classes to be passed to the date picker panel. Supports string and string array values, similar to ngClass.
   */
  @Input() public panelClass: string | string[] = 'nuverial-datepicker-panel';
  /**
   * Whether to restore focus to the previously-focused element when the calendar is closed. Note that automatic focus restoration is an accessibility feature and it is recommended that you provide your own equivalent, if you decide to turn it off.
   */
  @Input() public restoreFocus = true;
  /**
   * Separator text to be shown between the inputs.
   */
  @Input() public separator = '–';
  /**
   * The date to open the calendar to initially.
   */
  @Input() public startAt!: Date;
  /**
   * DatePicker place holder start date input field. Default undefined. Format should be yyyy-mm-dd.
   */
  @Input() public set startDatePlaceholder(value: string) {
    this._startDatePlaceholder = this.truncateDate(value);
  }

  public get startDatePlaceholder(): string {
    return this._startDatePlaceholder;
  }

  /**
   * The view that the calendar should start in.
   */
  @Input() public startView: 'month' | 'year' | 'multi-year' = 'year';
  /**
   * DatePicker is required true/false. Default false
   */
  @Input() public required = false;
  /**
   * Function that can be used to add custom CSS classes to dates.
   */
  @Input() public dateClass!: MatCalendarCellClassFunction<Date>;
  /**
   * Minimum data that can be selected. Format should be yyyy-mm-dd.
   */
  @Input() public minDate!: Date;
  /**
   * Maximum data that can be selected. Format should be yyyy-mm-dd.
   */
  @Input() public maxDate!: Date;

  /**
   * endDate form control
   */
  public get endDate(): FormControl {
    return this.dateRange?.get('endDate') as FormControl;
  }
  /**
   * startDate form control
   */
  public get startDate(): FormControl {
    return this.dateRange?.get('startDate') as FormControl;
  }

  public floatLabel: FloatLabelType = 'always';
  public dateRange!: FormGroup;
  private _startDatePlaceholder = '';
  private _endDatePlaceholder = '';

  /**
   * ErrorStateMatcher instance for date range
   * @ignore
   */
  public dateRangeErrorStateMatcher: DateRangeErrorStateMatcher = new DateRangeErrorStateMatcher();

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _elementRef: ElementRef,
    protected readonly _focusMonitor: FocusMonitor,
    @Inject(Injector) protected override readonly _injector: Injector,
  ) {
    super();
    this._convertMaterialValidationErrors = convertMaterialErrors;
  }

  public ngOnInit() {
    this.formControl = this._modelFormControl();

    const range: DateRangePickerControl = this.formControl?.value;
    this.dateRangeErrorStateMatcher.parentControl = this.formControl;

    // DEBUG: The form control is set to required whether the formControl has the required validator or not
    this.dateRange = new FormGroup({
      endDate: new FormControl<Date | null>(range?.endDate, { validators: this.formControl.validator }),
      startDate: new FormControl<Date | null>(range?.startDate, { validators: this.formControl.validator }),
    });

    this._initErrorHandler(this._focusMonitor.monitor(this._elementRef, true).pipe(filter(origin => origin === null)));

    this._changeDetectorRef.markForCheck();
  }

  protected override _initErrorHandler(events: Observable<unknown>) {
    this.error$ = combineLatest([
      events.pipe(startWith(null)),
      this.dateRange.statusChanges.pipe(
        tap(_status => this.formControl.setValue({ endDate: this.endDate.value, startDate: this.startDate.value }, { emitEvent: false })),
        startWith(null),
      ),
      this.formControl.statusChanges.pipe(
        distinctUntilChanged(),
        filter(status => !!status),
        tap(_status => {
          this.dateRange.markAllAsTouched();
          this.dateRange.updateValueAndValidity();
        }),
        startWith(null),
      ),
    ]).pipe(
      filter(([event, _dateRangeStatus]) => event === null),
      map(([_event, _status]) => {
        // DEBUG: The form control is set to required whether the formControl has the required validator or not
        let errors = this.endDate.errors || this.startDate.errors || VALIDATE_REQUIRED(this.formControl);
        errors = this._convertMaterialValidationErrors(errors);
        this.formControl?.setErrors(errors);

        return (
          errors &&
          Object.keys(errors).map(key => ({
            [key]: this._validationMessage(key, this.validationMessages),
          }))
        );
      }),
      tap(errors => errors && this.validationErrors.emit(errors)),
      map(errors => (errors ? Object.keys(errors[0]).map(key => errors[0][key])[0] : '')),
    );
  }

  public truncateDate(dateString: string): string {
    const index = dateString.indexOf('T');
    if (index !== -1) {
      return dateString.substring(0, index);
    }

    return dateString;
  }
}
