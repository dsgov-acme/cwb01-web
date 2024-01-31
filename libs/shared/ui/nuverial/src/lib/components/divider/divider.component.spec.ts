import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialDividerComponent } from './index';

const dependencies = MockBuilder(NuverialDividerComponent).build();
describe('DividerComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const template = `<nuverial-divider></nuverial-divider>`;
      const { fixture } = await render(template, { ...dependencies });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should have display default', async () => {
    const template = `<nuverial-divider data-testid="divider"></nuverial-divider>`;
    await render(template, { ...dependencies });

    const component = screen.queryByTestId('divider');
    expect(component).not.toHaveClass('nuverial-divider-vertical');
    expect(component).toHaveAttribute('role', expect.stringContaining('separator'));
    expect(component).toHaveAttribute('aria-orientation', expect.stringContaining('horizontal'));
  });

  it('should have vertical display', async () => {
    const template = `<nuverial-divider data-testid="divider" [vertical]='true'></nuverial-divider>`;
    await render(template, { ...dependencies });

    const component = screen.queryByTestId('divider');
    expect(component).toHaveClass('nuverial-divider-vertical');
    expect(component).toHaveAttribute('aria-orientation', expect.stringContaining('vertical'));
  });
});
