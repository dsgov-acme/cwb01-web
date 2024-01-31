import { Route } from '@angular/router';

export const sharedClientAuthenticationRoutes: Route[] = [
  {
    loadComponent: () => import('./components/authentication').then(c => c.AuthenticationComponent),
    path: '',
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
