import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    children: [
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleAccordionComponent), path: 'accordion' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleButtonComponent), path: 'button' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleCardComponent), path: 'card' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleCardGroupComponent), path: 'card-group' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleCheckboxComponent), path: 'checkbox' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleCheckboxCardComponent), path: 'checkbox-card' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleDatePickerComponent), path: 'datepicker' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleSectionHeaderComponent), path: 'section-header' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleDividerComponent), path: 'divider' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleFileUploadComponent), path: 'file-upload' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleFormFieldErrorComponent), path: 'form-error' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleRadioCardComponent), path: 'radio-card' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleRadioCardComponent), path: 'radio-cards' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleSelectComponent), path: 'select' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleSelectorButtonDropdownComponent), path: 'selector-button' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleSnackBarComponent), path: 'snackbar' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleStepperComponent), path: 'stepper' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleTabsComponent), path: 'tabs' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleTableStyleComponent), path: 'table-style' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleTextInputComponent), path: 'text-input' },
      { loadComponent: () => import('@dsg/dsg-examples/feature-shell').then(m => m.ExampleTextAreaComponent), path: 'text-area' },
    ],
    path: 'examples',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'examples',
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(APP_ROUTES)],
})
export class AppRoutingModule {}
