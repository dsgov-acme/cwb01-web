import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConsoleLoggingService } from './adapters/console/console-logging.adapter';
import { LoggingAdapter } from './logging.adapter';

@NgModule({
  declarations: [],
  exports: [],
  imports: [CommonModule],
})
export class SharedUtilsLoggingModule {
  public static useConsoleLoggingAdapter(): ModuleWithProviders<SharedUtilsLoggingModule> {
    return {
      ngModule: SharedUtilsLoggingModule,
      providers: [
        {
          provide: LoggingAdapter,
          useClass: ConsoleLoggingService,
        },
      ],
    };
  }
}
