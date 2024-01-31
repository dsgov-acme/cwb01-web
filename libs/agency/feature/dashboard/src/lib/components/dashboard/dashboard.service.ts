import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DashboardCountModel, DashboardModel, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, of, switchMap, tap } from 'rxjs';

const TRANSACTION_SET_STORAGE_KEY = 'transactionSet';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _dashboards: BehaviorSubject<DashboardModel[]> = new BehaviorSubject<DashboardModel[]>([]);

  constructor(
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  public getDashboards$(): Observable<DashboardModel[]> {
    if (this._dashboards.value.length) {
      return of(this._dashboards.value);
    }

    return this._workApiRoutesService.getDashboards$().pipe(
      tap(dashboards => {
        this._dashboards.next(dashboards);
      }),
    );
  }

  public loadDashboard$() {
    return combineLatest([
      this.getDashboards$(),
      this._activatedRoute.queryParamMap.pipe(
        map(params => {
          let transactionSet = params.get('transactionSet') ?? '';
          if (!transactionSet) {
            transactionSet = localStorage.getItem(TRANSACTION_SET_STORAGE_KEY) ?? '';
            this._router.navigate([], {
              queryParams: { transactionSet: transactionSet } as Params,
              queryParamsHandling: 'merge',
              relativeTo: this._activatedRoute,
            });
          }

          return transactionSet;
        }),
        distinctUntilChanged(),
      ),
    ]).pipe(
      switchMap(([dashboards, transactionSet]) => {
        if (!dashboards.length) return of(undefined);

        const selectedDashboard = dashboards.find(dashboard => dashboard.transactionSet === transactionSet);
        if (!transactionSet || !selectedDashboard) {
          if (localStorage.getItem(TRANSACTION_SET_STORAGE_KEY)) {
            this._router.navigate([], {
              queryParams: {
                transactionSet: localStorage.getItem(TRANSACTION_SET_STORAGE_KEY),
              } as Params,
              queryParamsHandling: 'merge',
              relativeTo: this._activatedRoute,
            });

            return of(dashboards.find(dashboard => dashboard.transactionSet === localStorage.getItem(TRANSACTION_SET_STORAGE_KEY)));
          } else {
            this._router.navigate([], {
              queryParams: {
                transactionSet: dashboards[0].transactionSet,
              } as Params,
              queryParamsHandling: 'merge',
              relativeTo: this._activatedRoute,
            });

            return of(dashboards[0]);
          }
        }

        localStorage.setItem(TRANSACTION_SET_STORAGE_KEY, transactionSet);

        return of(selectedDashboard);
      }),
    );
  }

  public getDashboardTabCount$(key: string): Observable<DashboardCountModel[]> {
    return this._workApiRoutesService.getDashboardCounts$(key);
  }

  public cleanUp() {
    this._dashboards.next([]);
  }
}
