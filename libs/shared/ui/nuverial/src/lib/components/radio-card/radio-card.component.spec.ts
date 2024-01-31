import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton, MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { NuverialIconComponent } from '../icon';
import { NuverialRadioCardComponent } from './radio-card.component';

const dependencies = MockBuilder(NuverialRadioCardComponent).keep(MatRadioModule).keep(MatFormFieldModule).keep(NuverialIconComponent).build();

const getFixture = async (props: Record<string, Record<string, string>>) => {
  const { fixture } = await render(NuverialRadioCardComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture, radio: screen.getByRole('radio') };
};

describe('RadioCardComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).not.toHaveNoViolations();
      expect(axeResults.violations[0].id).toEqual('label');
    });

    it('should have no violations when ariaLabel is set', async () => {
      const template = '<nuverial-radio-card value="1"><div nuverialCardContentType="title">Card 1</div></nuverial-radio-card>';
      const { fixture } = await render(template, dependencies);
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can define a default radio card component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
  });

  it('aria-label default', async () => {
    const { radio } = await getFixture({});
    expect(radio.getAttribute('aria-label')).toEqual(null);
  });

  it('can set aria-label', async () => {
    const { radio } = await getFixture({ componentProperties: { ariaLabel: 'testing' } });
    expect(radio.getAttribute('aria-label')).toEqual('testing');
  });

  it('aria-describedby default', async () => {
    const { radio } = await getFixture({});
    expect(radio.getAttribute('aria-describedby')).toEqual(null);
  });

  it('can set aria-describedby', async () => {
    const { radio } = await getFixture({ componentProperties: { ariaDescribedBy: 'testing' } });
    expect(radio.getAttribute('aria-describedby')).toEqual('testing');
  });

  it('checked default', async () => {
    const { radio } = await getFixture({});
    expect(radio.getAttribute('aria-checked')).toEqual(null);
  });

  it('can set checked', async () => {
    const { fixture } = await getFixture({ componentProperties: { checked: 'true' } });
    const radio = fixture.nativeElement.querySelector('mat-radio-button');
    expect(radio.getAttribute('ng-reflect-checked')).toEqual('true');
  });

  it('can set disabled false', async () => {
    const { radio } = await getFixture({});
    expect(radio.getAttribute('disabled')).toEqual(null);
  });

  it('can emit click event', async () => {
    let emitted: unknown = null;
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;
    component.change.subscribe(status => (emitted = status));

    const button = ngMocks.findInstance(MatRadioButton);
    button.checked = true;
    button.value = '1';
    fixture.componentInstance.onChange(new MatRadioChange(button, '1'));

    expect(emitted).toEqual({ checked: true, pointValue: 0, value: '1' });
  });

  it('can emit click event2', async () => {
    let emitted = null;
    const { fixture } = await getFixture({
      componentProperties: {
        checked: 'false',
      },
    });
    const radio = screen.getByRole('radio');
    const component = fixture.componentInstance;
    const changeResult = { checked: true, pointValue: 0, value: undefined };

    jest.spyOn(component, 'onChange');
    jest.spyOn(component.change, 'emit');

    component.change.subscribe(status => (emitted = status));
    radio.click();
    fixture.detectChanges();

    expect(emitted).toEqual(changeResult);
    expect(component.checked).toEqual(true);
    expect(component.onChange).toHaveBeenCalled();
    expect(component.change.emit).toHaveBeenCalledWith(changeResult);
  });
});
