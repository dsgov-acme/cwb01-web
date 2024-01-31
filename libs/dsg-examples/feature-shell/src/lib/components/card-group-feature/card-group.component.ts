import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NuverialContentDirective,
  NuverialCardGroupComponent,
  CardGroupPointChange,
  CardChange,
  NuverialCheckboxCardComponent,
  NuverialFormFieldErrorComponent,
  NuverialValidationErrorType,
  NuverialRadioCardComponent,
} from '@dsg/shared/ui/nuverial';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NuverialContentDirective,
    NuverialCardGroupComponent,
    NuverialCheckboxCardComponent,
    NuverialFormFieldErrorComponent,
    NuverialRadioCardComponent,
  ],
  selector: 'dsg-examples-card-group',
  standalone: true,
  styleUrls: ['./card-group.component.scss'],
  templateUrl: './card-group.component.html',
})
export class ExampleCardGroupComponent {
  public checkboxChanges$!: Observable<CardChange[]>;
  public checkboxPoints$!: Observable<CardGroupPointChange>;
  public checkboxErrors$!: Observable<NuverialValidationErrorType[]>;
  public radioChanges$!: Observable<CardChange[]>;
  public radioErrors$!: Observable<NuverialValidationErrorType[]>;

  public radioGroup = new FormGroup({
    radioControl1: new FormControl({ disabled: false, value: null }, [Validators.min(99), Validators.required]),
  });
  public checkboxControl = new FormControl(null);
  public radioModel = { isValid: null };
  public minPoints = 2;
  public maxPoints = 4;
  public totalPoints = 0;
  public validationMessages = { max: 'Maximum points exceeded', min: 'Minimum points not reached', required: 'Local card required' };

  private readonly _checkboxChanges = new Subject<CardChange[]>();
  private readonly _checkboxPoints = new Subject<CardGroupPointChange>();
  private readonly _checkboxErrors = new Subject<NuverialValidationErrorType[]>();
  private readonly _radioChanges = new Subject<CardChange[]>();
  private readonly _radioErrors = new Subject<NuverialValidationErrorType[]>();

  constructor() {
    this.checkboxChanges$ = this._checkboxChanges.asObservable();
    this.checkboxPoints$ = this._checkboxPoints.asObservable();
    this.checkboxErrors$ = this._checkboxErrors.asObservable();
    this.radioChanges$ = this._radioChanges.asObservable();
    this.radioErrors$ = this._radioErrors.asObservable();
  }

  public onCardGroupChange(event: CardChange[]): void {
    this.totalPoints = 0;
    this._checkboxChanges.next(event);
  }

  public onRadioGroupChange(event: CardChange[]): void {
    this._radioChanges.next(event);
  }

  public onCardChange(_event: CardChange): void {
    // for debug purposes
  }

  public onCheckboxValidationErrors(event: NuverialValidationErrorType[]): void {
    this._checkboxErrors.next(event);
  }

  public onRadioValidationErrors(event: NuverialValidationErrorType[]): void {
    this._radioErrors.next(event);
  }

  public onChangePoints(event: CardGroupPointChange) {
    this._checkboxPoints.next(event);
  }

  public trackByFn(index: number, _item: CardChange) {
    return index;
  }
}
