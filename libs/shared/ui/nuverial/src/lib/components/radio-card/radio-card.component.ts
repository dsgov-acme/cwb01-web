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
  Inject,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { LoggingService } from '@dsg/shared/utils/logging';
import { filter, map, Observable } from 'rxjs';
import { FormInputBaseDirective } from '../../common';
import { Card, CardChange, CardTypes, NuverialCardCommonComponent } from '../../directives';
import { NuverialCardGroupComponent } from '../card-group';
import { NuverialIconComponent } from '../icon';

const CONTEXT = 'NuverialRadioCardComponent';

/**
 * A RadioCard component for use within the CardGroup allowing a used to select a single option from an array of options.
 *
 * This is a simple display component that emits single selected change event. It uses a combination of content projection add directives to identify content, image and title elements.
 *
 * ## Usage
 *
 * ```
 * import { NuverialCardComponent } from '@dsg/shared/ui/nuverial';
 * import { NuverialCardContentDirective } from '@dsg/shared/ui/nuverial';
 *
 * <nuverial-radio-card
 *     [formControl]="imageFormControl"
 *     (change)="onCardChange($event)">
 *   <img nuverialCardContentType="image" src="/assets/images/image.png" alt="Alternate Test" />
 *   <div nuverialCardContentType="title">Card Title</div>
 *   <div nuverialCardContentType="content">Card Content</div>
 * </nuverial-checkbox-card>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatRadioModule, NuverialIconComponent],
  providers: [{ provide: NuverialCardCommonComponent, useExisting: forwardRef(() => NuverialRadioCardComponent) }],
  selector: 'nuverial-radio-card',
  standalone: true,
  styleUrls: ['./radio-card.component.scss'],
  templateUrl: './radio-card.component.html',
})
export class NuverialRadioCardComponent extends FormInputBaseDirective implements AfterViewInit, Card, OnInit {
  /**
   * Card arial label
   */
  @Input() public ariaLabel!: string;
  /**
   * Card arial described by
   */
  @Input() public ariaDescribedBy!: string;
  /**
   * Card checked indicator
   */
  @Input() public checked = false;
  /**
   * Card disabled indicator
   */
  @Input() public disabled = false;
  /**
   * Card's image position above or before checkbox
   */
  @Input() public imagePosition: 'before' | 'top' = 'before';
  /**
   * Card's point value
   */
  @Input() public pointValue = 0;
  /**
   * Card value
   */
  @Input() public value!: string;
  /**
   * Card is required indicator
   */
  @Input() public required = false;
  /**
   * Output change event from card
   */
  @Input() public groupName!: string;

  @Output() public readonly change = new EventEmitter<CardChange>();

  public inputId!: string | undefined;
  public cardType: CardTypes = 'radio';
  protected _cardGroupComponent: NuverialCardGroupComponent | null = null;
  public invalid$: Observable<boolean> | undefined = undefined;

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
  }

  public ngAfterViewInit() {
    this.inputId = (this._elementRef.nativeElement as HTMLElement).querySelector('input[type="radio"]')?.id;

    if (!this._cardGroupComponent) {
      this.formControl = this._modelFormControl();
      if (this.formControl && this.formControl.value) {
        this.checked = this.formControl.value;
      }
      this.onTouched();
      this._initErrorHandler(this._focusMonitor.monitor(this._elementRef, true).pipe(filter(origin => origin === null)));
      this.error$ && (this.invalid$ = this.error$.pipe(map(error => typeof error === 'string' && error.length > 0)));
    }

    this._changeDetectorRef.markForCheck();
    this._changeDetectorRef.detectChanges();
  }

  public onChange(event: MatRadioChange): void {
    this.change.emit({ checked: event.source.checked, pointValue: this.pointValue, value: event.source.value });
    this.checked = event.source.checked;
    if (this.checked) {
      this.formControl?.setValue(this.value);
    } else {
      this.formControl?.setValue(null);
    }
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
