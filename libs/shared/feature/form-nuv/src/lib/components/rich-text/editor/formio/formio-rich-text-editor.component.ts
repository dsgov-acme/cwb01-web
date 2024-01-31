import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuverialRichTextEditorComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../../base';
import { RichTextEditorProperties } from '../models/rich-text-editor.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NuverialRichTextEditorComponent],
  selector: 'dsg-rich-text-editor',
  standalone: true,
  styleUrls: ['./formio-rich-text-editor.component.scss'],
  templateUrl: './formio-rich-text-editor.component.html',
})
export class FormioTextContentComponent extends FormioBaseCustomComponent<string, RichTextEditorProperties> implements OnInit {
  public ngOnInit(): void {
    this._handleFormControlChanges();
  }
}
