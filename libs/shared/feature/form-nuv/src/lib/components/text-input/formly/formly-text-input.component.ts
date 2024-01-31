import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormlyBaseComponent } from '../../base';
import { FormlyTextInputFieldProperties } from './formly-text-input.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialTextInputComponent, NgxMaskPipe],
  providers: [provideNgxMask()],
  selector: 'dsg-formly-text-input',
  standalone: true,
  styleUrls: ['./formly-text-input.component.scss'],
  templateUrl: './formly-text-input.component.html',
})
export class FormlyTextInputComponent extends FormlyBaseComponent<FormlyTextInputFieldProperties> {}
