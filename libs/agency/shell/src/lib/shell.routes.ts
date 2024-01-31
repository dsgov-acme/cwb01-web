import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot } from '@angular/router';

const redirectAuthenticatedToPreviousPage = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let redirectUrl = '/';
  try {
    const redirectToUrl = new URL(state.url, location.origin);
    const params = new URLSearchParams(redirectToUrl.search);
    redirectUrl = params.get('returnUrl') || '/main/dashboard';
  } catch (err) {
    // invalid URL
  }

  return redirectLoggedInTo(redirectUrl);
};

const redirectUnauthenticatedToLogin = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectUnauthorizedTo(`/login?returnUrl=${state.url}`);
};

export const agencyShellRoutes: Route[] = [
  {
    children: [
      {
        ...canActivate(redirectUnauthenticatedToLogin),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dashboard',
          },
          {
            loadChildren: () => import('@dsg/agency/feature/dashboard').then(module => module.AgencyFeatureDashboardModule),
            path: 'dashboard',
          },
          {
            loadChildren: () => import('@dsg/agency/feature/admin').then(module => module.AgencyFeatureAdminModule),
            path: 'admin',
          },
        ],
        path: '',
      },
      {
        ...canActivate(redirectAuthenticatedToPreviousPage),
        loadChildren: () => import('@dsg/shared/feature/authentication').then(module => module.SharedFeatureAuthenticationModule),
        path: 'login',
      },
      {
        loadComponent: () => import('@dsg/shared/ui/nuverial').then(module => module.UnauthorizedComponent),
        path: 'unauthorized',
      },
    ],
    loadComponent: () => import('./components/shell/shell.component').then(module => module.ShellComponent),
    path: '',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
