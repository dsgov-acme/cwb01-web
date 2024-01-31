import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IRendererFormConfigurationSchema } from '@dsg/shared/data-access/work-api';
import { FormRendererComponent, FormRendererService, NuvalenceFormRendererOptions, PublicPortalIntakeRendererOptions } from '@dsg/shared/feature/form-nuv';
import { NuverialBreadcrumbComponent, NuverialSnackBarService, NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';
import { Observable, map, tap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormRendererComponent, NuverialSpinnerComponent, NuverialBreadcrumbComponent],
  selector: 'dsg-intake-form',
  standalone: true,
  styleUrls: ['./intake-form.component.scss'],
  templateUrl: './intake-form.component.html',
})
export class IntakeFormComponent {
  public rendererOptions: NuvalenceFormRendererOptions = PublicPortalIntakeRendererOptions;

  public formRendererConfiguration$?: Observable<IRendererFormConfigurationSchema[]> = this._formRendererService.formConfiguration$.pipe(
    tap(formConfigurationModel => {
      !formConfigurationModel && this._nuverialSnackBarService.notifyApplicationError();
    }),
    map(formConfigurationModel => formConfigurationModel?.toIntakeForm()),
  );

  constructor(private readonly _formRendererService: FormRendererService, private readonly _nuverialSnackBarService: NuverialSnackBarService) {}
}
