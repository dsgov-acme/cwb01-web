import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { axe } from 'jest-axe';
import { of } from 'rxjs';
import { NuverialCardContentDirective } from '../../directives';
import { NuverialValidationErrorType } from '../../models';
import { NuverialCheckboxCardComponent } from './index';
/*
 * The CardDirective is acting as a base class for Radio & Checkbox cards and cannot be
 * instantiated as a component directly. This is testing the async aspects of the card inputs only
 *
 * It's not possible to generate blur events inside the unit test environment.
 * Within the @testing-library/angular framework user events, e.g. click, can cause Jest to
 * throw circular dependency exceptions... hence this code
 */
describe('CheckboxCardAsynCard', () => {
  let component: CheckboxCardTestComponent;
  let fixture: ComponentFixture<CheckboxCardTestComponent>;
  let focusMonitor: FocusMonitor;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxCardTestComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        NuverialCardContentDirective,
        NuverialCheckboxCardComponent,
        SharedUtilsLoggingModule.useConsoleLoggingAdapter(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxCardTestComponent);
    focusMonitor = TestBed.inject(FocusMonitor);
    component = fixture.componentInstance;
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can validate form', () => {
    expect(component).toBeTruthy();
  });

  it('can emit validation error', fakeAsync(() => {
    const checkbox = fixture.debugElement.query(By.css('input'));
    let emitted = false;
    jest.spyOn(focusMonitor, 'monitor').mockReturnValue(of(null));

    fixture.componentInstance.validationErrors.subscribe(error => {
      expect(error).toEqual(expect.arrayContaining([{ required: 'Required' }]));
      emitted = true;
    });
    fixture.detectChanges();
    checkbox.triggerEventHandler('click', null);
    checkbox.triggerEventHandler('click', null);
    fixture.detectChanges();

    tick(1000);
    expect(emitted).toEqual(true);
  }));

  it('can over-ride validation error message', fakeAsync(() => {
    const checkbox = fixture.debugElement.query(By.css('input'));
    let emitted = false;
    fixture.componentInstance.validationMessages = { required: 'override required message' };
    jest.spyOn(focusMonitor, 'monitor').mockReturnValue(of(null));

    fixture.componentInstance.validationErrors.subscribe(error => {
      expect(error).toEqual(expect.arrayContaining([{ required: 'override required message' }]));
      emitted = true;
    });
    fixture.detectChanges();
    checkbox.triggerEventHandler('click', null);
    checkbox.triggerEventHandler('click', null);
    fixture.detectChanges();

    tick(1000);
    expect(emitted).toEqual(true);
  }));

  it('can display validation error message', fakeAsync(() => {
    const checkbox = fixture.debugElement.query(By.css('input'));
    jest.spyOn(focusMonitor, 'monitor').mockReturnValue(of(null));
    fixture.detectChanges();
    fixture.componentInstance.validationErrors.subscribe(error => expect(error).toBeTruthy());
    checkbox.triggerEventHandler('click', null);
    checkbox.triggerEventHandler('click', null);
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('nuverial-form-field-error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent.trim()).toEqual('Required');

    tick(1000);
  }));

  it('can disable validation error message', fakeAsync(() => {
    const checkbox = fixture.debugElement.query(By.css('input'));
    jest.spyOn(focusMonitor, 'monitor').mockReturnValue(of(null));
    fixture.componentInstance.displayError = false;
    fixture.detectChanges();
    checkbox.triggerEventHandler('click', null);
    checkbox.triggerEventHandler('click', null);
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('nuverial-form-field-error'));
    expect(error).toBeFalsy();

    tick(1000);
  }));

  it('can display card content', () => {
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.nuverial-card-content'));
    expect(content).toBeTruthy();
    expect(content.nativeElement.textContent.trim()).toEqual('card content');
  });

  it('can display card title', () => {
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.nuverial-card-title'));
    expect(content).toBeTruthy();
    expect(content.nativeElement.textContent.trim()).toEqual('card title');
  });

  it('can display card image', () => {
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.nuverial-card-image'));
    expect(content).toBeTruthy();
  });
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nuverial-checkbox-card-test',
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  template: `<div [formGroup]="formGroup">
    <nuverial-checkbox-card
      [displayError]="displayError"
      [required]="required"
      [validationMessages]="validationMessages"
      (validationErrors)="onValidationErrors($event)"
      formControlName="testGroupControl"
    >
      <img alt="big ben" nuverialCardContentType="image" src="/assets/images/big-ben.webp" />
      <div nuverialCardContentType="title">card title</div>
      <div nuverialCardContentType="content">card content</div>
    </nuverial-checkbox-card>
  </div>`,
})
class CheckboxCardTestComponent {
  @Input() public displayError = true;
  @Input() public required = true;
  @Input() public validationMessages!: NuverialValidationErrorType;
  @Output() public readonly validationErrors = new EventEmitter<NuverialValidationErrorType[]>();

  public formGroup = new FormGroup({
    testGroupControl: new FormControl({ disabled: false, value: null }),
  });

  public onValidationErrors(event: NuverialValidationErrorType[]) {
    this.validationErrors.emit(event);
  }
}
