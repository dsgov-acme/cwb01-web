import { FocusMonitor } from '@angular/cdk/a11y';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Injector, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { filter } from 'rxjs/operators';
import { FormInputBaseDirective } from '../../../common';
import { NuverialIconComponent } from '../../icon';

/***
 * A rick text editor component
 *
 * ## Usage
 *
 * ```
 * import { NuverialRichTextEditorComponent } from '@dsg/shared/ui/nuverial';
 *   <nuverial-rich-text-editor
        class="notes-form-field-full"
        ariaLabel="Note"
        [id]="formConfigs.body.id"
        [required]="true"
        [validationMessages]="{required: 'Note is required'}"
        formControlName="body"
        label="Note"
      ></nuverial-rich-text-editor>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NuverialIconComponent, TextFieldModule, NgxEditorModule],
  selector: 'nuverial-rich-text-editor',
  standalone: true,
  styleUrls: ['./rich-text-editor.component.scss'],
  templateUrl: './rich-text-editor.component.html',
})
export class NuverialRichTextEditorComponent extends FormInputBaseDirective implements ControlValueAccessor, OnInit, OnDestroy {
  public editor = new Editor();

  /**
   * Attached to the aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  private _ariaLabel?: string;

  /**
   * Whether the control element is in an enabled/disabled state
   */
  @Input() public disabled = false;

  /**
   * Hint text to be shown underneath the form field control
   */
  @Input() public hint?: string;
  /**
   * The floating label for the form input field
   */
  @Input() public label?: string;

  /**
   * The place holder text for the form input field
   */
  @Input() public placeholder!: string;

  /**
   * Whether the control element is in an required state
   */
  @Input() public required = false;

  @Input()
  public set ariaLabel(value: string | undefined) {
    this._ariaLabel = value;
  }

  public get ariaLabel(): string | undefined {
    return this._ariaLabel || this.label;
  }

  /**
   * Sets the rich text editor toolbar
   */
  @Input() public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right'],
    ['horizontal_rule', 'format_clear'],
  ];

  /** Sets the color options for the rich text editor toolbar */
  @Input() public colorPresets = [
    '#000000',
    '#BE1E2D',
    '#237A00',
    '#F2A900',
    '#0077C8',
    '#00C9C9',
    '#C415C4',
    '#FFFFFF',
    '#696969',
    '#DE0000',
    '#59D926',
    '#F7ED05',
    '#BDBDBD',
    '#0098FF',
    '#F500F5',
    '#DE6B00',
  ];

  @ViewChild('formBaseInput', { static: true }) private readonly _inputElementRef!: ElementRef;

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
    this.editor.destroy();
  }

  public onFocusOut() {
    this.formControl.markAsTouched();
  }
}
