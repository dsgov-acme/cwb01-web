import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISchemaMetaData, ISchemaTreeDefinition, SchemaDefinitionModel } from '@dsg/shared/data-access/work-api';
import { SelectorTabsKeys } from '@dsg/shared/feature/form-nuv';
import {
  FooterAction,
  INuverialBreadCrumb,
  INuverialTab,
  NuverialBreadcrumbComponent,
  NuverialButtonComponent,
  NuverialFooterActionsComponent,
  NuverialIconComponent,
  NuverialJsonEditorWrapperComponent,
  NuverialSelectorButtonComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialSplitAreaComponent,
  StepperFadeInOut,
} from '@dsg/shared/ui/nuverial';
import { FormBuilderComponent as FormIOBuilderComponent, FormioForm, FormioModule, FormioOptions } from '@formio/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, EMPTY, finalize, Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { registerAttributeTypesSelectComponent } from '../../attribute-types-select';
import { registerBigDecimalComponent } from '../../big-decimal';
import { registerBooleanComponent } from '../../boolean';
import { registerDocumentComponent } from '../../document';
import { registerIntegerComponent } from '../../integer';
import { registerListComponent } from '../../list';
import { registerLocalDateComponent } from '../../local-date';
import { registerLocalTimeComponent } from '../../local-time';
import { registerProcessorCheckboxCardsComponent } from '../../processor-checkbox-cards';
import { registerSchemaComponent } from '../../schema';
import { registerSchemaSelectComponent } from '../../schema-select';
import { registerStringComponent } from '../../string';
import { SchemaBuilderHeaderComponent } from '../header/schema-builder-header.component';
import { FORM_BUILDER_OPTIONS } from './schema-builder.model';
import { SchemaBuilderService } from './schema-builder.service';

enum Actions {
  Save = 'save',
  Cancel = 'cancel',
}

@UntilDestroy()
@Component({
  animations: [StepperFadeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormioModule,
    NuverialSplitAreaComponent,
    NuverialSpinnerComponent,
    NuverialBreadcrumbComponent,
    NuverialSelectorButtonComponent,
    NuverialButtonComponent,
    NuverialIconComponent,
    NuverialJsonEditorWrapperComponent,
    NuverialFooterActionsComponent,
    SchemaBuilderHeaderComponent,
  ],
  selector: 'dsg-schema-builder',
  standalone: true,
  styleUrls: ['./schema-builder.component.scss'],
  templateUrl: './schema-builder.component.html',
})
export class SchemaBuilderComponent {
  private readonly _formioDestroy = new Subject<void>();

