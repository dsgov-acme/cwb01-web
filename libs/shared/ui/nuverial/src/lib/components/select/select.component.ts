import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { LoggingService } from '@dsg/shared/utils/logging';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, merge, Observable, pairwise, startWith, tap } from 'rxjs';
import { FormInputBaseDirective } from '../../common';
import { MatchOptions } from '../../validators/select/select.validator';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';
import { INuverialSelectDropDownOption, INuverialSelectOption, NuverialSelectDropDownLabelsType, NuverialSelectDropDownType } from './select.models';

const DROPDOWN_MENU_MAP: NuverialSelectDropDownType = {
  cancel: { action: 'cancel', ariaLabel: 'Cancel', iconName: 'cancel_outline' },
  close: { action: 'close', ariaLabel: 'Close menu', iconName: 'expand_less' },
  open: { action: 'open', ariaLabel: 'Open menu', iconName: 'expand_more' },
};

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NuverialButtonComponent,
    NuverialIconComponent,
    MatProgressSpinnerModule,
  ],
  selector: 'nuverial-select',
  standalone: true,
  styleUrls: ['./select.component.scss'],
  templateUrl: './select.component.html',
})
export class NuverialSelectComponent extends FormInputBaseDirective implements ControlValueAccessor, OnDestroy, OnInit {
  // We override formControl here because select requires the formControl to be created
  /**
   * The formControl
   */
  @Input() public override formControl: FormControl = new FormControl();

  /**
   * Attached to the aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel?: string;
  /**
   * TextInput aria described by
   */
  @Input() public ariaDescribedBy?: string;
  /**
   * Select component. Aria labels associated with suffix icon for controlling menu open/close events
   */
  @Input() public dropDownArialLabels!: NuverialSelectDropDownLabelsType;
  /**
   * Select component. display of validation errors and setting of error state in cards. Default value true
   */
  @Input() public displayError = true;
  /**
   * Select component. TextInput float label behavior
   */
  @Input() public floatLabel: FloatLabelType = 'always';
  /**
   * Select component. The floating label for the form input field
   */
  @Input() public label?: string;

  /**
   * Select component. The place holder text for the form input field
   */
  @Input() public placeholder!: string;
  /**
   * Select component. Name of icon that may optionally be displayed at the start of the form input field.
   * Supports named Material icons e.g. search_outlined
   */
  @Input() public prefixIcon?: string;
  /**
   * Select component. Whether the MatInput input control element is required
   */
  @Input() public required = false;
  /**
   * Select component. Dropdown menu icon name displayed if selected
   */
  @Input() public selectedOptionIconName!: string;
  /**
   * Select component. Dropdown menu contents
   */
  @Input()
  public set selectOptions(value: INuverialSelectOption[]) {
    this._selectOptions = value;
    this._selectOptionsMap.clear();
    value.forEach((option: INuverialSelectOption) => this._selectOptionsMap.set(option.key, option));

    // We must update the selectOptions both on changes and on init to handle initialize and options being updated use cases
    this._updateSelectOptions();

    // remove the previous matchOptions validator if it exists
    if (this._matchOptionsValidator && this.formControl.hasValidator(this._matchOptionsValidator)) {
      this.formControl.removeValidators(this._matchOptionsValidator);
    }

    // add the new updated matchOptions validator
    this._matchOptionsValidator = MatchOptions(this.selectOptions);
    this.formControl.addValidators(this._matchOptionsValidator);
  }

  public get selectOptions(): INuverialSelectOption[] {
    return this._selectOptions;
  }

  /**
   * Select component. Autocomplete attribute options
   */
  @Input() public autocomplete?: string;

  /**
   * Whether the selected option is clearable or not
   */
  @Input() public selectedClearable = true;

  /**
   * Whether the select is loading options from an async source
   */
  @Input() public loading = false;

  /**
   * Emits the selected option
   */
  @Output() public readonly validOptionSelected = new EventEmitter<INuverialSelectOption>();

  /**
   * Emits the value of the search input
   */
  @Output() public readonly searchInput = new EventEmitter<string>();

  /**
   * Emits when the selected option is cleared
   */
  @Output() public readonly optionCleared = new EventEmitter<boolean>();

  /**
   * Select component. Validation error messages by validation error type
   */

  /**
   * Select component. filtered list of selectable options
   */
  public selectOptions$!: Observable<INuverialSelectOption[] | null>;

  /**
   * Store the selected option
   */
  public selectedOption?: INuverialSelectOption;

  /**
   * Select component. Suffix icon names and arial labels
   */
  public suffixIconName$!: Observable<INuverialSelectDropDownOption>;

  protected _suffixIconMap: NuverialSelectDropDownType = DROPDOWN_MENU_MAP;
  private _matchOptionsValidator?: ValidatorFn;

  private readonly _selectOptionsMap: Map<string, INuverialSelectOption> = new Map();
  private _selectOptions: INuverialSelectOption[] = [];
  private _previousSelectedValue = '';

