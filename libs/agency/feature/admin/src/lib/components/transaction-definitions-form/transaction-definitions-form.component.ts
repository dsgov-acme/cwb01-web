import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IFormSelectionRule,
  ISchemaDefinition,
  ISchemasPaginationResponse,
  ITransactionDefinitionsMetaData,
  TransactionDefinitionModel,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import {
  AlphaNumericValidator,
  FooterAction,
  FormErrorsFromGroup,
  IFormError,
  INuverialBreadCrumb,
  INuverialSelectOption,
  MarkAllControlsAsTouched,
  NuverialBreadcrumbComponent,
  NuverialCrudActions,
  NuverialFooterActionsComponent,
  NuverialFormErrorsComponent,
  NuverialSelectComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTextAreaComponent,
  NuverialTextInputComponent,
  NuverialTrimInputDirective,
} from '@dsg/shared/ui/nuverial';
import { Filter, PagingRequestModel } from '@dsg/shared/utils/http';
import { catchError, combineLatest, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { FormConfigurationsComponent } from '../form-configurations/form-configurations.component';
import { FormSelectionRulesComponent } from '../form-selection-rules/form-selection-rules.component';
import { TransactionDefinitionsFormService } from './transaction-definitions-form.service';
enum Actions {
  create = 'create',
  edit = 'edit',
  cancel = 'cancel',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NuverialBreadcrumbComponent,
    NuverialTextAreaComponent,
    NuverialTextInputComponent,
    ReactiveFormsModule,
    NuverialFooterActionsComponent,
    NuverialFormErrorsComponent,
    NuverialSelectComponent,
    NuverialSpinnerComponent,
    FormConfigurationsComponent,
    NuverialTrimInputDirective,
    FormSelectionRulesComponent,
  ],
  selector: 'dsg-transaction-definitions-form',
  standalone: true,
  styleUrls: ['./transaction-definitions-form.component.scss'],
  templateUrl: './transaction-definitions-form.component.html',
})
export class TransactionDefinitionsFormComponent {
  @Input() public metaData?: ITransactionDefinitionsMetaData;
  public formGroup: FormGroup;
  public formErrors: IFormError[] = [];
  private readonly _pagingRequestModel: PagingRequestModel = new PagingRequestModel({ pageSize: 50 });
  private _transactionDefinitionKey = '';
  public mode = NuverialCrudActions.CREATE;
  public formModeEnum = NuverialCrudActions;
  public transactionSearchLoading = false;

  public breadcrumbs: INuverialBreadCrumb[] = [{ label: 'Back to Transaction Definitions', navigationPath: '/admin/transaction-definitions' }];
  public actions: FooterAction[] = [
    {
      key: Actions.create,
      uiClass: 'Primary',
      uiLabel: 'Save',
    },
    {
      key: Actions.cancel,
      uiClass: 'Secondary',
      uiLabel: 'Cancel',
    },
  ];
  public formConfigs = {
    category: {
      id: 'transaction-definition-form-category',
      label: 'Category',
    },
    description: {
      id: 'transaction-definition-form-description',
      label: 'Description',
    },
    key: {
      id: 'transaction-definition-key',
      label: 'Key',
    },
    name: {
      id: 'transaction-definition-form-name',
      label: 'Name',
    },
    processDefinitionKey: {
      id: 'transaction-definition-form-process-definition-key',
      label: 'Workflow',
    },
    schemaKey: {
      id: 'transaction-definition-form-schema-key',
      label: 'Schema',
    },
  };

