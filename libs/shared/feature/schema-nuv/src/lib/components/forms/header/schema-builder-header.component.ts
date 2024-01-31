import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ISchemaMetaData } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialButtonComponent, NuverialIconComponent, NuverialSnackBarService, NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';
import { EMPTY, catchError, filter, firstValueFrom, switchMap, take, tap } from 'rxjs';
import { SchemaBuilderService } from '../builder/schema-builder.service';
import { SchemaDefinitionMetaDataComponent } from '../schema-definition-metadata/schema-definition-metadata.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, NuverialSpinnerComponent, NuverialIconComponent, NuverialButtonComponent],
  selector: 'dsg-schema-builder-header',
  standalone: true,
  styleUrls: ['./schema-builder-header.component.scss'],
  templateUrl: './schema-builder-header.component.html',
})
export class SchemaBuilderHeaderComponent implements OnChanges {
  constructor(
    private readonly _dialog: MatDialog,
    private readonly _cdr: ChangeDetectorRef,
    protected readonly _userStateService: UserStateService,
    protected readonly _schemaBuilderService: SchemaBuilderService,
    protected readonly _nuverialSnackBarService: NuverialSnackBarService,
  ) {
    this.lastUpdatedDisplay = '';
    this.createdByDisplay = '';
  }

  @Input() public metaData?: ISchemaMetaData | null;
  public lastUpdatedDisplay = '';
  public createdByDisplay = '';
  public loading = false;
  public status = '';
  public dialogRef?: MatDialogRef<SchemaDefinitionMetaDataComponent>;
  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['metaData']?.currentValue && this.metaData) {
      await this.updateLastUpdatedBy();
      await this.updateCreatedBy();
      this._cdr.detectChanges();
    }
  }

  public async updateLastUpdatedBy(): Promise<void> {
    if (this.metaData) {
      this.lastUpdatedDisplay = await firstValueFrom(this._userStateService.getUserDisplayName$(this.metaData.lastUpdatedBy ?? ''));
      this._cdr.detectChanges();
    }
  }

  public async updateCreatedBy(): Promise<void> {
    if (this.metaData) {
      this.createdByDisplay = await firstValueFrom(this._userStateService.getUserDisplayName$(this.metaData.createdBy ?? ''));
      this._cdr.detectChanges();
    }
  }

  public open(): void {
    if (!this.metaData) {
      return;
    }
    this.dialogRef = this._dialog.open(SchemaDefinitionMetaDataComponent, {
      autoFocus: false,
      data: this.metaData,
      disableClose: false,
    });
    this.dialogRef
      .afterClosed()
      .pipe(
        filter(afterClosedResponse => afterClosedResponse.metaData && afterClosedResponse.save === true),
        tap(() => {
          this.loading = true;
          this._cdr.detectChanges();
        }),
        switchMap(afterClosedResponse => this._schemaBuilderService.updateMetaData(afterClosedResponse.metaData)),
        take(1),
        catchError(error => {
          this.loading = false;
          this._cdr.detectChanges();
          if (error.status < 200 || error.status >= 300) {
            this._nuverialSnackBarService.notifyApplicationError();
          }

          return EMPTY;
        }),
        tap(async updateMetaDataResponse => {
          this.metaData = updateMetaDataResponse;
          await this.updateLastUpdatedBy();
          this.loading = false;
          this._cdr.detectChanges();
          this._nuverialSnackBarService.notifyApplicationSuccess();
        }),
      )
      .subscribe();
  }
}
