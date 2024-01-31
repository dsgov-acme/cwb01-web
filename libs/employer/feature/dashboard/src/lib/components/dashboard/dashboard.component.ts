import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { UserEmployerProfileModel } from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import {
  ConfirmationModalComponent,
  ConfirmationModalReponses,
  NuverialDashboardCardComponent,
  NuverialDashboardCardsGroupComponent,
  NuverialSelectorButtonDropdownComponent,
  NuverialSnackBarService,
} from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, Observable, catchError, of, switchMap, take, tap } from 'rxjs';
import { IDashboardCategory } from '../../models/dashboard-configuration.model';
import { DashboardService } from '../../services';
@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NuverialDashboardCardComponent,
    NuverialDashboardCardsGroupComponent,
    CommonModule,
    NuverialSelectorButtonDropdownComponent,
    ConfirmationModalComponent,
    MatSelectModule,
    MatDialogModule,
  ],
  selector: 'dsg-dashboard',
  standalone: true,
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public readonly cards$: Observable<IDashboardCategory[]> = of(this._dashboardService.getDashboardCategories());
  public employerProfilesMap: Map<string, string> = new Map();
  public currentEmployer = '';
  public selectedEmployerId = '';
  public employerProfiles$: Observable<UserEmployerProfileModel[]> = this._userStateService.userEmployerProfiles$.pipe(
    tap((profiles: UserEmployerProfileModel[]) => {
      this.employerProfilesMap.clear();
      profiles.forEach(profile => {
        this.employerProfilesMap.set(profile.id, profile.displayName);
      });
    }),
    catchError(error => {
      this._nuverialSnackBarService.notifyApplicationError(error);

      return of([]);
    }),
  );
  constructor(
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _dashboardService: DashboardService,
    private readonly _userStateService: UserStateService,
    private readonly _dialog: MatDialog,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._userStateService.userProfile$
      .pipe(
        tap((profile: UserEmployerProfileModel | undefined) => {
          if (profile) {
            this.currentEmployer = profile.displayName;
            this.selectedEmployerId = profile.id;
            this._cdr.markForCheck();
          }
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }
  public trackByFn(index: number): number {
    return index;
  }
  public onEmployerSelect(selectedEmployerId: string): void {
    this._dialog
      .open(ConfirmationModalComponent, {
        data: {
          contentText: 'Are you sure you want to switch Employers?',
          primaryAction: 'Confirm',
          secondaryAction: 'Cancel',
          title: 'Confirm Employer Selection',
        },
      })
      .afterClosed()
      .pipe(
        switchMap(response => {
          if (response === ConfirmationModalReponses.PrimaryAction) {
            this._userStateService.setCurrentEmployerId(selectedEmployerId);
            this._cdr.markForCheck();

            return EMPTY;
          } else {
            this.selectedEmployerId = this._userStateService.getCurrentEmployerId() || this.selectedEmployerId;
            this._cdr.markForCheck();

            return EMPTY;
          }
        }),
        catchError(_ => {
          this._nuverialSnackBarService.notifyApplicationError('An error occurred while switching profiles.');

          return EMPTY;
        }),
        take(1),
      )
      .subscribe();
  }
}
