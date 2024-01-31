import { INavigableTab } from '@dsg/shared/ui/nuverial';
import { IDashboardCategory, IDashboardConfiguration } from './dashboard-configuration.model';

export const SubCategoryMock: INavigableTab = {
  key: 'quarterly-tax-wage-report',
  label: 'Quarterly Tax & Wage Report',
  relativeRoute: 'quarterly-tax-wage-report',
  useTransactionLabel: false,
};

export const DashboardCategoryMock: IDashboardCategory = {
  description: 'File quarterly reports, view and print previously-filed reports. tile tax and wage adjustments, elect First Quarter Deferral of taxes',
  icon: 'file_copy',
  name: 'Tax & Wage Reporting',
  route: 'tax-wage-reporting',
  subCategories: [
    { key: 'quarterly-tax-wage-report', label: 'Quarterly Tax & Wage Report', relativeRoute: 'quarterly-tax-wage-report', useTransactionLabel: false },
    { key: 'previously-filed-reports', label: 'Previously-Filed Reports', relativeRoute: 'previously-filed-reports', useTransactionLabel: false },
    { key: 'tax-wage-adjustments', label: 'Tax & Wage Adjustments', relativeRoute: 'tax-wage-adjustments', useTransactionLabel: false },
    { key: 'first-quarter-deferral', label: 'First Quarter Deferral', relativeRoute: 'first-quarter-deferral', useTransactionLabel: false },
  ],
};

export const DashboardCategoryWithListMock: IDashboardCategory = {
  description: 'File quarterly reports, view and print previously-filed reports. tile tax and wage adjustments, elect First Quarter Deferral of taxes',
  hasTransactionList: true,
  icon: 'file_copy',
  name: 'Tax & Wage Reporting',
  route: 'tax-wage-reporting',
  subCategories: [
    { key: 'quarterly-tax-wage-report', label: 'Quarterly Tax & Wage Report', relativeRoute: 'quarterly-tax-wage-report', useTransactionLabel: false },
    { key: 'previously-filed-reports', label: 'Previously-Filed Reports', relativeRoute: 'previously-filed-reports', useTransactionLabel: false },
    { key: 'tax-wage-adjustments', label: 'Tax & Wage Adjustments', relativeRoute: 'tax-wage-adjustments', useTransactionLabel: false },
    { key: 'first-quarter-deferral', label: 'First Quarter Deferral', relativeRoute: 'first-quarter-deferral', useTransactionLabel: false },
  ],
};

export const DashboardCategoriesMock: IDashboardCategory[] = [DashboardCategoryMock];

export const DashboardCategoriesMock2: IDashboardCategory[] = [DashboardCategoryMock, DashboardCategoryWithListMock];

export const DashboardConfigurationMock: IDashboardConfiguration = {
  categories: DashboardCategoriesMock,
};
