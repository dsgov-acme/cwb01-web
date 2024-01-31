import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { UserHasDataGuardContract } from '@dsg/shared/feature/app-state';
import { employerShellRoutes } from './shell.routes';

@NgModule({
  exports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, RouterModule],
  // initialNavigation: 'enabledNonBlocking || disabled' is used, when using signInWithRedirect, otherwise the redirectResult will be null, because the redirectResult must be gotten before the authGuarded routes.
  imports: [CommonModule, RouterModule.forRoot(employerShellRoutes, { initialNavigation: 'enabledNonBlocking', onSameUrlNavigation: 'reload' })],
  providers: [UserHasDataGuardContract],
})
export class EmployerShellModule {}
