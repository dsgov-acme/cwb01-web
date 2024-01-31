import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { NuverialTextInputComponent } from '../../components';
import { NuverialDateMaskDirective } from './date-mask.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialDateMaskDirective],
  selector: 'nuverial-test-date-mask',
  template: ` <input data-testid="masked-input" nuverialDateMask /> `,
})
class TestComponent {}

describe('NuverialDateMaskDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NuverialDateMaskDirective, NuverialTextInputComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should add / after entering the date', async () => {
    const input = screen.getByTestId('masked-input');
    await userEvent.type(input, '123');
    expect(input).toHaveValue('12/3');
  });
  it('should add / after entering the date and month', async () => {
    const input = screen.getByTestId('masked-input');
    await userEvent.type(input, '12345');
    expect(input).toHaveValue('12/34/5');
  });
  it("shouldn't add any character after complete date", async () => {
    const input = screen.getByTestId('masked-input');
    await userEvent.type(input, '05181994');
    await userEvent.type(input, '0');
    expect(input).toHaveValue('05/18/1994');
  });
  it("shouldn't allow any other characters beside numbers when the input is empty", async () => {
    const input = screen.getByTestId('masked-input');
    await userEvent.type(input, 'a');
    expect(input).toHaveValue('');
    await userEvent.type(input, '-');
    expect(input).toHaveValue('');
    await userEvent.type(input, '/');
    expect(input).toHaveValue('');
  });

  describe('_formatToDate', () => {
    let directive: NuverialDateMaskDirective;

    beforeEach(() => {
      directive = new NuverialDateMaskDirective(fixture.debugElement);
    });

    it('should correct incorrect date with more than 2 digits for a date', () => {
      const control = '12/3/45';
      const testValue = '123/45';

      expect(directive['_formatToDate'](testValue)).toEqual(control);
    });

    it('should correct remove "/" if it is the starting character', () => {
      const control = '3/45';
      const testValue = '/3/45';

      expect(directive['_formatToDate'](testValue)).toEqual(control);
    });

    it('should correct remove "/" if there are consecutive "/"', () => {
      const control = '3/45';
      const testValue = '3//45';

      expect(directive['_formatToDate'](testValue)).toEqual(control);
    });
  });
});
