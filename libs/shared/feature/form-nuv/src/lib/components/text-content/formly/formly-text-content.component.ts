import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialRichTextViewerComponent } from '@dsg/shared/ui/nuverial';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { defaultPrePopulateDisplayOnlyComponent, FormlyBaseComponent, isPrePopulated } from '../../base';
import { FormStateMode } from '../../forms';
import { TextContentFieldProperties } from '../models/formly-text-content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialRichTextViewerComponent],
  selector: 'dsg-formly-text-content',
  standalone: true,
  styleUrls: ['./formly-text-content.component.scss'],
  templateUrl: './formly-text-content.component.html',
})
export class FormlyTextContentComponent extends FormlyBaseComponent<TextContentFieldProperties> {
  public formStateMode = FormStateMode;

  public prePopulate(field: FormlyFieldConfig<TextContentFieldProperties>): void {
    if (isPrePopulated(field)) return;

    defaultPrePopulateDisplayOnlyComponent(field);
  }
}
