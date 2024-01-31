import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { NuverialIconComponent } from '../icon';
import { INuverialBreadCrumb } from './breadcrumb.model';
/***
 *
 * Basic breadcrumb component that displays text and navigates to the page using routing
 *
 *
 * ## Usage
 *
 * ```
 * import { NuverialBreadcrumbComponent, INuverialBreadCrumb } from '@dsg/shared/ui/nuverial';
 *
 * breadCrumbs: INuverialBreadCrumb[] = [
 * { label: 'Transaction Definition', navigationPath: '/admin/transaction-definitions' },
 * { label: '', navigationPath: '/admin/transaction-definitions' },
 *  ];
 *
 * <nuverial-breadcrumb [breadcrumbs]='breadCrumbs'></nuverial-breadcrumb>
 * ```
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatFormFieldModule, NuverialIconComponent],
  selector: 'nuverial-breadcrumb',
  standalone: true,
  styleUrls: ['./breadcrumb.component.scss'],
  templateUrl: './breadcrumb.component.html',
})
export class NuverialBreadcrumbComponent {
  private _breadCrumbs!: INuverialBreadCrumb[];

  @Input()
  public set breadCrumbs(value: INuverialBreadCrumb[]) {
    this._breadCrumbs = value;
  }

  public get breadCrumbs(): INuverialBreadCrumb[] {
    return this._breadCrumbs;
  }

  public navigate(navigationPath: string) {
    this._router.navigate([navigationPath]);
  }

  constructor(private readonly _router: Router) {}

  public trackByFn(index: number): number {
    return index;
  }
}
