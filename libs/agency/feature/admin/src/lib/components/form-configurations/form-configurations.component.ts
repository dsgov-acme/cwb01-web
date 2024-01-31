import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormConfigurationTableData, IForm, IFormMetaData, TransactionDefinitionModel } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { FormDefinitionMetaDataComponent } from '@dsg/shared/feature/form-nuv';
import {
  NuverialButtonComponent,
  NuverialIconComponent,
  NuverialRadioButtonComponent,
  NuverialRadioCardComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTextInputComponent,
  SplitCamelCasePipe,
} from '@dsg/shared/ui/nuverial';
import { EMPTY, Observable, catchError, filter, finalize, take, tap } from 'rxjs';
import { FormConfigurationService } from './form-configurations.service';
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
    NuverialRadioCardComponent,
    NuverialRadioButtonComponent,
    MatDialogModule,
  ],
  providers: [DatePipe],
  selector: 'dsg-form-configurations',
  standalone: true,
  styleUrls: ['./form-configurations.component.scss'],
  templateUrl: './form-configurations.component.html',
})
export class FormConfigurationsComponent implements OnInit {
  @Input() public transactionDefinition = new TransactionDefinitionModel();
  @Input() public metaData?: IFormMetaData | null;
  @Output() public readonly changeDefaultFormConfiguration = new EventEmitter<string>();
  public displayedColumns = [
    { label: 'Default', sortable: false, value: 'default', width: '10%' },
    { label: 'Form Key', sortable: false, value: 'key', width: '30%' },
    { label: 'Form Name', sortable: false, value: 'name', width: '30%' },
    { label: 'Description', sortable: false, value: 'description', width: '30%' },
  ];
  public displayColumnValues = this.displayedColumns.map(x => x.value);
  public searchInput = new FormControl();
  public formConfigurationList: IForm[] = [];
  public formConfigurationListIsLoading = true;
  public dataSourceTable = new MatTableDataSource<unknown>();
  public formConfigurationsList$: Observable<IForm[]>;
  public loadForms$: Observable<IForm[]>;

  public loading = false;
  public dialogRef?: MatDialogRef<FormDefinitionMetaDataComponent>;
  public lastUpdatedDisplay = '';
  public createdByDisplay = '';
  @ViewChild(MatSort) public tableSort!: MatSort;

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    protected readonly _formConfigurationService: FormConfigurationService,
    protected readonly _userStateService: UserStateService,
  ) {
    this.formConfigurationsList$ = new Observable<IForm[]>();
    this.loadForms$ = new Observable<IForm[]>();
    this.lastUpdatedDisplay = '';
    this.createdByDisplay = '';
  }

  public ngOnInit(): void {
    this.loadForms$ = this._formConfigurationService.getFormConfigurations$(this.transactionDefinition.key);

    this.formConfigurationsList$ = this._formConfigurationService.formConfigurationsList$.pipe(
      tap(x => {
        this.formConfigurationListIsLoading = false;
        this.formConfigurationList = x;
        this._buildDataSourceTable();
      }),
      catchError(_ => {
        this.formConfigurationListIsLoading = false;
        this._cdr.markForCheck();
        this._nuverialSnackBarService.notifyApplicationError();

        return EMPTY;
      }),
    );
  }

  private async _buildDataSourceTable(): Promise<void> {
    const formConfigurationTableData: FormConfigurationTableData[] = [];
    if (this.formConfigurationList) {
      for (const formConfiguration of this.formConfigurationList) {
        const item: FormConfigurationTableData = {
          ...formConfiguration,
        };
        formConfigurationTableData.push(item);
      }
      this.dataSourceTable = new MatTableDataSource<unknown>(formConfigurationTableData);
      this._cdr.detectChanges();
    }
  }

  public navigateToBuilder(key: string) {
    this._router.navigate(['/admin', 'transaction-definitions', this.transactionDefinition.key, key]);
  }

  public setDefaultFormConfiguration(formConfigurationKey: string) {
    this.changeDefaultFormConfiguration.emit(formConfigurationKey);
  }

  public trackByFn(index: number): number {
    return index;
  }

  public open = (): void => {
    this.dialogRef = this._dialog.open(FormDefinitionMetaDataComponent, {
      autoFocus: false,
      data: {
        mode: 'Create',
        schemaKey: this.transactionDefinition.schemaKey,
        transactionDefinitionKey: this.transactionDefinition.key,
      },
      disableClose: false,
    });
    this.dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter(_response => _response.metaData),
        tap(_response => {
          this._formConfigurationService.notifyNewFormConfig(_response.metaData);
          this.metaData = _response.metaData;
          this._buildDataSourceTable();
        }),
        catchError(error => {
          if (error.status < 200 || error.status >= 300) {
            this._nuverialSnackBarService.notifyApplicationError();
          }

          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
          this._cdr.detectChanges();
        }),
      )
      .subscribe();
  };
}
