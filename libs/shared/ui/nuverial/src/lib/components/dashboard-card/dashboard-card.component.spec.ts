import { RouterModule } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialIconComponent } from '../icon';
import { NuverialDashboardCardComponent } from './dashboard-card.component';

const dependencies = MockBuilder(NuverialDashboardCardComponent).mock(RouterModule).keep(NuverialIconComponent).build();

const card = {
  description: 'Description',
  icon: 'file_copy',
  name: 'Name',
  route: 'route',
  tooltip: 'tooltip',
};

describe('NuverialDashboardCardComponent', () => {
  it('should create', async () => {
    const { fixture } = await render(NuverialDashboardCardComponent, { ...dependencies });
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await render(NuverialDashboardCardComponent, {
        ...dependencies,
        componentInputs: {
          description: card.description,
          icon: card.icon,
          name: card.name,
          route: card.route,
          tooltip: card.tooltip,
        },
      });
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should display card with title and description', async () => {
    const { fixture } = await render(NuverialDashboardCardComponent, {
      ...dependencies,
      componentInputs: {
        description: card.description,
        icon: card.icon,
        name: card.name,
        route: card.route,
        tooltip: card.tooltip,
      },
    });
    fixture.detectChanges();
    expect(screen.queryByText(card.name)).toBeInTheDocument();
    expect(screen.queryByText(card.description)).toBeInTheDocument();
  });
});
