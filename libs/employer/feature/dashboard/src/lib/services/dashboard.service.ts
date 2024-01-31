import { Injectable } from '@angular/core';
import { INavigableTab } from '@dsg/shared/ui/nuverial';
import { BehaviorSubject } from 'rxjs';
import { DashboardConfiguration, IDashboardCategory, IDashboardConfiguration } from '../models/dashboard-configuration.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _dashboardConfiguration: IDashboardConfiguration = DashboardConfiguration;
  private readonly _currentDashboardSubCategories = new BehaviorSubject<INavigableTab[]>([]);

  public getDashboardConfiguration(): IDashboardConfiguration {
    return this._dashboardConfiguration;
  }

  public getDashboardCategories(): IDashboardCategory[] {
    return this._dashboardConfiguration.categories;
  }

  public getDashboardCategoryByRoute(route: string): IDashboardCategory | undefined {
    const dashboardCategory = this._dashboardConfiguration.categories.find(category => category.route === route);
    if (dashboardCategory) {
      this._currentDashboardSubCategories.next(dashboardCategory.subCategories);
    }

    return dashboardCategory;
  }

  public getCurrentDashboardSubCategories(): INavigableTab[] {
    return this._currentDashboardSubCategories.getValue();
  }
}
