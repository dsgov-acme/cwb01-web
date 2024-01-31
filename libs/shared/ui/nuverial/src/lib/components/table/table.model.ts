export interface IDisplayedColumn {
  label: string;
  sortable: boolean;
  attributePath: string;
  width?: `${string}%`;
  type?: IColumnType;
  icon?: string;
}

export type IColumnType = 'default' | 'priority' | 'pill' | 'icon' | 'datetime' | 'actions';

export interface IPriorityColumn {
  class: string;
  icon: string;
  value: string;
}

export interface ITableAction {
  icon: string;
  id: string;
  accessLevel?: string;
}

export interface ITableActionEvent {
  action: string;
  column: unknown;
}
