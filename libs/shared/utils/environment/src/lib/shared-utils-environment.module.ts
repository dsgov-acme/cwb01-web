import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION, IEnvironment } from './environment.model';

@NgModule({
  imports: [CommonModule],
})
export class SharedUtilsEnvironmentModule {
  public static forRoot(environment: IEnvironment): ModuleWithProviders<SharedUtilsEnvironmentModule> {
    return {
      ngModule: SharedUtilsEnvironmentModule,
      providers: [{ provide: ENVIRONMENT_CONFIGURATION, useValue: environment }],
    };
  }
}
