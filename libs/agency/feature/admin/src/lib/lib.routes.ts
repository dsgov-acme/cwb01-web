import { Route } from '@angular/router';
import { CanDeactivateFormBuilder } from '@dsg/shared/feature/app-state';
import { FormBuilderComponent } from '@dsg/shared/feature/form-nuv';
import { SchemaBuilderComponent } from '@dsg/shared/feature/schema-nuv';

export const agencyAdminRoutes: Route[] = [
  {
    loadComponent: () => import('./components/dashboard/dashboard.component').then(module => module.DashboardComponent),
    path: '',
  },
  {
    loadComponent: () =>
      import('./components/transaction-definitions/transaction-definitions.component').then(module => module.TransactionDefinitionsComponent),
    path: 'transaction-definitions',
  },
  {
    loadComponent: () =>
      import('./components/transaction-definitions-form/transaction-definitions-form.component').then(module => module.TransactionDefinitionsFormComponent),
    path: 'transaction-definitions/create',
  },
  {
    loadComponent: () =>
      import('./components/transaction-definitions-form/transaction-definitions-form.component').then(module => module.TransactionDefinitionsFormComponent),
    path: 'transaction-definitions/:transactionDefinitionKey',
  },
  {
    loadComponent: () => import('./components/schemas-list/schemas-list.component').then(module => module.SchemasListComponent),
    path: 'schemas',
  },
  {
    loadComponent: () => import('./components/schemas-list/schema-form/schema-form.component').then(module => module.SchemaFormComponent),
    path: 'schemas/create',
  },
  {
    canDeactivate: [CanDeactivateFormBuilder<FormBuilderComponent>],
    loadComponent: () => import('@dsg/shared/feature/form-nuv').then(module => module.FormBuilderComponent),
    path: 'transaction-definitions/:transactionDefinitionKey/:formConfigurationKey',
  },
  {
    canDeactivate: [CanDeactivateFormBuilder<SchemaBuilderComponent>],
    loadComponent: () => import('@dsg/shared/feature/schema-nuv').then(module => module.SchemaBuilderComponent),
    path: 'schemas/:schemaKey',
  },
  { path: '**', redirectTo: '' },
];
