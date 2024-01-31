import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IFormMetaData } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { NuverialButtonComponent, NuverialIconComponent, NuverialSnackBarService, NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';
import { EMPTY, catchError, filter, firstValueFrom, switchMap, take, tap } from 'rxjs';
import { FormBuilderService } from '../../../services';
import { FormDefinitionMetaDataComponent } from '../form-definition-metadata/form-definition-metadata.component';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, NuverialSpinnerComponent, NuverialIconComponent, NuverialButtonComponent],
  selector: 'dsg-builder-header',
  standalone: true,
  styleUrls: ['./builder-header.component.scss'],
  templateUrl: './builder-header.component.html',
})
export class BuilderHeaderComponent implements OnChanges {
  constructor(
    private readonly _dialog: MatDialog,
    private readonly _cdr: ChangeDetectorRef,
    protected readonly _userStateService: UserStateService,
    protected readonly _formBuilderService: FormBuilderService,
    protected readonly _nuverialSnackBarService: NuverialSnackBarService,
  ) {
    this.lastUpdatedDisplay = '';
    this.createdByDisplay = '';
  }

  @Input() public metaData?: IFormMetaData | null;
  public lastUpdatedDisplay = '';
  public createdByDisplay = '';
  public loading = false;
  public dialogRef?: MatDialogRef<FormDefinitionMetaDataComponent>;
  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['metaData']?.currentValue && this.metaData) {
      await this.updateLastUpdatedBy();
      await this.updateCreatedBy();
      this._cdr.detectChanges();
    }
  }

  public async updateLastUpdatedBy(): Promise<void> {
    if (this.metaData) {
      const lastUpdatedByUser = await firstValueFrom(this._userStateService.getUserById$(this.metaData.lastUpdatedBy ?? ''));
      if (lastUpdatedByUser?.displayName && this.metaData.lastUpdatedBy !== lastUpdatedByUser.displayName) {
        this.lastUpdatedDisplay = lastUpdatedByUser.displayName;
        this._cdr.detectChanges();
      }
    }
  }
  public async updateCreatedBy(): Promise<void> {
    if (this.metaData) {
      const createdByUser = await firstValueFrom(this._userStateService.getUserById$(this.metaData.createdBy ?? ''));
      if (createdByUser?.displayName && this.metaData.lastUpdatedBy !== createdByUser.displayName) {
        this.createdByDisplay = createdByUser.displayName;
      }
    }
  }
  public open(): void {
    if (!this.metaData) {
      return;
    }
    this.metaData.mode = 'Update';
    this.dialogRef = this._dialog.open(FormDefinitionMetaDataComponent, {
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
        switchMap(afterClosedResponse => this._formBuilderService.updateMetaData(afterClosedResponse.metaData)),
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
        }),
      )
      .subscribe();
  }
}
