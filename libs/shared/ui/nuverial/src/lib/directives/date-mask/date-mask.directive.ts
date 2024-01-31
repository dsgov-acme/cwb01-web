import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[nuverialDateMask]',
  standalone: true,
})
export class NuverialDateMaskDirective {
  constructor(private readonly _el: ElementRef) {}

  private readonly _dateRegex = /^(?:\d{1,2}|$)(?:\/|$)(?:\d{1,2}|$)(?:\/|$)(?:\d{1,4}|$)$/;

  @HostListener('beforeinput', ['$event']) public onBeforeInput(event: InputEvent) {
    const input = event?.target as HTMLInputElement;
    const value = input.value;
    const nextCharacter = event.data;
    const selectionEnd = input.selectionEnd ?? value.length;
    const selectionStart = input.selectionStart ?? 0;

    const nextValue = this._getNextValue(value, selectionStart, selectionEnd, nextCharacter);
    const nextValueFormatted = this._formatToDate(nextValue);

    if (!this._dateRegex.test(nextValueFormatted)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) public onInputEvent(event: InputEvent) {
    const input = event?.target as HTMLInputElement;
    const value = input.value;
    const formattedValue = this._formatToDate(value);

    if (this._dateRegex.test(formattedValue)) {
      (this._el.nativeElement as HTMLInputElement).value = formattedValue;
    }
  }

  private _getNextValue(text: string, selectionStrat: number, selectionEnd: number, character: string | null): string {
    return text.slice(0, selectionStrat) + (character ?? '') + text.slice(selectionEnd);
  }

  private _formatToDate(value: string): string {
    if (this._dateRegex.test(value)) {
      return value;
    }

    const slashesCount = (value.match(/\//g) || []).length;

    switch (slashesCount) {
      case 0:
        if (value.length > 2) {
          const nextValue = `${value.slice(0, 2)}/${value.slice(2)}`;

          return this._formatToDate(nextValue);
        }
        break;
      case 1:
        if (value.indexOf('/') === 0) {
          return this._formatToDate(value.slice(1));
        }
        if (value.split('/')[0].length > 2) {
          const nextValue = `${value.split('/')[0].slice(0, 2)}/${value.split('/')[0].slice(2)}/${value.split('/')[1]}`;

          return this._formatToDate(nextValue);
        }
        if (value.split('/')[1].length > 2) {
          const nextValue = `${value.split('/')[0]}/${value.split('/')[1].slice(0, 2)}/${value.split('/')[1].slice(2)}`;

          return this._formatToDate(nextValue);
        }
        break;
      case 2:
        if (value.indexOf('/') === 0) {
          return this._formatToDate(value.slice(1));
        }
        if (value.match(/\/\//g)) {
          const indexOfSlash = value.lastIndexOf('/');
          const nextValue = `${value.slice(0, indexOfSlash - 1)}${value.slice(indexOfSlash)}`;

          return this._formatToDate(nextValue);
        }
        break;
    }

    return value;
  }
}
