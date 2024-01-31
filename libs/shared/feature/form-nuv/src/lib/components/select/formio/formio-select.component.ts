import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialSelectComponent, NuverialCardContentDirective } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { SelectFieldProperties } from '../models/formly-select.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSelectComponent, NuverialCardContentDirective],
  selector: 'dsg-formio-select',
  standalone: true,
  styleUrls: ['./formio-select.component.scss'],
  templateUrl: './formio-select.component.html',
})
export class FormioSelectComponent extends FormioBaseCustomComponent<string, SelectFieldProperties> {}
