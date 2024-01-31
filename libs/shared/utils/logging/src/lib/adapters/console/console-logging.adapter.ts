import { Injectable } from '@angular/core';
import { LoggingAdapter } from '../../logging.adapter';

@Injectable()
export class ConsoleLoggingService implements LoggingAdapter {
  public debug(context: string, message: string, ...options: unknown[]): void {
    console.debug([context, ...(message ? [message] : []), ...options]);
  }

  public error(context: string, message: string, ...options: unknown[]): void {
    console.error([context, ...(message ? [message] : []), ...options]);
  }

  public info(context: string, message: string, ...options: unknown[]): void {
    console.info([context, ...(message ? [message] : []), ...options]);
  }

  public log(context: string, message: string, ...options: unknown[]): void {
    console.log([context, ...(message ? [message] : []), ...options]);
  }

  public warn(context: string, message: string, ...options: unknown[]): void {
    console.warn([context, ...(message ? [message] : []), ...options]);
  }
}
