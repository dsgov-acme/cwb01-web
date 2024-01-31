import { NgModule } from '@angular/core';
import { ENVIRONMENT_CONFIGURATION } from '../environment.model';
import { SharedUtilsEnvironmentModule } from './../shared-utils-environment.module';
import { mockEnvironment } from './environment.mock';

@NgModule({
  exports: [SharedUtilsEnvironmentModule],
  imports: [SharedUtilsEnvironmentModule],
  providers: [{ provide: ENVIRONMENT_CONFIGURATION, useValue: mockEnvironment }],
})
export class EnvironmentTestingModule {}