  public transactionDefinition$: Observable<TransactionDefinitionModel> = this._route.paramMap.pipe(
    switchMap(params => {
      this._transactionDefinitionKey = params.get('transactionDefinitionKey') ?? '';

      if (!this._transactionDefinitionKey) return of(new TransactionDefinitionModel());

      this.mode = NuverialCrudActions.UPDATE;
      this.formGroup.get('key')?.disable();

      this.actions = [
        {
          key: Actions.edit,
          uiClass: 'Primary',
          uiLabel: 'Save Changes',
        },
      ];

      return this._workApiRoutesService.getTransactionDefinitionByKey$(this._transactionDefinitionKey).pipe(
        catchError(_error => {
          this._nuverialSnackBarService.notifyApplicationError();
          this.navigateToTransactionDefinitions();

          return EMPTY;
        }),
      );
    }),
    tap(transactionDefinition => {
      this.formGroup.patchValue({
        category: transactionDefinition.category,
        defaultFormConfigurationKey: transactionDefinition.defaultFormConfigurationKey,
        description: transactionDefinition.description,
        formConfigurationSelectionRules: transactionDefinition.formConfigurationSelectionRules,
        key: transactionDefinition.key,
        name: transactionDefinition.name,
        processDefinitionKey: transactionDefinition.processDefinitionKey,
        schemaKey: transactionDefinition.schemaKey,
      });
    }),
  );

  public schemaOptions$: Observable<INuverialSelectOption[]> = this.transactionDefinition$.pipe(
    switchMap(value =>
      this.getSchemasList$([
        { field: 'key', value: value.schemaKey },
        { field: 'name', value: value.schemaKey },
      ]),
    ),
    switchMap(_ => this._transactionDefinitionsFormService.schemas$),
    map(x =>
      x.map(schemaDefinition => ({
        disabled: false,
        displayTextValue: schemaDefinition.name,
        key: schemaDefinition.key,
        selected: false,
      })),
    ),
    catchError(_ => {
      this._nuverialSnackBarService.notifyApplicationError();

      return EMPTY;
    }),
  );

  public workflowOptions$: Observable<INuverialSelectOption[]> = this._workApiRoutesService.getWorkflowsList$(this._pagingRequestModel).pipe(
    map(x =>
      x.items.map(workflow => ({
        disabled: false,
        displayTextValue: workflow.name,
        key: workflow.processDefinitionKey,
        selected: false,
      })),
    ),
    catchError(_ => {
      this._nuverialSnackBarService.notifyApplicationError();

      return EMPTY;
    }),
  );

  public formData$: Observable<{
    schemaOptions: INuverialSelectOption[];
    workflowOptions: INuverialSelectOption[];
    transactionDefinition: TransactionDefinitionModel;
  }> = combineLatest([this.schemaOptions$, this.workflowOptions$, this.transactionDefinition$]).pipe(
    map(([schemaOptions, workflowOptions, transactionDefinition]) => ({ schemaOptions, transactionDefinition, workflowOptions })),
  );

  public getSchemasList$(filters?: Filter[]): Observable<ISchemasPaginationResponse<ISchemaDefinition>> {
    return this._transactionDefinitionsFormService.loadSchemas$(filters, this._pagingRequestModel);
  }

  constructor(
    private readonly _router: Router,
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _route: ActivatedRoute,
    private readonly _transactionDefinitionsFormService: TransactionDefinitionsFormService,
  ) {
    this.formGroup = new FormGroup({
      category: new FormControl(this.metaData?.category, [Validators.maxLength(200), Validators.required]),
      defaultFormConfigurationKey: new FormControl(this.metaData?.defaultFormConfigurationKey),
      description: new FormControl(this.metaData?.description, [Validators.maxLength(200)]),
      formConfigurationSelectionRules: new FormControl(this.metaData?.formConfigurationSelectionRules),
      key: new FormControl(this.metaData?.key, [Validators.maxLength(200), Validators.required, AlphaNumericValidator()]),
      name: new FormControl(this.metaData?.name, [Validators.maxLength(200), Validators.required]),
      processDefinitionKey: new FormControl(this.metaData?.processDefinitionKey, [Validators.required]),
      schemaKey: new FormControl(this.metaData?.schemaKey, [Validators.required]),
    });
  }

