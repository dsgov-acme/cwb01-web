import { MatButtonModule } from '@angular/material/button';
import { fireEvent, render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialButtonComponent } from './button.component';

const dependencies = MockBuilder(NuverialButtonComponent).keep(MatButtonModule).build();

const getFixture = async (props: Record<string, Record<string, string>>) => {
  const { fixture } = await render(NuverialButtonComponent, {
    ...dependencies,
    ...props,
  });

  return { button: screen.getByRole('button'), fixture };
};

const getFixtureByTemplate = async (buttonText: string, buttonStyle?: 'filled' | 'outlined' | 'text') => {
  const template = buttonStyle
    ? `<nuverial-button buttonStyle="${buttonStyle}">${buttonText}</nuverial-button>`
    : `<nuverial-button>${buttonText}</nuverial-button>`;
  const { fixture } = await render(template, dependencies);

  return { button: screen.getByRole('button'), fixture };
};

describe('ButtonComponent', () => {
  describe('Accessability', () => {
    it('should have no violations when button text is set', async () => {
      const { fixture } = await getFixtureByTemplate('Button text');
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have violations when button text is not set', async () => {
      const { fixture } = await getFixtureByTemplate('');
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).not.toHaveNoViolations();
    });
  });

  it('can define a default button component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.ariaDescribedBy).toEqual('');
    expect(fixture.componentInstance.ariaLabel).toEqual('');
    expect(fixture.componentInstance.buttonType).toEqual('button');
    expect(fixture.componentInstance.buttonStyle).toEqual('text');
    expect(fixture.componentInstance.colorTheme).toEqual('');
    expect(fixture.componentInstance.disabled).toEqual(false);
    expect(fixture.componentInstance.loading).toEqual(false);
  });

  it('can set aria text label default', async () => {
    const { button } = await getFixture({});
    expect(button.getAttribute('aria-label')).toEqual('');
  });

  it('can set aria text label default value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaLabel: 'testing-label' } });
    expect(button.getAttribute('aria-label')).toEqual('testing-label');
  });

  it('can set aria text label filled', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'filled' } });
    expect(button.getAttribute('aria-label')).toEqual('');
  });

  it('can set aria text label filled value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaLabel: 'testing-label', buttonStyle: 'filled' } });
    expect(button.getAttribute('aria-label')).toEqual('testing-label');
  });

  it('can set aria text label outlined', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'outlined' } });
    expect(button.getAttribute('aria-label')).toEqual('');
  });

  it('can set aria text label outlined value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaLabel: 'testing-label', buttonStyle: 'outlined' } });
    expect(button.getAttribute('aria-label')).toEqual('testing-label');
  });

  it('c aria text label default icon', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'icon' } });
    expect(button.getAttribute('aria-label')).toEqual('');
  });

  it('can set aria text label icon value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaLabel: 'testing-label', buttonStyle: 'icon' } });
    expect(button.getAttribute('aria-label')).toEqual('testing-label');
  });

  it('can set aria describedby default', async () => {
    const { button } = await getFixture({});
    expect(button.getAttribute('aria-describedby')).toEqual('');
  });

  it('can set aria describedby default value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaDescribedBy: 'testing-label' } });
    expect(button.getAttribute('aria-describedby')).toEqual('testing-label');
  });

  it('can set aria describedby filled', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'filled' } });
    expect(button.getAttribute('aria-describedby')).toEqual('');
  });

  it('can set aria describedby filled value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaDescribedBy: 'testing-label', buttonStyle: 'filled' } });
    expect(button.getAttribute('aria-describedby')).toEqual('testing-label');
  });

  it('can set aria describedby outlined', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'outlined' } });
    expect(button.getAttribute('aria-describedby')).toEqual('');
  });

  it('can set aria describedby outlined value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaDescribedBy: 'testing-label', buttonStyle: 'outlined' } });
    expect(button.getAttribute('aria-describedby')).toEqual('testing-label');
  });

  it('aria describedby default icon', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'icon' } });
    expect(button.getAttribute('aria-describedby')).toEqual('');
  });

  it('can set aria-describedby icon value', async () => {
    const { button } = await getFixture({ componentProperties: { ariaDescribedBy: 'testing-label', buttonStyle: 'icon' } });
    expect(button.getAttribute('aria-describedby')).toEqual('testing-label');
  });

  it('can set button type default', async () => {
    const { button } = await getFixture({});
    expect(button.getAttribute('type')).toEqual('button');
  });

  it('can set button type value', async () => {
    const { button } = await getFixture({ componentProperties: { buttonType: 'submit' } });
    expect(button.getAttribute('type')).toEqual('submit');
  });

  it('can set button type value', async () => {
    const { button } = await getFixture({ componentProperties: { buttonType: 'submit' } });
    expect(button.getAttribute('type')).toEqual('submit');
  });

  it('can set button type filled default', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'filled' } });
    expect(button.getAttribute('type')).toEqual('button');
  });

  it('can set button type filled value', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'filled', buttonType: 'submit' } });
    expect(button.getAttribute('type')).toEqual('submit');
  });

  it('can set button type outlined default', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'outlined' } });
    expect(button.getAttribute('type')).toEqual('button');
  });

  it('can set button type outlined value', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'outlined', buttonType: 'submit' } });
    expect(button.getAttribute('type')).toEqual('submit');
  });

  it('can set button type icon default', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'icon' } });
    expect(button.getAttribute('type')).toEqual('button');
  });

  it('can set button type icon value', async () => {
    const { button } = await getFixture({ componentProperties: { buttonStyle: 'icon', buttonType: 'submit' } });
    expect(button.getAttribute('type')).toEqual('submit');
  });

  it('can emit default button click event component', async () => {
    let emitted = false;
    const { button, fixture } = await getFixture({});

    fixture.componentInstance.click.subscribe(() => (emitted = true));
    fireEvent.click(button);
    expect(emitted).toEqual(true);
  });

  it('can emit filled button click event component', async () => {
    let emitted = false;
    const { button, fixture } = await getFixture({ componentProperties: { buttonStyle: 'filled' } });

    fixture.componentInstance.click.subscribe(() => (emitted = true));
    fireEvent.click(button);
    expect(emitted).toEqual(true);
  });

  it('can emit outlined button click event component', async () => {
    let emitted = false;
    const { button, fixture } = await getFixture({ componentProperties: { buttonStyle: 'outlined' } });

    fixture.componentInstance.click.subscribe(() => (emitted = true));
    fireEvent.click(button);
    expect(emitted).toEqual(true);
  });

  it('can emit icon button click event component', async () => {
    let emitted = false;
    const { button, fixture } = await getFixture({ componentProperties: { buttonStyle: 'icon' } });

    fixture.componentInstance.click.subscribe(() => (emitted = true));
    fireEvent.click(button);
    expect(emitted).toEqual(true);
  });

  it('can display default value', async () => {
    const { button } = await getFixtureByTemplate('Default');
    expect(button.textContent).toEqual('Default');
  });

  it('can display filled value', async () => {
    const { button } = await getFixtureByTemplate('Filled', 'filled');
    expect(button.textContent).toEqual('Filled');
  });

  it('can display outlined value', async () => {
    const { button } = await getFixtureByTemplate('Outlined', 'outlined');
    expect(button.textContent).toEqual('Outlined');
  });
});
