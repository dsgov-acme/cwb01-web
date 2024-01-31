import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface CardChange {
  checked: boolean;
  pointValue?: number;
  value: string;
}

export type CardTypes = 'checkbox' | 'radio';
// Allows radio & checkbox cards to be cast to same base class for use by card-group component
export interface Card {
  cardType: CardTypes;
  change: EventEmitter<CardChange>;
  checked: boolean;
  formControl: FormControl;
  inputId: string | undefined;
  invalid?: boolean;
  markForCheck: () => void;
  pointValue: number;
  value: string;
}
