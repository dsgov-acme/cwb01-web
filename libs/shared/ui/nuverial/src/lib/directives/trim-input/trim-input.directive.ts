import { Directive, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NuverialTextInputComponent } from '../../components';

@Directive({
  selector: '[nuverialTrimInput]',
  standalone: true,
})
export class NuverialTrimInputDirective implements OnInit {
  constructor(private readonly _host: NuverialTextInputComponent, private readonly _renderer: Renderer2, private readonly _control: NgControl) {}

  public ngOnInit() {
    this._renderer.listen(this._host.inputElementRef.nativeElement, 'focusout', () => {
      this.trimInputValue();
    });
  }

  public trimInputValue() {
    const inputValue = this._host.inputElementRef.nativeElement.value;
    const trimmedValue = inputValue.trim();
    this._renderer.setProperty(this._host.inputElementRef.nativeElement, 'value', trimmedValue);
    if (this._control && this._control.control) {
      this._control.control.setValue(trimmedValue);
    }
  }
}
