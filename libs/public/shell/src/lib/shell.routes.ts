import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot } from '@angular/router';
import { UserHasDataGuard } from '@dsg/shared/feature/app-state';

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

export const publicShellRoutes: Route[] = [
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
            canActivate: [UserHasDataGuard],
            loadChildren: () => import('@dsg/public/feature/dashboard').then(module => module.PublicFeatureDashboardModule),
            path: 'dashboard',
          },
          {
            loadChildren: () => import('@dsg/public/feature/profile').then(module => module.PublicFeatureProfileModule),
            path: 'profile',
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
