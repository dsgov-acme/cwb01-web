import { SchemaModel } from '@dsg/shared/utils/http';

export interface IDashboardCount {
  tabLabel: string;
  count: number;
}

export class DashboardCountModel implements SchemaModel<IDashboardCount> {
  public tabLabel = '';
  public count = 0;

  constructor(dashboardCountSchema?: IDashboardCount) {
    if (dashboardCountSchema) {
      this.fromSchema(dashboardCountSchema);
    }
  }
  public fromSchema(schema: IDashboardCount): void {
    this.tabLabel = schema.tabLabel;
    this.count = schema.count;
  }

  public toSchema(): IDashboardCount {
    return {
      count: this.count,
      tabLabel: this.tabLabel,
    };
  }
}
