import { TemplateRef } from '@angular/core';

export interface INavigableTab extends INuverialTab {
  relativeRoute: string;
  useTransactionLabel?: boolean;
}

export interface INuverialTab {
  count?: number;
  disabled?: boolean;
  key: string;
  value?: string;
  label: string;
  template?: TemplateRef<unknown>;
  filters?: Map<string, string>;
}

export interface ActiveTabChangeEvent {
  index: number;
  tab: INuverialTab;
}
