import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialDashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { NuverialDashboardCardsGroupComponent } from './dashboard-cards-group.component';

const dependencies = MockBuilder(NuverialDashboardCardsGroupComponent).keep(NuverialDashboardCardComponent).build();

const card = {
  description: 'Description',
  icon: 'file_copy',
  name: 'Name',
  route: 'route',
};

describe('NuverialDashboardCardsGroupComponent', () => {
  it('should create', async () => {
    const { fixture } = await render(NuverialDashboardCardsGroupComponent, { ...dependencies });

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Accessibility - should have no violations', async () => {
    const template = `<nuverial-dashboard-cards-group data-testid="test-card-group">
  		<nuverial-dashboard-card data-testid="test-card" description="${card.description}" icon="${card.icon}" name="${card.name}" route="${card.route}"></nuverial-dashboard-card>
  	</nuverial-dashboard-cards-group>`;

    const { fixture } = await render(template, { ...dependencies });
    fixture.detectChanges();
    const axeResults = await axe(fixture.nativeElement);

    expect(axeResults).toHaveNoViolations();
  });

  it('should display empty component', async () => {
    const template = `<nuverial-dashboard-cards-group data-testid="test-card-group">
  	</nuverial-dashboard-cards-group>`;

    const { fixture } = await render(template, { ...dependencies });
    fixture.detectChanges();
    const component = screen.queryByTestId('test-card-group');

    expect(component).toBeEmptyDOMElement();
  });

  it('should display component with card', async () => {
    const template = `<nuverial-dashboard-cards-group data-testid="test-card-group">
  		<nuverial-dashboard-card data-testid="test-card" description="${card.description}" icon="${card.icon}" name="${card.name}" route="${card.route}"></nuverial-dashboard-card>
  	</nuverial-dashboard-cards-group>`;

    const { fixture } = await render(template, { ...dependencies });
    fixture.detectChanges();
    const component = screen.queryByTestId('test-card-group');

    expect(component).not.toBeEmptyDOMElement();
    expect(screen.getByText(card.name)).toBeInTheDocument();
    expect(screen.getByText(card.description)).toBeInTheDocument();
  });
});
