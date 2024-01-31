import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IRendererFormConfigurationSchema } from '@dsg/shared/data-access/work-api';
import { FormRendererComponent, FormRendererService, NuvalenceFormRendererOptions, PublicPortalReviewRendererOptions } from '@dsg/shared/feature/form-nuv';
import {
  NuverialAccordionComponent,
  NuverialBreadcrumbComponent,
  NuverialButtonComponent,
  NuverialFooterComponent,
  NuverialIconComponent,
  NuverialSpinnerComponent,
} from '@dsg/shared/ui/nuverial';
import { Observable, map } from 'rxjs';

export enum StatusLabelColors {
  Black = 'status__label--black',
  Green = 'status__label--green',
  Red = 'status__label--red',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormRendererComponent,
    NuverialAccordionComponent,
    NuverialBreadcrumbComponent,
    NuverialSpinnerComponent,
    NuverialIconComponent,
    NuverialButtonComponent,
    NuverialFooterComponent,
  ],
  selector: 'dsg-readonly',
  standalone: true,
  styleUrls: ['./readonly.component.scss'],
  templateUrl: './readonly.component.html',
})
export class ReadonlyComponent {
  public reviewRendererOptions: NuvalenceFormRendererOptions = PublicPortalReviewRendererOptions;

  public transaction$ = this._formRendererService.transaction$;

  public reviewFormFields$?: Observable<IRendererFormConfigurationSchema[]> = this._formRendererService.formConfiguration$.pipe(
    map(formConfigurationModel => formConfigurationModel?.toReviewForm()),
  );

  public formData$?: Observable<Record<string, unknown>> = this.transaction$.pipe(
    map(transactionModel => transactionModel?.data as unknown as Record<string, unknown>),
  );

  constructor(private readonly _formRendererService: FormRendererService) {}
}
