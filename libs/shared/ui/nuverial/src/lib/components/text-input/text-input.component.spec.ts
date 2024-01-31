import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NuverialValidationErrorType } from '../../models';
import { NuverialFormFieldErrorComponent } from '../form-field-error';
import { NuverialIconComponent } from '../icon';
import { NuverialTextInputComponent } from './text-input.component';

const VALIDATION_MESSAGES = { email: 'Local invalid email address', required: 'Email address is required' };

const getFixture = async (props: Record<string, Record<string, unknown>>, inputString?: string) => {
  const { detectChanges, fixture } = await render(TextInputTestComponent, {
    imports: [SharedUtilsLoggingModule.useConsoleLoggingAdapter()],
    ...props,
  });

  if (inputString) {
    await userEvent.type(screen.getByRole('textbox'), inputString);
    detectChanges();
  }

  return { fixture, textInput: fixture.componentInstance.textInputComponent };
};

describe('TextInputComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when label is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { label: 'Input label' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'Aria label' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have violations prefix when icon aria label is not set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'Aria label', prefixIcon: 'search_outlined' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).not.toHaveNoViolations();
    });

    it('should have no violations prefix when icon aria label is not set', async () => {
      const { fixture } = await getFixture({
        componentProperties: { ariaLabel: 'Aria label', prefixAriaLabel: 'prefix-aria-label', prefixIcon: 'search_outlined' },
      });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have violations suffix when icon aria label is not set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'Aria label', suffixIcon: 'search_outlined' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).not.toHaveNoViolations();
    });

    it('should have no violations suffix when icon aria label is not set', async () => {
      const { fixture } = await getFixture({
        componentProperties: { ariaLabel: 'Aria label', suffixAriaLabel: 'suffix-aria-label', suffixIcon: 'search_outlined' },
      });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can create a default TextInputComponent component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.textInputComponent).toBeTruthy();
  });

  it('default aria-label', async () => {
    const { fixture, textInput } = await getFixture({});
    expect(textInput.ariaLabel).toBeFalsy();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.getAttribute('aria-label')).toBeFalsy();
  });

  it('can set aria-label', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { ariaLabel: 'testing' } });
    expect(textInput.ariaLabel).toEqual('testing');

    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.getAttribute('aria-label')).toEqual('testing');
  });

  it('default disabled', async () => {
    const { fixture, textInput } = await getFixture({});
    expect(textInput.disabled).toBeFalsy();

    const input = fixture.debugElement.query(By.css('input'));
    expect((input.nativeElement as HTMLInputElement).disabled).toBe(false);
  });

  it('can set disabled', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { disabled: true } });
    expect(textInput.disabled).toEqual(true);
    const input = fixture.debugElement.query(By.css('nuverial-text-input'));
    expect(input.nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
  });

  it('default hint', async () => {
    const { textInput } = await getFixture({});
    expect(textInput.hint).toBeFalsy();
    expect(() => screen.getByText('test hint')).toThrow();
  });

  it('can set hint', async () => {
    const { textInput } = await getFixture({ componentProperties: { hint: 'test hint' } });
    expect(textInput.hint).toBeTruthy();
    expect(screen.getByText('test hint').textContent).toEqual('test hint');
  });

  it('default label', async () => {
    const { textInput } = await getFixture({});
    expect(textInput.label).toBeFalsy();
    expect(() => screen.getByText('test input label')).toThrow();
  });

  it('can set label', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { label: 'test input label' } });
    expect(textInput.label).toEqual('test input label');
    expect(screen.getByText('test input label').textContent).toEqual('test input label');

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-label')).toEqual('test input label');
  });

  it('default maxLength', async () => {
    const { textInput } = await getFixture({});
    expect(textInput.label).toBeFalsy();
    expect(() => screen.getByText('0/10')).toThrow();
  });

  it('can set maxLength', async () => {
    const { textInput } = await getFixture({ componentProperties: { maxlength: 10 } });
    expect(textInput.maxlength).toEqual(10);
    expect(screen.getByText('0/10').textContent).toEqual('0/10');
  });

  it('default placeHolder', async () => {
    const { textInput } = await getFixture({});
    expect(textInput.label).toBeFalsy();
    expect(() => screen.getByText('test place holder')).toThrow();
  });

  it('can set placeHolder', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { placeholder: 'test place holder' } });
    expect(textInput.placeholder).toEqual('test place holder');

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('placeholder')).toEqual('test place holder');
  });

  it('default prefixIcon', async () => {
    const { textInput } = await getFixture({});
    expect(textInput.prefixIcon).toBeFalsy();
    expect(() => screen.getByText('search_outlined')).toThrow();
  });

  it('can set prefixIcon', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { prefixAriaLabel: 'prefix-aria-label', prefixIcon: 'search_outlined' } });
    expect(textInput.prefixIcon).toEqual('search_outlined');
    const button = fixture.debugElement.query(By.css('mat-icon'));
    expect(button.nativeElement.getAttribute('ng-reflect-font-icon')).toEqual('search_outlined');
  });

  it('default required', async () => {
    const { fixture, textInput } = await getFixture({});
    expect(textInput.required).toEqual(false);

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-required')).toEqual('false');
  });

  it('can set required', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { required: true } });
    expect(textInput.required).toEqual(true);

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-required')).toEqual('true');
  });

  it('default suffixIcon', async () => {
    const { textInput } = await getFixture({});

    expect(textInput).toBeTruthy();
    expect(textInput.suffixIcon).toBeFalsy();
    expect(() => screen.getByText('search_outlined')).toThrow();
  });

  it('can set suffixIcon', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { suffixAriaLabel: 'suffix-aria-label', suffixIcon: 'search_outlined' } });
    expect(textInput.suffixIcon).toEqual('search_outlined');
    const button = fixture.debugElement.query(By.css('mat-icon'));
    expect(button.nativeElement.getAttribute('ng-reflect-font-icon')).toEqual('search_outlined');
  });

  it('default tooltip', async () => {
    const { textInput } = await getFixture({});
    expect(textInput.tooltip).toBeFalsy();
    expect(() => screen.getByText('search_outlined')).toThrow();
  });

  it('can set tooltip', async () => {
    const { textInput } = await getFixture({ componentProperties: { tooltip: 'test tooltip' } });
    expect(textInput.tooltip).toEqual('test tooltip');
  });

  it('default type', async () => {
    const { fixture, textInput } = await getFixture({});
    expect(textInput.type).toEqual('text');

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('type')).toEqual('text');
  });

  it('set type', async () => {
    const { fixture, textInput } = await getFixture({ componentProperties: { type: 'date' } });
    expect(textInput.type).toEqual('date');

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('type')).toEqual('date');
  });

  it('default validationMessages', async () => {
    const { textInput } = await getFixture({});
    expect(textInput.validationMessages).toBeFalsy();
  });

  it('can set validationMessages', async () => {
    const { textInput } = await getFixture({ componentProperties: { validationMessages: VALIDATION_MESSAGES } });
    expect(textInput.validationMessages).toEqual(VALIDATION_MESSAGES);
  });

  it('should set the mask pattern', async () => {
    const { textInput } = await getFixture({
      componentProperties: {
        maskPattern: '(000) 000-0000',
      },
    });
    expect(textInput.maskPattern).toEqual('(000) 000-0000');
  });

  it('should format input with dynamic mask pattern', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        maskPattern: '(000) 000-0000',
      },
    });

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('ng-reflect-mask-expression')).toEqual('(000) 000-0000');
  });

  it('expect required default validation message', fakeAsync(async () => {
    let emitted = null;
    const { textInput } = await getFixture({});

    textInput.error$.subscribe(errors => (emitted = errors));

    screen.getByRole('textbox').focus();
    screen.getByRole('button').focus();
    tick(100);
    expect(emitted).toEqual('Required');
  }));

  it('expect invalid default validation message', async () => {
    let emitted!: string;
    const { textInput } = await getFixture({}, 'emailaddress');

    textInput.error$.subscribe(errors => (emitted = errors));
    screen.getByRole('textbox').focus();
    screen.getByRole('button').focus();
    expect(emitted).toEqual('Invalid email address');
  });

  it('expect required default validation message', async () => {
    const { textInput } = await getFixture({}, 'emailaddress');

    textInput.error$.subscribe(error => {
      expect(error).toEqual('Invalid email address');
    });
    screen.getByRole('textbox').focus();
    screen.getByRole('button').focus();
  });

  it('expect required application validation message', async () => {
    const { textInput } = await getFixture({ componentProperties: { validationMessages: VALIDATION_MESSAGES } }, 'emailaddress');

    textInput.error$.subscribe(error => {
      expect(error).toEqual('Local invalid email address');
    });
    screen.getByRole('textbox').focus();
    screen.getByRole('button').focus();
  });

  it('should set the type to text if there is no type', async () => {
    const { fixture } = await getFixture({ componentProperties: { type: undefined } });
    const input = fixture.debugElement.query(By.css('input'));

    expect(input.nativeElement.getAttribute('type')).toEqual('text');
    expect(fixture).toBeTruthy();
  });

  describe('input type password', () => {
    it('should create if password visible', async () => {
      const { fixture } = await getFixture({ componentProperties: { togglePassword: true, type: 'password' } });
      const input = fixture.debugElement.query(By.css('input'));

      expect(input.nativeElement.getAttribute('type')).toEqual('password');
      expect(fixture).toBeTruthy();
    });

    it('should create if password is not visible', async () => {
      const { fixture } = await getFixture({ componentProperties: { togglePassword: false, type: 'password' } });
      const input = fixture.debugElement.query(By.css('input'));

      expect(input.nativeElement.getAttribute('type')).toEqual('password');
      expect(fixture).toBeTruthy();
    });

    it('should toggle between password and text if password is visible and user clicks on icon', async () => {
      const { fixture } = await getFixture({ componentProperties: { togglePassword: true, type: 'password' } });

      const input = fixture.debugElement.query(By.css('input'));
      const button = fixture.nativeElement.querySelector('nuverial-button[matsuffix]');

      expect(input.nativeElement.getAttribute('type')).toEqual('password');

      await userEvent.click(button);
      fixture.detectChanges();

      expect(input.nativeElement.getAttribute('type')).toEqual('text');
    });
  });
});

