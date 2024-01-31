import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { MockBuilder } from 'ng-mocks';
import { axe } from 'jest-axe';
import { NuverialCardComponent } from './index';

const dependencies = MockBuilder(NuverialCardComponent).build();

describe('CardComponent', () => {
  const titleContent = 'title content';
  const cardContent = 'card content';
  const footerContent = 'footer content';

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await render(NuverialCardComponent, { ...dependencies });
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should display empty card', async () => {
    const template = `<nuverial-card data-testid="test-card"></nuverial-card>`;
    await render(template, { ...dependencies });
    const component = screen.queryByTestId('test-card');
    expect(component).toBeTruthy();
    expect(() => screen.getByText(titleContent)).toThrow();
    expect(() => screen.getByText(cardContent)).toThrow();
    expect(() => screen.getByText(footerContent)).toThrow();
  });

  it('should display card with content', async () => {
    const template = `<nuverial-card data-testid="test-card">
        <div nuverialCardContentType="title">${titleContent}</div>
        <div nuverialCardContentType="content">${cardContent}</div>
        <div nuverialCardContentType="footer">${footerContent}</div>
      </nuverial-card>`;
    await render(template, { ...dependencies });
    expect(screen.getByText(titleContent)).toBeInTheDocument();
    expect(screen.getByText(cardContent)).toBeInTheDocument();
    expect(screen.getByText(footerContent)).toBeInTheDocument();
  });
});
