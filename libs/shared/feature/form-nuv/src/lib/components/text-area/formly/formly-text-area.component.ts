import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialTextAreaComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBaseComponent } from '../../base';
import { FormlyTextAreaFieldProperties } from './formly-text-area.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialTextAreaComponent],
  selector: 'dsg-formly-text-area',
  standalone: true,
  styleUrls: ['./formly-text-area.component.scss'],
  templateUrl: './formly-text-area.component.html',
})
export class FormlyTextAreaComponent extends FormlyBaseComponent<FormlyTextAreaFieldProperties> {}
