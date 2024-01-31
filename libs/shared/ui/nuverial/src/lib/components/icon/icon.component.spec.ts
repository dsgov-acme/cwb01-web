import { MatIconModule } from '@angular/material/icon';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialIconComponent } from './icon.component';

const dependencies = MockBuilder(NuverialIconComponent).keep(MatIconModule).build();

const getFixture = async (props: Record<string, Record<string, string>>) => {
  const { fixture } = await render(NuverialIconComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

const getFixtureByTemplate = async () => {
  const { fixture } = await render(`<nuverial-icon iconName="search" data-testid="nuverial-icon-id"></nuverial-icon>`, {
    ...dependencies,
  });

  return { fixture, icon: screen.getByTestId('nuverial-icon-id') };
};

describe('NuverialIcon', () => {
  describe('Accessability', () => {
    it('should have no violations when iconName is not set', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations when iconName is set', async () => {
      const { fixture } = await getFixture({
        componentProperties: {
          iconName: 'search',
        },
      });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('getFixtureByTemplate should have no violations', async () => {
      const { fixture } = await getFixtureByTemplate();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can define a default icon component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.iconName).toEqual(undefined);
  });

  it('can define a icon component', async () => {
    const { fixture, icon } = await getFixtureByTemplate();

    expect(fixture).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('iconName')).toEqual('search');
  });
});
