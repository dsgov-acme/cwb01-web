import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { EnvironmentTestingModule } from '@dsg/shared/utils/environment';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockService } from 'ng-mocks';

@NgModule({
  exports: [],
  imports: [HttpClientTestingModule, EnvironmentTestingModule],
  providers: [
    {
      provide: LoggingService,
      useValue: MockService(LoggingService),
    },
  ],
})
export class HttpTestingModule {}
