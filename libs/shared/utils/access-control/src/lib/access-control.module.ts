import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthorizedDirective } from './directives/authorized/authorized.directive';
import { UnauthorizedDirective } from './directives/unauthorized/unauthorized.directive';
import { AccessControlGuardContract } from './guards/access-control.guard';

@NgModule({
  declarations: [AuthorizedDirective, UnauthorizedDirective],
  exports: [AuthorizedDirective, UnauthorizedDirective],
  imports: [CommonModule],
})
export class AccessControlModule {
  public static forRoot(): ModuleWithProviders<AccessControlModule> {
    return {
      ngModule: AccessControlModule,
      providers: [AccessControlGuardContract],
    };
  }
}
