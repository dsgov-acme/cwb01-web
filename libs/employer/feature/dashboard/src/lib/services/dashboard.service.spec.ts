import { DashboardConfiguration } from '../models/dashboard-configuration.model';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the dashboard configuration', () => {
    const config = service.getDashboardConfiguration();
    expect(config).toEqual(DashboardConfiguration);
  });

  it('should return a dashboard category by route and update the current subcategories subject', () => {
    const spy = jest.spyOn(service['_currentDashboardSubCategories'], 'next');
    const route = DashboardConfiguration.categories[0].route;
    const category = service.getDashboardCategoryByRoute(route);
    expect(spy).toHaveBeenCalledWith(DashboardConfiguration.categories[0].subCategories);
    expect(category).toEqual(DashboardConfiguration.categories[0]);
  });

  it('should return undefined when getting a category by a non-existent route', () => {
    const spy = jest.spyOn(service['_currentDashboardSubCategories'], 'next');
    const category = service.getDashboardCategoryByRoute('non-existent-route');
    expect(spy).not.toHaveBeenCalled();
    expect(category).toBeUndefined();
  });

  it('should return the dashboard categories', () => {
    const categories = service.getDashboardCategories();
    expect(categories).toEqual(DashboardConfiguration.categories);
  });

  it('should return the current dashboard subcategories', () => {
    service['_currentDashboardSubCategories'].next(DashboardConfiguration.categories[0].subCategories);
    const subCategories = service.getCurrentDashboardSubCategories();
    expect(subCategories).toEqual(DashboardConfiguration.categories[0].subCategories);
  });
});
