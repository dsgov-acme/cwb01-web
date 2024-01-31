import { SchemaModel } from '@dsg/shared/utils/http';

export interface DashboardColumn {
  columnLabel: string;
  attributePath: string;
  sortable: boolean;
  displayFormat?: 'DATETIME' | 'USERDATA' | 'PRIORITY';
}

interface Tab {
  tabLabel: string;
  filter: object;
}

export interface IDashboard {
  transactionSet: string;
  dashboardLabel: string;
  menuIcon: string;
  transactionDefinitionKeys: string[];
  columns: DashboardColumn[];
  tabs: Tab[];
}

export class DashboardModel implements SchemaModel<IDashboard, Partial<IDashboard>> {
  public transactionSet = '';
  public dashboardLabel = '';
  public menuIcon = '';
  public transactionDefinitionKeys: string[] = [];
  public columns: DashboardColumn[] = [];
  public tabs: Tab[] = [];

  constructor(dashboardSchema?: IDashboard) {
    if (dashboardSchema) {
      this.fromSchema(dashboardSchema);
    }
  }

  public fromSchema(dashboardSchema: IDashboard) {
    this.transactionSet = dashboardSchema.transactionSet;
    this.dashboardLabel = dashboardSchema.dashboardLabel;
    this.menuIcon = dashboardSchema.menuIcon;
    this.transactionDefinitionKeys = dashboardSchema.transactionDefinitionKeys;
    this.columns = dashboardSchema.columns;
    this.tabs = dashboardSchema.tabs;
  }

  public toSchema(): Partial<IDashboard> {
    return {
      columns: this.columns,
      dashboardLabel: this.dashboardLabel,
      menuIcon: this.menuIcon,
      tabs: this.tabs,
      transactionDefinitionKeys: this.transactionDefinitionKeys,
      transactionSet: this.transactionSet,
    };
  }
}