  @ViewChild('formio') public set formio(component: FormIOBuilderComponent) {
    if (!component) {
      this._formioDestroy.next();
    }

    if (component) {
      this.formioComponent = component;

      component.change
        ?.pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tap((event: any) => {
            if (!['addComponent', 'saveComponent', 'deleteComponent'].includes(event.type)) return;
            if (component.form) {
              this.updateFormRendering(this._schemaBuilderService.toSchemaDefinition(component.form));
            }
          }),
          takeUntil(this._formioDestroy),
          untilDestroyed(this),
        )
        .subscribe();
    }
  }
  public formioComponent: FormIOBuilderComponent | undefined;

  private _schemaKey = '';
  public loading = false;

  public options = FORM_BUILDER_OPTIONS as FormioOptions;
  public metaDataFields$: Observable<ISchemaMetaData> = this._schemaBuilderService.metaDataFields$;
  public form$ = this._schemaBuilderService.schemaBuilderFormFields$;
  public jsonForm: Partial<SchemaDefinitionModel> = {};
  private readonly _updatedJsonForm: SchemaDefinitionModel = new SchemaDefinitionModel();
  public schemaAttributes: ISchemaTreeDefinition[] = [];

  public selectorTabs: INuverialTab[] = [
    { key: 'visual', label: 'Visual' },
    { key: 'json', label: 'JSON' },
  ];

  public breadCrumbs: INuverialBreadCrumb[] = [
    {
      label: 'Back to Schemas',
      navigationPath: '/admin/schemas',
    },
  ];

  public actions: FooterAction[] = [
    {
      key: Actions.Save,
      uiClass: 'Primary',
      uiLabel: 'Save',
    },
    {
      key: Actions.Cancel,
      uiClass: 'Secondary',
      uiLabel: 'Cancel',
    },
  ];

  public selectorTabsKeys = SelectorTabsKeys;
  public currentSelectorTab: string = this.selectorTabs[0].key;

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _route: ActivatedRoute,
    private readonly _injector: Injector,
    private readonly _nuverialSnackbarService: NuverialSnackBarService,
    private readonly _schemaBuilderService: SchemaBuilderService,
  ) {
    registerAttributeTypesSelectComponent(this._injector);
    registerSchemaSelectComponent(this._injector);
    registerProcessorCheckboxCardsComponent(this._injector);

    registerStringComponent(this._injector);
    registerBooleanComponent(this._injector);
    registerIntegerComponent(this._injector);
    registerBigDecimalComponent(this._injector);
    registerLocalDateComponent(this._injector);
    registerLocalTimeComponent(this._injector);
    registerListComponent(this._injector);
    registerSchemaComponent(this._injector);
    registerDocumentComponent(this._injector);
  }

  public loadSchemaTree$ = this._route.paramMap.pipe(
    switchMap(params => {
      this._schemaKey = params.get('schemaKey') ?? '';

      return this._schemaBuilderService.getSchemaTreeByKey$(this._schemaKey);
    }),
    catchError(error => {
      if (error.status < 200 || error.status >= 300) {
        const errorMessage = error.message;
        this._nuverialSnackbarService.notifyApplicationError(errorMessage);

        return EMPTY;
      }
      this._nuverialSnackbarService.notifyApplicationError();

      return EMPTY;
    }),
  );

  public onActionClick(event: string, form: FormioForm): void {
    switch (event) {
      case Actions.Save:
        if (!form.components) return;

        this.loading = true;
        this._cdr.detectChanges();

        this._schemaBuilderService
          .updateSchemaDefinition(form, this._schemaKey)
          .pipe(
            tap(_ => {
              this._nuverialSnackbarService.notifyApplicationSuccess('Schema saved successfully');
            }),
            catchError(error => {
              if (error.status < 200 || error.status >= 300) {
                const errorMessage = error.message;
                this._nuverialSnackbarService.notifyApplicationError(errorMessage);

                return EMPTY;
              }
              this._nuverialSnackbarService.notifyApplicationError();

              return EMPTY;
            }),
            take(1),
            finalize(() => {
              this.loading = false;
              this._cdr.detectChanges();
            }),
          )
          .subscribe();

        break;
      case Actions.Cancel:
        this._schemaBuilderService.discardChanges();
        break;
    }
  }

  public onTabSelect(event: string, formComponents?: FormioForm): void {
    if (event === this.selectorTabsKeys.JSON && formComponents) {
      const schemaDefinitionAttributes = this._schemaBuilderService.toSchemaDefinition(formComponents).attributes;
      schemaDefinitionAttributes.forEach(attribute => {
        delete attribute.concatenatedContentType;
      });
      this.jsonForm = { attributes: schemaDefinitionAttributes };
      this._updatedJsonForm.attributes = schemaDefinitionAttributes;
    } else {
      this.updateFormRendering(this._updatedJsonForm);
    }
    this.currentSelectorTab = event;
  }

  public updateJson(formComponents?: SchemaDefinitionModel) {
    if (!formComponents) return;

    this._updatedJsonForm.attributes = formComponents.attributes;
  }

  public updateFormRendering(formComponents: SchemaDefinitionModel): void {
    this._schemaBuilderService.updateFormComponents(formComponents).pipe(take(1)).subscribe();
  }
}
