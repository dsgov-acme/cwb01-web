import { AfterViewChecked, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';
interface AceEditorWrapper {
  editor: {
    aceEditor: {
      $readOnly: boolean;
      setReadOnly: (value: boolean) => void;
    };
  };
}

/**
 * A JSON editor wrapper
 *
 * ## Usage
 *
 * ```
 * import { NuverialJsonEditorWrapperComponent } from '@dsg/shared/ui/nuverial';
 * <nuverial-json-editor-wrapper [formioJSONObject]="formioJSONObject"> </nuverial-json-editor-wrapper>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgJsonEditorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'nuverial-json-editor',
  standalone: true,
  styleUrls: ['./json-editor.component.scss'],
  templateUrl: './json-editor.component.html',
})
export class NuverialJsonEditorWrapperComponent implements AfterViewChecked {
  /**
   * Passes in a JSON object to be passed into the JSON editor to display
   */
  @Input() public formioJSONObject!: object;
  /**
   * Emits the JSON object on change
   */
  @Output() public readonly jsonChange = new EventEmitter<object>();
  /**
   * The JSON object that is being edited
   */
  public editedJson = this.formioJSONObject;
  /**
   * Input property to determine the read only state of the JSON editor
   */
  @Input() public readOnly? = false;

  @ViewChild('jsonEditor') private readonly _aceEditorWrapper!: AceEditorWrapper;

  public jsonEditorOptions!: JsonEditorOptions;

  constructor() {
    this.initJsonEditorOptions();
  }

  public ngAfterViewChecked(): void {
    if (this.readOnly && this._aceEditorWrapper && !this._aceEditorWrapper.editor.aceEditor.$readOnly) {
      this._aceEditorWrapper.editor.aceEditor.setReadOnly(true);
    }
  }

  public initJsonEditorOptions() {
    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.mode = 'code';
    this.jsonEditorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.jsonEditorOptions.onChangeText = json => {
      try {
        this.editedJson = JSON.parse(json);
        this.jsonChange.emit(this.editedJson);
      } catch (e) {
        // do not emit changes if the json is invalid
      }
    };
  }
}
