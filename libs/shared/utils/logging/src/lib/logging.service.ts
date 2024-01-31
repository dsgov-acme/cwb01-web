import { Injectable } from '@angular/core';
import { LoggingAdapter } from './logging.adapter';

@Injectable({
  providedIn: 'root',
})
export class LoggingService implements LoggingAdapter {
  constructor(private readonly _loggingAdapter: LoggingAdapter) {}

  public debug(context: string, message: string, ...options: unknown[]): void {
    this._loggingAdapter.debug(context, message, ...options);
  }

  public error(context: string, message: string, ...options: unknown[]): void {
    this._loggingAdapter.error(context, message, ...options);
  }

  public info(context: string, message: string, ...options: unknown[]): void {
    this._loggingAdapter.info(context, message, ...options);
  }

  public log(context: string, message: string, ...options: unknown[]): void {
    this._loggingAdapter.log(context, message, ...options);
  }

  public warn(context: string, message: string, ...options: unknown[]): void {
    this._loggingAdapter.warn(context, message, ...options);
  }
}
