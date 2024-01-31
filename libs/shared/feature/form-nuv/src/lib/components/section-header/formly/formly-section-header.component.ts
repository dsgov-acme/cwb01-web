import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialSectionHeaderComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBaseComponent } from '../../base';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialSectionHeaderComponent],
  selector: 'dsg-formly-section-header',
  standalone: true,
  styleUrls: ['./formly-section-header.component.scss'],
  templateUrl: './formly-section-header.component.html',
})
export class FormlySectionHeaderComponent extends FormlyBaseComponent {}
