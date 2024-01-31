import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialSectionHeaderComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSectionHeaderComponent],
  selector: 'dsg-formio-section-header',
  standalone: true,
  styleUrls: ['./formio-section-header.component.scss'],
  templateUrl: './formio-section-header.component.html',
})
export class FormioSectionHeaderComponent extends FormioBaseCustomComponent<string> {}
