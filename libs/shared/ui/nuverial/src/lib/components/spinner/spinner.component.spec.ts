import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialSpinnerComponent } from './spinner.component';

const dependencies = MockBuilder(NuverialSpinnerComponent).keep(MatProgressSpinnerModule).build();

const getFixtureByTemplate = async (template = '<nuverial-spinner></nuverial-spinner>') => {
  const { fixture } = await render(template, dependencies);

  return { component: fixture.componentInstance, fixture };
};

describe('NuverialSpinnerComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixtureByTemplate('<nuverial-spinner></nuverial-spinner>');

    expect(fixture).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations, when aria-label is not set', async () => {
      const { fixture } = await getFixtureByTemplate();
      const axeResults = await axe(fixture.nativeElement);
      const ariaLabel = fixture.nativeElement.querySelector('mat-spinner').getAttribute('aria-label');

      expect(axeResults).toHaveNoViolations();
      expect(ariaLabel).toBe('Loading');
    });

    it('should have no violations, when aria-label is set', async () => {
      const { fixture } = await getFixtureByTemplate('<nuverial-spinner ariaLabel="Progress: 50%"></nuverial-spinner>');
      const axeResults = await axe(fixture.nativeElement);
      const ariaLabel = fixture.nativeElement.querySelector('mat-spinner').getAttribute('aria-label');

      expect(axeResults).toHaveNoViolations();
      expect(ariaLabel).toBe('Progress: 50%');
    });
  });
});
