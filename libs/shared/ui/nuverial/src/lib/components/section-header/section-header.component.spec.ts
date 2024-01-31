import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { MockBuilder } from 'ng-mocks';
import { axe } from 'jest-axe';
import { NuverialSectionHeaderComponent } from './index';

const dependencies = MockBuilder(NuverialSectionHeaderComponent).build();

describe('SectionHeaderComponent', () => {
  const labelContent = 'label content';

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await render(NuverialSectionHeaderComponent, { ...dependencies });
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should display header with content', async () => {
    const template = `<nuverial-section-header>
        <div nuverialCardContentType="label">${labelContent}</div>
      </nuverial-section-header>`;
    await render(template, { ...dependencies });
    expect(screen.getByText(labelContent)).toBeInTheDocument();
  });
});
