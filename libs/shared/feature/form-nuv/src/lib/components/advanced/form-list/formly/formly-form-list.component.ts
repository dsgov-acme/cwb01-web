import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialButtonComponent, NuverialIconComponent, NuverialSectionHeaderComponent } from '@dsg/shared/ui/nuverial';
import { FormlyExtension, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { defaultPrePopulateListComponent, FormlyListBaseComponent, isPrePopulated } from '../../../base';
import { FormStateMode } from '../../../forms/renderer/renderer.model';
import { FormlyObjectListFieldProperties } from './formly-form-list.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialButtonComponent, NuverialIconComponent, NuverialSectionHeaderComponent],
  selector: 'dsg-formly-form-list',
  standalone: true,
  styleUrls: ['./formly-form-list.component.scss'],
  templateUrl: './formly-form-list.component.html',
})
export class FormlyFormListComponent extends FormlyListBaseComponent<FormlyObjectListFieldProperties> implements FormlyExtension {
  public formStateMode = FormStateMode;

  public prePopulate(field: FormlyFieldConfig<FormlyObjectListFieldProperties>): void {
    if (isPrePopulated(field)) return;

    defaultPrePopulateListComponent(field);
  }
}
