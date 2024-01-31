import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IForm, IFormSelectionRule, TransactionDefinitionModel, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { FormDefinitionMetaDataComponent } from '@dsg/shared/feature/form-nuv';
import {
  INuverialSelectOption,
  MarkAllControlsAsTouched,
  NuverialButtonComponent,
  NuverialIconComponent,
  NuverialSelectComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTextInputComponent,
  SplitCamelCasePipe,
} from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Validators } from 'ngx-editor';
import { catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import { FormConfigurationService } from '../form-configurations/form-configurations.service';

export interface FormSelectionRuleTableData extends IFormSelectionRule {
  editing?: boolean;
  selectedOptions?: INuverialSelectOption[];
}
@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NuverialTextInputComponent,
    NuverialSpinnerComponent,
    SplitCamelCasePipe,
    MatTableModule,
    MatSortModule,
    NuverialButtonComponent,
    NuverialIconComponent,
    FormsModule,
    NuverialSelectComponent,
    DragDropModule,
    ReactiveFormsModule,
  ],
  selector: 'dsg-form-selection-rules',
  standalone: true,
  styleUrls: ['./form-selection-rules.component.scss'],
  templateUrl: './form-selection-rules.component.html',
})
export class FormSelectionRulesComponent implements OnInit {
  @Input() public transactionDefinition = new TransactionDefinitionModel();
  @Output() public readonly changeFormSelectionRules = new EventEmitter<IFormSelectionRule[]>();

  public form: FormGroup;

  public displayedColumns = [
    { label: '', sortable: false, value: 'reorder', width: '5%' },
    { label: 'Task Key', sortable: false, value: 'task', width: '21%' },
    { label: 'Viewer', sortable: false, value: 'viewer', width: '21%' },
    { label: 'Context', sortable: false, value: 'context', width: '21%' },
    { label: 'Form Key', sortable: false, value: 'formConfigurationKey', width: '21%' },
    { label: '', sortable: false, value: 'edit', width: '11%' },
  ];
  public displayColumnValues = this.displayedColumns.map(x => x.value);
  public formSelectionRulesList: IFormSelectionRule[] = [];
  public dataSourceTable = new MatTableDataSource<unknown>();
  public dialogRef?: MatDialogRef<FormDefinitionMetaDataComponent>;
  public lastUpdatedDisplay = '';
  public createdByDisplay = '';
  @ViewChild(MatSort) public tableSort!: MatSort;

  public taskOptions$: Observable<INuverialSelectOption[]> = of([]);
  public viewerOptions$: Observable<INuverialSelectOption[]> = of([]);
  public formKeyOptions$: Observable<INuverialSelectOption[]> = of([]);
  public loadForms$: Observable<IForm[]> = of([]);

  public formData$: Observable<{
    taskOptions: INuverialSelectOption[];
    viewerOptions: INuverialSelectOption[];
    formKeyOptions: INuverialSelectOption[];
    loadForms: IForm[];
  }> = of({ formKeyOptions: [], loadForms: [], taskOptions: [], viewerOptions: [] });

  constructor(
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    protected readonly _formConfigurationService: FormConfigurationService,
    protected readonly _userStateService: UserStateService,
    private readonly _formBuilder: FormBuilder,
  ) {
    this.lastUpdatedDisplay = '';
    this.createdByDisplay = '';
    this.form = this._formBuilder.group({
      rules: this._formBuilder.array([]),
    });
  }

  public ngOnInit(): void {
    this.formSelectionRulesList = this.transactionDefinition.formConfigurationSelectionRules;
    this.dataSourceTable = new MatTableDataSource<unknown>(this.formSelectionRulesList);
    this._cdr.markForCheck();

    this.taskOptions$ = this._workApiRoutesService.getWorkflowTasks$(this.transactionDefinition.processDefinitionKey).pipe(
      map(tasks => {
        return tasks.map(task => {
          return { disabled: false, displayTextValue: task.name, key: task.id, selected: false };
        });
      }),
    );

    this.viewerOptions$ = this._workApiRoutesService.getEnumerations$().pipe(
      map(enumerations => {
        return enumerations['user-types'].map(enumeration => {
          return { disabled: false, displayTextValue: enumeration.label, key: enumeration.value, selected: false };
        });
      }),
    );

    this.loadForms$ = this._formConfigurationService.getFormConfigurations$(this.transactionDefinition.key);

    this.formKeyOptions$ = this._formConfigurationService.formConfigurationsList$.pipe(
      map(forms => {
        return forms.map(form => {
          return { disabled: false, displayTextValue: form.name, key: form.key, selected: false };
        });
      }),
    );

    this.formData$ = combineLatest([this.taskOptions$, this.viewerOptions$, this.formKeyOptions$, this.loadForms$]).pipe(
      map(([taskOptions, viewerOptions, formKeyOptions, loadForms]) => ({ formKeyOptions, loadForms, taskOptions, viewerOptions })),
      catchError(_ => {
        this._nuverialSnackBarService.notifyApplicationError('Error loading Form Selection Rules');

        return of({ formKeyOptions: [], loadForms: [], taskOptions: [], viewerOptions: [] });
      }),
    );

    this.form = this._formBuilder.group({
      rules: this._formBuilder.array(
        this.formSelectionRulesList.map(
          rule =>
            new FormGroup({
              context: new FormControl(rule.context),
              formConfigurationKey: new FormControl(rule.formConfigurationKey, [Validators.required]),
              task: new FormControl(rule.task),
              viewer: new FormControl(rule.viewer),
            }),
        ),
      ),
    });

    this.form.valueChanges
      .pipe(
        tap(x => {
          const newFormSelectionRules = x.rules as IFormSelectionRule[];
          this.changeFormSelectionRules.emit(newFormSelectionRules);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  public createNewFormSelectionRule() {
    const newFormSelectionRule: IFormSelectionRule = { context: '', formConfigurationKey: '', task: '', viewer: '' };
    this.formSelectionRulesList.push(newFormSelectionRule);

    const ruleFormGroup = this.form.get('rules') as FormArray;
    ruleFormGroup.push(
      new FormGroup({
        context: new FormControl(''),
        formConfigurationKey: new FormControl('', [Validators.required]),
        task: new FormControl(''),
        viewer: new FormControl(''),
      }),
    );
    MarkAllControlsAsTouched(ruleFormGroup);

    this.dataSourceTable = new MatTableDataSource<unknown>(this.formSelectionRulesList);
    this._cdr.markForCheck();
  }

  public getIndex(element: FormSelectionRuleTableData): number {
    return this.formSelectionRulesList.indexOf(element);
  }

  public getDisplayText(formControlIndex: number, element: string, options?: INuverialSelectOption[]): string {
    const key = (this.form.get('rules') as FormArray).controls[formControlIndex].value[element];

    if (!options) return key;

    const selectedOption = options.find(option => option.key === key);

    return selectedOption ? selectedOption.displayTextValue : '';
  }

  public drop(event: CdkDragDrop<string, string, string>) {
    moveItemInArray(this.formSelectionRulesList, event.previousIndex, event.currentIndex);
    const formArray = this.form.get('rules') as FormArray;
    moveItemInArray(formArray.controls, event.previousIndex, event.currentIndex);
    formArray.updateValueAndValidity();
    this.dataSourceTable = new MatTableDataSource<unknown>(this.formSelectionRulesList);
  }

  public toggleEditing(element: FormSelectionRuleTableData) {
    element.editing = !element.editing;
  }

  public trackByFn(index: number): number {
    return index;
  }
}
