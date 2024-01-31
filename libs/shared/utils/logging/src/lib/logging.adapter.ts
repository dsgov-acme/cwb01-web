import { Injectable } from '@angular/core';

@Injectable()
export abstract class LoggingAdapter {
  public abstract debug(context: string, message: string, ...options: unknown[]): void;
  public abstract error(context: string, message: string, ...options: unknown[]): void;
  public abstract info(context: string, message: string, ...options: unknown[]): void;
  public abstract log(context: string, message: string, ...options: unknown[]): void;
  public abstract warn(context: string, message: string, ...options: unknown[]): void;
}
