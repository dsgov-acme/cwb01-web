import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialIconComponent } from '../icon';
import { NuverialFormFieldErrorComponent } from './index';

const dependencies = MockBuilder(NuverialFormFieldErrorComponent).keep(NuverialIconComponent).keep(MatTooltipModule).keep(MatProgressSpinnerModule).build();

const getFixture = async (props: Record<string, Record<string, string | boolean>>) => {
  const { fixture } = await render(NuverialFormFieldErrorComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('FormFieldErrorComponent', () => {
  describe('Accessability', () => {
    it('should have no violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'test-label' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations when a message is set by template', async () => {
      const { fixture } = await render(
        `<nuverial-form-field-error><nuverial-icon iconName="error_outline"></nuverial-icon>test message</nuverial-form-field-error>`,
        dependencies,
      );
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can define a default form-field-error component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
  });

  it('can display error message message', async () => {
    const { fixture } = await render(
      `<nuverial-form-field-error><nuverial-icon iconName="error_outline"></nuverial-icon>test message</nuverial-form-field-error>`,
      {
        imports: [NuverialFormFieldErrorComponent, NuverialIconComponent],
      },
    );

    expect(fixture).toBeTruthy();
    expect(screen.queryByText(`test message`)).toBeTruthy();
  });
});
