import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationSkipped, Router, RouterModule } from '@angular/router';
import { FormRendererComponent, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { INuverialBreadCrumb, NuverialBreadcrumbComponent, NuverialSnackBarService, NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';
import { catchError, EMPTY, filter, switchMap, take, tap } from 'rxjs';
import { IntakeFormComponent } from '../intake/intake-form.component';
import { ReadonlyComponent } from '../readonly';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormRendererComponent, NuverialSpinnerComponent, NuverialBreadcrumbComponent, RouterModule, IntakeFormComponent, ReadonlyComponent],
  selector: 'dsg-intake-form-router',
  standalone: true,
  styleUrls: ['./transaction-routing.component.scss'],
  templateUrl: './transaction-routing.component.html',
})
export class TransactionRoutingComponent implements OnInit, OnDestroy {
  private readonly _resume = this._route.snapshot.queryParams['resume'];
  public breadCrumbs: INuverialBreadCrumb[] = [{ label: 'Dashboard', navigationPath: '/dashboard' }];
  public loading = true;
  public loadTransactionDetails$ = this._route.paramMap.pipe(
    switchMap(params => {
      const transactionId = params.get('transactionId') ?? '';

      return this._formRendererService.loadTransactionDetails$(transactionId);
    }),
    catchError(_error => {
      this._nuverialSnackBarService.notifyApplicationError();

      return EMPTY;
    }),
    tap(([_, transactionModel]) => {
      if (transactionModel.activeTasks.length) {
        const editExtras = this._resume === 'true' ? { queryParams: { resume: this._resume }, replaceUrl: true } : { replaceUrl: true };
        this._router.navigate(['/dashboard', 'transaction', transactionModel.id], editExtras);
      } else {
        this._router.navigate(['/dashboard', 'transaction', transactionModel.id, 'readonly'], { replaceUrl: true });
      }
    }),
  );

  constructor(
    private readonly _formRendererService: FormRendererService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    // Prevent flickering of the child component before navigation finishes
    this._router.events
      .pipe(
        // NavigationSkipped the base route or refresh, NavigationEnd for all other child routes
        filter(e => e instanceof NavigationEnd || e instanceof NavigationSkipped),
        tap(() => {
          this.loading = false;
          this._changeDetectorRef.markForCheck();
        }),
        take(1),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this._formRendererService.cleanUp();
  }
}
