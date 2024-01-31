import { TemplateRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export interface IStep {
  form?: AbstractControl;
  template?: TemplateRef<unknown>;
  label: string;
  stepKey: string;
  optional?: boolean;
  state?: 'SAVED' | 'UNLOCKED' | 'LOCKED';
  hidden?: boolean;
}

export interface IStepEvent {
  nextStep: number;
  prevStep: number;
}