// Cannot create NgControl so testing via intermediary
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    NuverialFormFieldErrorComponent,
    NuverialIconComponent,
    NuverialTextInputComponent,
    NgxMaskPipe,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  selector: 'nuverial-text-input-test',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  template: `<button type="button">Button text</button
    ><nuverial-text-input
      [ariaLabel]="ariaLabel"
      [disabled]="disabled"
      [formControl]="inputTextFormControl"
      [hint]="hint"
      [label]="label"
      [maskPattern]="maskPattern"
      [maxlength]="maxlength"
      [placeholder]="placeholder"
      [prefixAriaLabel]="prefixAriaLabel"
      [prefixIcon]="prefixIcon"
      [required]="required"
      [suffixAriaLabel]="suffixAriaLabel"
      [suffixIcon]="suffixIcon"
      [togglePassword]="togglePassword"
      [tooltip]="tooltip"
      [type]="type"
      [validationMessages]="validationMessages"
    ></nuverial-text-input>`,
})
class TextInputTestComponent {
  @Input() public ariaLabel!: string;
  @Input() public disabled = false;
  @Input() public hint!: string;
  @Input() public label!: string;
  @Input() public maskPattern!: string;
  @Input() public maxlength!: number;
  @Input() public placeholder!: string;
  @Input() public prefixIcon!: string;
  @Input() public prefixAriaLabel!: string;
  @Input() public required = false;
  @Input() public suffixIcon!: string;
  @Input() public suffixAriaLabel!: string;
  @Input() public tooltip?: string;
  @Input() public type: 'date' | 'text' = 'text';
  @Input() public validationMessages!: NuverialValidationErrorType;
  @Input() public togglePassword?: boolean;
  @ViewChild(NuverialTextInputComponent, { static: true }) public textInputComponent!: NuverialTextInputComponent;
  public inputTextFormControl = new FormControl({ disabled: false, value: '' }, [Validators.email, Validators.required]);
}
