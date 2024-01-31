import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { NuverialValidationErrorType } from '../../models';
import { NuverialTextAreaComponent } from './text-area.component';

const VALIDATION_MESSAGES = { email: 'Local invalid email address', required: 'Email address is required' };

const getFixture = async (props: Record<string, Record<string, unknown>>, inputString?: string) => {
  const { detectChanges, fixture } = await render(TextAreaTestComponent, {
    imports: [SharedUtilsLoggingModule.useConsoleLoggingAdapter()],
    ...props,
  });

  if (inputString) {
    await userEvent.type(screen.getByRole('textbox'), inputString);
    detectChanges();
  }

  return { fixture, textArea: fixture.componentInstance.textAreaComponent };
};

describe('TextAreaComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'Aria label' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).not.toHaveNoViolations();
    });
  });

  it('can create a default TextAreaComponent component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.textAreaComponent).toBeTruthy();
  });

  it('default aria-label', async () => {
    const { fixture, textArea } = await getFixture({});
    expect(textArea.ariaLabel).toBeFalsy();

    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).toBeTruthy();
    expect(textarea.nativeElement.getAttribute('aria-label')).toBeFalsy();
  });

  it('can set aria-label', async () => {
    const { fixture, textArea } = await getFixture({ componentProperties: { ariaLabel: 'testing' } });
    expect(textArea.ariaLabel).toEqual('testing');

    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).toBeTruthy();
    expect(textarea.nativeElement.getAttribute('aria-label')).toEqual('testing');
  });

  it('default disabled', async () => {
    const { fixture, textArea } = await getFixture({});
    expect(textArea.disabled).toBeFalsy();

    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect((textarea.nativeElement as HTMLInputElement).disabled).toBe(false);
  });

  it('can set disabled', async () => {
    const { fixture, textArea } = await getFixture({ componentProperties: { disabled: true } });
    expect(textArea.disabled).toEqual(true);
    const input = fixture.debugElement.query(By.css('nuverial-text-area'));
    expect(input.nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
  });

  it('default hint', async () => {
    const { textArea } = await getFixture({});
    expect(textArea.hint).toBeFalsy();
    expect(() => screen.getByText('test hint')).toThrow();
  });

  it('can set hint', async () => {
    const { textArea } = await getFixture({ componentProperties: { hint: 'test hint' } });
    expect(textArea.hint).toBeTruthy();
    expect(screen.getByText('test hint').textContent).toEqual('test hint');
  });

  it('default maxLength', async () => {
    const { textArea } = await getFixture({});
    expect(textArea.maxlength).toEqual(524288);
    expect(() => screen.getByText('0/10')).toThrow();
  });

  it('can set maxLength', async () => {
    const { textArea } = await getFixture({ componentProperties: { maxlength: 10 } });
    expect(textArea.maxlength).toEqual(10);
    expect(screen.getByText('0/10').textContent).toEqual('0/10');
  });

  it('updates the max length hint as text is entered', async () => {
    const { fixture, textArea } = await getFixture({ componentProperties: { maxlength: 10 } });

    const textAreaNativeElelement = fixture.nativeElement.querySelector('textarea');
    textAreaNativeElelement.value = '';
    let textValue = '';

    for (let i = 1; i <= textArea.maxlength; i++) {
      textValue += 'a';
      textAreaNativeElelement.value = textValue;
      textAreaNativeElelement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const hint = fixture.nativeElement.querySelector('mat-hint');
      expect(hint.innerHTML).toEqual(`${i}/${textArea.maxlength}`);
    }
  });

  it('should update the value when text is entered', async () => {
    const { fixture, textArea } = await getFixture({ componentProperties: { maxlength: 10 } });

    const textAreaNativeElelement = fixture.nativeElement.querySelector('textarea');
    textAreaNativeElelement.value = 'some text';
    textAreaNativeElelement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(textArea.value).toBe('some text');
  });

  it('default placeHolder', async () => {
    const { textArea } = await getFixture({});
    expect(textArea.placeholder).toBeFalsy();
    expect(() => screen.getByText('test place holder')).toThrow();
  });

  it('can set placeHolder', async () => {
    const { fixture, textArea } = await getFixture({ componentProperties: { placeholder: 'test place holder' } });
    expect(textArea.placeholder).toEqual('test place holder');

    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.nativeElement.getAttribute('placeholder')).toEqual('test place holder');
  });

  it('default autoSize', async () => {
    const { textArea } = await getFixture({});
    expect(textArea.autoSize).toBeFalsy();
  });

  it('should not increment the height of the textbox when autoSize is false', async () => {
    const { fixture } = await getFixture({});
    const textAreaNativeElelement = fixture.nativeElement.querySelector('textarea');
    const originalHeight = textAreaNativeElelement.height;
    textAreaNativeElelement.value = '\n\n\n\n\n\n\n\n\n\n\n';
    textAreaNativeElelement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(textAreaNativeElelement.height).toBe(originalHeight);
  });

  // TODO: Create test to show how the height of the text area increases
  // if autoSize is set to true. Currently there is a problem setting the
  // property in the tests

  it('default required', async () => {
    const { fixture, textArea } = await getFixture({});
    expect(textArea.required).toEqual(false);

    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.nativeElement.getAttribute('aria-required')).toEqual('false');
  });

  it('can set required', async () => {
    const { fixture, textArea } = await getFixture({ componentProperties: { required: true } });
    expect(textArea.required).toEqual(true);

    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.nativeElement.getAttribute('aria-required')).toEqual('true');
  });

  it('default validationMessages', async () => {
    const { textArea } = await getFixture({});
    expect(textArea.validationMessages).toBeFalsy();
  });

  it('can set validationMessages', async () => {
    const { textArea } = await getFixture({ componentProperties: { validationMessages: VALIDATION_MESSAGES } });
    expect(textArea.validationMessages).toEqual(VALIDATION_MESSAGES);
  });

  it('expect required default validation message', fakeAsync(async () => {
    let emitted = null;
    const { textArea } = await getFixture({});

    textArea.error$.subscribe(errors => (emitted = errors));

    screen.getByRole('textbox').focus();
    screen.getByRole('button').focus();
    tick(100);
    expect(emitted).toEqual('Required');
  }));
});

// Cannot create NgControl so testing via intermediary
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, TextFieldModule, NuverialTextAreaComponent],
  selector: 'nuverial-text-area-test',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  template: `<button type="button">Button text</button
    ><nuverial-text-area
      [ariaLabel]="ariaLabel"
      [autoSize]="autoSize"
      [disabled]="disabled"
      [formControl]="formControl"
      [hint]="hint"
      [maxlength]="maxlength"
      [placeholder]="placeholder"
      [required]="required"
      [validationMessages]="validationMessages"
    ></nuverial-text-area>`,
})
class TextAreaTestComponent {
  @Input() public ariaLabel!: string;
  @Input() public disabled = false;
  @Input() public hint!: string;
  @Input() public maxlength!: number;
  @Input() public autoSize = false;
  @Input() public placeholder!: string;
  @Input() public required = false;
  @Input() public formControl: FormControl = new FormControl({ disabled: false, value: null }, [Validators.required]);
  @Input() public validationMessages!: NuverialValidationErrorType;
  @ViewChild(NuverialTextAreaComponent, { static: true }) public textAreaComponent!: NuverialTextAreaComponent;
}
