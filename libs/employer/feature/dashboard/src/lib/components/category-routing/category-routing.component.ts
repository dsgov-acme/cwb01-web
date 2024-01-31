import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationSkipped, Router, RouterModule } from '@angular/router';
import { NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';
import { filter, take, tap } from 'rxjs';
import { DashboardService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSpinnerComponent, RouterModule],
  selector: 'dsg-intake-form-router',
  standalone: true,
  styleUrls: ['./category-routing.component.scss'],
  templateUrl: './category-routing.component.html',
})
export class CategoryRoutingComponent implements OnInit {
  public loading = true;

  public loadCategory$ = this._route.paramMap.pipe(
    tap(params => {
      const categoryRoute = params.get('category') ?? '';
      const dashboardCategory = this._dashboardService.getDashboardCategoryByRoute(categoryRoute);

      if (dashboardCategory?.hasTransactionList) {
        this._router.navigate(['transactions'], { relativeTo: this._route });
      } else {
        const subCategory = this._route.snapshot.children[0]?.children[0]?.paramMap.get('subCategory');
        if (subCategory) {
          this._router.navigate([subCategory], { queryParamsHandling: 'merge', relativeTo: this._route });
        } else {
          this._router.navigate([dashboardCategory?.subCategories[0].relativeRoute], { queryParamsHandling: 'merge', relativeTo: this._route });
        }
      }
    }),
  );

  constructor(
    private readonly _dashboardService: DashboardService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
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
}
