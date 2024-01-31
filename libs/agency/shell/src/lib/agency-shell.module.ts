import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { agencyShellRoutes } from './shell.routes';

@NgModule({
  exports: [RouterModule],
  // initialNavigation: 'enabledNonBlocking || disabled' is used, when using signInWithRedirect, otherwise the redirectResult will be null, because the redirectResult must be gotten before the authGuarded routes.
  imports: [CommonModule, RouterModule.forRoot(agencyShellRoutes, { initialNavigation: 'enabledNonBlocking' })],
})
export class AgencyShellModule {}
