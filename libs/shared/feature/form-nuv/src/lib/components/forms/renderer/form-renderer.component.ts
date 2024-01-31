import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IRendererFormConfigurationSchema, TransactionData } from '@dsg/shared/data-access/work-api';
import { NuverialButtonComponent, NuverialFormFieldErrorComponent, NuverialIconComponent } from '@dsg/shared/ui/nuverial';
import { FormlyModule } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';
import { FormRendererModule } from '../../../form-renderer.module';
import { FormRendererService } from '../../../services/form-renderer.service';
import { NuvalenceFormRendererOptions, PublicPortalIntakeRendererOptions } from './renderer.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormRendererModule,
    FormlyModule,
    NuverialButtonComponent,
    NuverialFormFieldErrorComponent,
    NuverialIconComponent,
  ],
  selector: 'dsg-form-renderer',
  standalone: true,
  styleUrls: ['./form-renderer.component.scss'],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent {
  @HostBinding('class.form-renderer') public componentClass = true;
  /** The form group */
  public form = new FormGroup({});
  /** The form options, initial form state */
  @Input() public options: NuvalenceFormRendererOptions = PublicPortalIntakeRendererOptions;
  /** The form configuration json */
  @Input() public fields$?: Observable<IRendererFormConfigurationSchema[]>;
  /** The form data model */
  @Input() public model$?: Observable<TransactionData> = this._formRendererService.transaction$.pipe(map(transactionModel => transactionModel.data));

  /** Output event emitter for model changes */
  @Output() public readonly modelChange = new EventEmitter<TransactionData>();

  constructor(private readonly _formRendererService: FormRendererService) {}

  public onModelChange(_event: TransactionData) {
    this.modelChange?.emit(_event);
  }
}
