import { DashboardModel } from './dashboard.model';

import { DashboardMock } from './dashboard.mock';

describe('DashboardModel', () => {
  let dashboardModel: DashboardModel;

  beforeEach(() => {
    dashboardModel = new DashboardModel(DashboardMock);
  });

  describe('fromSchema', () => {
    test('should set all public properties', () => {
      expect(dashboardModel.columns).toEqual(DashboardMock.columns);
      expect(dashboardModel.dashboardLabel).toEqual(DashboardMock.dashboardLabel);
      expect(dashboardModel.menuIcon).toEqual(DashboardMock.menuIcon);
      expect(dashboardModel.tabs).toEqual(DashboardMock.tabs);
      expect(dashboardModel.transactionDefinitionKeys).toEqual(DashboardMock.transactionDefinitionKeys);
      expect(dashboardModel.transactionSet).toEqual(DashboardMock.transactionSet);
    });
  });

  test('toSchema', () => {
    expect(dashboardModel.toSchema()).toEqual(DashboardMock);
  });
});