  public saveTransactionDefinition(crudAction: NuverialCrudActions) {
    this.formErrors = [];
    if (!this.formGroup.valid) {
      this.formErrors = FormErrorsFromGroup(this.formGroup, this.formConfigs);
      MarkAllControlsAsTouched(this.formGroup);

      return;
    }

    const formValue = this.formGroup.value;
    const transactionDefinitionModel = new TransactionDefinitionModel();

    transactionDefinitionModel.category = formValue.category;
    transactionDefinitionModel.description = formValue.description || '';
    transactionDefinitionModel.key = this.mode === NuverialCrudActions.CREATE ? formValue.key : this._transactionDefinitionKey;
    transactionDefinitionModel.name = formValue.name;
    transactionDefinitionModel.processDefinitionKey = formValue.processDefinitionKey;
    transactionDefinitionModel.schemaKey = formValue.schemaKey;
    transactionDefinitionModel.defaultStatus = 'draft';
    transactionDefinitionModel.defaultFormConfigurationKey = formValue.defaultFormConfigurationKey || '';
    transactionDefinitionModel.formConfigurationSelectionRules = formValue.formConfigurationSelectionRules || [];

    let observableCall: Observable<TransactionDefinitionModel> = EMPTY;
    switch (crudAction) {
      case NuverialCrudActions.CREATE:
        observableCall = this._workApiRoutesService.createTransactionDefinition$(transactionDefinitionModel);
        break;
      case NuverialCrudActions.UPDATE:
        observableCall = this._workApiRoutesService.updateTransactionDefinition$(transactionDefinitionModel.key, transactionDefinitionModel);
        break;
    }
    observableCall
      .pipe(
        tap(_ => {
          this._nuverialSnackBarService.notifyApplicationSuccess();
          this._router.navigate(['/admin', 'transaction-definitions', transactionDefinitionModel.key]);
        }),
        catchError(_error => {
          if (crudAction === NuverialCrudActions.CREATE && _error.status === 409 && _error?.error?.messages?.[0]?.includes('already exists')) {
            this.formGroup.controls['key'].setErrors({ keyExists: true });
            this.formErrors = FormErrorsFromGroup(this.formGroup, this.formConfigs);
            MarkAllControlsAsTouched(this.formGroup);
          } else {
            this._nuverialSnackBarService.notifyApplicationError();
          }

          return EMPTY;
        }),
        take(1),
      )
      .subscribe();
  }

  public handleSearchSchema(search: string) {
    if (search) {
      this.transactionSearchLoading = true;
      const filters = [
        { field: 'key', value: search.replace(/\s/g, '') },
        { field: 'name', value: search },
      ];

      this.getSchemasList$(filters)
        .pipe(
          take(1),
          tap(() => {
            this.transactionSearchLoading = false;
          }),
        )
        .subscribe();
    }
  }

  public handleClearSchema() {
    this.formGroup.patchValue({ schemaKey: '' });
  }

  public handleClearWorkflow() {
    this.formGroup.patchValue({ processDefinitionKey: '' });
  }

  public handleChangeDefaultFormConfiguration(defaultFormConfigurationKey: string) {
    this.formGroup.patchValue({ defaultFormConfigurationKey: defaultFormConfigurationKey });
  }

  public handleChangeFormSelectionRules(formConfigurationSelectionRules: IFormSelectionRule[]) {
    this.formGroup.patchValue({ formConfigurationSelectionRules: formConfigurationSelectionRules });
  }

  public navigateToTransactionDefinitions() {
    this._router.navigate(['/admin', 'transaction-definitions']);
  }

  public onActionClick(event: string) {
    switch (event) {
      case Actions.create:
        this.saveTransactionDefinition(NuverialCrudActions.CREATE);
        break;
      case Actions.edit:
        this.saveTransactionDefinition(NuverialCrudActions.UPDATE);
        break;
      case Actions.cancel:
        this.navigateToTransactionDefinitions();
        break;
    }
  }
}