  @ViewChild('formBaseInput', { static: true }) private readonly _inputElementRef!: ElementRef;
  @ViewChild(MatSelect, { static: true }) protected readonly _matSelect!: MatSelect;
  @ViewChild(MatAutocomplete, { static: true }) protected readonly _matAutocomplete!: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) protected readonly _matAutocompleteTrigger!: MatAutocompleteTrigger;

  public displayWith = (key: string) => {
    return this._selectOptionsMap.get(key)?.displayTextValue || '';
  };

  constructor(
    protected readonly _changeDetectorRef: ChangeDetectorRef,
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
    // We must update the selectOptions both on changes and on init to handle initialize and options being updated use cases
    this._previousSelectedValue = this.formControl.value || '';
    this._updateSelectOptions();

    this._initErrorHandler(this._focusMonitor.monitor(this._inputElementRef, true).pipe(filter(origin => origin === null)));

    this.suffixIconName$ = merge(this._matAutocomplete.opened.pipe(map(_ => 'opened')), this._matAutocomplete.closed.pipe(map(_ => 'closed'))).pipe(
      startWith('closed'),
      map(status => {
        if (this.formControl.value && this.selectedClearable) {
          return this._suffixIconMap.cancel;
        }

        return status === 'opened' ? this._suffixIconMap.close : this._suffixIconMap.open;
      }),
    );

    this._initializeValidValueEmitter();

    this._changeDetectorRef.detectChanges();
  }

  private _updateSelectOptions(): void {
    this.selectOptions$ = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value),
      tap(_ => {
        // add validator if it doesn't exist
        if (!this._matchOptionsValidator || !this.formControl.hasValidator(this._matchOptionsValidator)) {
          this._matchOptionsValidator = MatchOptions(this.selectOptions);
          this.formControl.addValidators(this._matchOptionsValidator);
        }
      }),
      tap(value => (this.selectedOption = this._selectOptionsMap.get(value || ''))),
      map(value => this._filterSelectOptions(value)),
    );
  }

  public ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._inputElementRef);
  }

  public onClickMenuIcon(option: INuverialSelectDropDownOption): void {
    if (this.selectedClearable) {
      if (option.action === DROPDOWN_MENU_MAP.cancel.action && this.selectedOption) {
        this.optionCleared.emit(true);
      }

      this.formControl.setValue(null);
      this.selectOptions.forEach(o => (o.selected = false));
    }

    this._matAutocompleteTrigger.panelOpen ? this._matAutocompleteTrigger.closePanel() : this._inputElementRef.nativeElement.click();
    this._changeDetectorRef.detectChanges();
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const option: string = event.option.value;
    this._previousSelectedValue = option;
    this.formControl.setValue(option);
    if (option) {
      this.selectOptions.forEach(opt => (opt.selected = opt.key === option));
    }
  }

  public trackByFn(_index: number, option: INuverialSelectOption) {
    return option.key;
  }

  private _filterSelectOptions(value: string | null) {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value;
      this.selectOptions.forEach(opt => (opt.selected = opt.key === value));
    } else {
      filterValue = '';
      this.selectOptions.forEach(o => (o.selected = false));
    }

    let selectOptions: INuverialSelectOption[] = [];

    if (filterValue === this._previousSelectedValue) {
      selectOptions = this.selectOptions;
    } else {
      selectOptions = this.selectOptions.filter(
        option => option.displayTextValue.toLowerCase().includes(filterValue.toLowerCase()) || option.key.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    this._previousSelectedValue = this.selectedOption?.key || '';

    return selectOptions;
  }

  private _initializeValidValueEmitter() {
    combineLatest([
      this.formControl.statusChanges.pipe(distinctUntilChanged()),
      this.formControl.valueChanges.pipe(
        startWith(this.formControl.value),
        debounceTime(250),
        pairwise(),
        filter(([previousValue, currentValue]) => previousValue !== currentValue),
        map(value => value[1]),
        distinctUntilChanged(),
      ),
    ])
      .pipe(
        debounceTime(100),
        tap(([_, value]) => !this.selectedOption && this.searchInput.emit(value)),
        filter(([status]) => status === 'VALID'),
        tap(_ => {
          this.selectedOption && this.validOptionSelected.emit(this.selectedOption);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  public selectOnBlur() {
    if (this._matAutocompleteTrigger.panelOpen) return;

    this.applyAutoSelect();
  }

  public applyAutoSelect() {
    if (!this.formControl.value) return;

    if (this.formControl.invalid || this._inputElementRef.nativeElement.value !== this.selectedOption?.displayTextValue) {
      // We validate user input against name and key to handle the form autofill use case
      const matchedOption = this.selectOptions.find(
        opt => opt.displayTextValue.toLowerCase() === this.formControl.value.toLowerCase() || opt.key.toLowerCase() === this.formControl.value.toLowerCase(),
      );

      if (!matchedOption) {
        return;
      }

      this.formControl.setValue(matchedOption.key);
      this.selectOptions.forEach(opt => (opt.selected = opt.key === matchedOption.key));
    }
  }
}
