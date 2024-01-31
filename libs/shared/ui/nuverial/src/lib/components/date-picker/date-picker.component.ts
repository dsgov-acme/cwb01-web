import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCalendarCellClassFunction, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter } from 'rxjs';
import { FormInputBaseDirective } from '../../common';
import { NuverialDateMaskDirective } from '../../directives/date-mask';
import { NuverialFormFieldErrorComponent } from '../form-field-error';
import { NuverialIconComponent } from '../icon';
import { convertMaterialErrors } from './date-picker.utils';

/***
 * The DatePickerComponent allows users to enter a date either through text input, or by choosing a date from the calendar.
 *
 * Validations
 * The following validation errors maybe generayed in addition to the standard validation errors e.g. required
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
 * ```
 * import { MatNativeDateModule } from '@angular/material/core';
 * import { NuverialDatePickerComponent } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-datepicker
 *   [formControl]="dateForm"
 * ></nuverial-datepicker>
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
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS,
    },
    {
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      provide: DateAdapter,
      useClass: MomentDateAdapter,
    },
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: NuverialDatePickerComponent,
    },
  ],
  selector: 'nuverial-date-picker',
  standalone: true,
  styleUrls: ['./date-picker.component.scss'],
  templateUrl: './date-picker.component.html',
})
export class NuverialDatePickerComponent extends FormInputBaseDirective implements ControlValueAccessor, OnInit {
  /**
   * DatePicker aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel!: string;
  /**
   * DatePicker aria described by attribute. Default undefined
   */
  @Input() public ariaDescribedBy!: string;
  /**
   * DatePicker display of validation errors and setting of error state in cards. Default value true
   */
  @Input() public displayError = true;
  /**
   * Hint text to be shown underneath the form field control
   *
   */
  @Input() public hint!: string;
  /**
   * The floating label for the form input field
   */
  @Input() public inputLabel!: string;
  /**
   * DatePicker place holder text for the form input field. Default undefined
   */
  @Input() public placeholder!: string;
  /**
   * DatePicker is required true/false. Default false
   */
  @Input() public required = false;
  /**
   * Function that can be used to add custom CSS classes to dates.
   */
  @Input() public dateClass!: MatCalendarCellClassFunction<Date>;
  /**
   * Minimum date that can be selected
   */
  @Input() public minDate?: Date;
  /**
   * Maximum date that can be selected
   */
  @Input() public maxDate?: Date;
  /**
   * Whether the datepicker pop-up should be disabled.
   */
  @Input() public disabled = false;
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
   * Maximum relative date that can be selected
   */
  @Input()
  public get relativeMaxDate(): string {
    return this._relativeMaxDate;
  }

  public set relativeMaxDate(value: string) {
    if (!value) return;

    this._calculateRelativeDate(value, 'relativeMaxDate');
  }
  /**
   * Minimum relative date that can be selected
   */
  @Input()
  public get relativeMinDate(): string {
    return this._relativeMinDate;
  }

  public set relativeMinDate(value: string) {
    if (!value) return;

    this._calculateRelativeDate(value, 'relativeMinDate');
  }
  /**
   * The date to open the calendar to initially.
   */
  @Input() public startAt!: Date;
  /**
   * The view that the calendar should start in.
   */
  @Input() public startView: 'month' | 'year' | 'multi-year' = 'year';
  /**
   * Autocomplete attribute options
   */
  @Input() public autocomplete?: string;

  @Output() public readonly change: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public readonly input: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('datepicker', { static: true }) public datePicker!: MatDatepicker<Date>;
  @ViewChild('formBaseInput', { static: true }) private readonly _inputElementRef!: ElementRef;

  private readonly _relativeMaxDate!: string;
  private readonly _relativeMinDate!: string;

  public floatLabel: FloatLabelType = 'always';

  constructor(protected readonly _focusMonitor: FocusMonitor, @Inject(Injector) protected override readonly _injector: Injector) {
    super();
    this._convertMaterialValidationErrors = convertMaterialErrors;
  }

  public ngOnInit() {
    this.formControl = this._modelFormControl();
    this._initErrorHandler(this._focusMonitor.monitor(this._inputElementRef, true).pipe(filter(origin => origin === null)));
    this.valueChanged();
  }

  public valueChanged() {
    const datePipe = new DatePipe('en-US');
    const newDate = datePipe.transform(this.formControl.value, 'yyyy-MM-dd');
    this.formControl.setValue(newDate);
  }

  private _calculateRelativeDate(inputValue: string, key: string) {
    let isNegative = false;
    let value = inputValue;

    if (inputValue.startsWith('-')) {
      isNegative = true;
      value = inputValue.substring(1);
    }

    const [numberOfUnit, dateUnit] = value.split('-');
    const numberOfUnitInt = parseInt(numberOfUnit, 10) * (isNegative ? -1 : 1);
    const validationDate = new Date();

    switch (dateUnit) {
      case 'day':
        validationDate.setDate(validationDate.getDate() + numberOfUnitInt);
        break;
      case 'week':
        validationDate.setDate(validationDate.getDate() + numberOfUnitInt * 7);
        break;
      case 'month':
        validationDate.setMonth(validationDate.getMonth() + numberOfUnitInt);
        break;
      case 'year':
        validationDate.setFullYear(validationDate.getFullYear() + numberOfUnitInt);
        break;
      default:
        throw new Error('Invalid date unit');
    }

    switch (key) {
      case 'relativeMinDate':
        this.minDate = validationDate;
        break;
      case 'relativeMaxDate':
        this.maxDate = validationDate;
        break;
      default:
        throw new Error('Invalid key');
    }
  }
}
