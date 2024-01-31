/* istanbul ignore file */

import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormioCustomComponent, FormioEvent } from '@dsg/shared/feature/form-nuv';
import { AttributeBaseProperties } from './formio-attribute-base.model';

/**
 * Formio custom component documentation links
 * Angular formio custom components https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options
 * Form builder https://help.form.io/developers/form-builder#overriding-behavior
 * Form builder example json configurations https://formio.github.io/formio.js/app/examples/custombuilder.html
 */

// base components are decorated with @Directive()
@Directive()
export class FormioBaseCustomComponent<ValueT, PropsT extends AttributeBaseProperties> implements FormioCustomComponent<ValueT> {
  /** Required by formIO */
  @Input() public value!: ValueT;
  /** Required by formIO */
  @Output() public readonly valueChange = new EventEmitter<ValueT>();
  /** Required by formIO */
  @Input() public disabled!: boolean;
  /** Required by formIO */
  @Output() public readonly formioEvent = new EventEmitter<FormioEvent>();

  @Input() public key!: string;

  private _props: Partial<PropsT> = {};

  public get props(): Partial<PropsT> {
    return this._props;
  }

  @Input()
  public set props(props: Partial<PropsT>) {
    if (!props) return;
    this._props = props;
  }

  public updateValue(payload: ValueT) {
    this.value = payload; // Should be updated first
    this.valueChange.emit(payload); // Should be called after this.value update
  }
}
