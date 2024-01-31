import { Router } from '@angular/router';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { NuverialBreadcrumbComponent, mockBreadCrumbs } from './index';

const dependencies = MockBuilder(NuverialBreadcrumbComponent)
  .provide({
    provide: Router,
    useValue: {
      navigate: jest.fn(),
    },
  })
  .build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialBreadcrumbComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};
describe('BreadcrumbComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await render(NuverialBreadcrumbComponent, { ...dependencies, componentProperties: { breadCrumbs: mockBreadCrumbs } });
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should display "Back" text when no title is provided', async () => {
    const template = `<nuverial-breadcrumb [breadCrumbs]="[{label: '', navigationPath: ''}]"></nuverial-breadcrumb>`;
    await render(template, { ...dependencies });
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  describe('navigate', () => {
    it('should route to dashboard', async () => {
      const { fixture } = await getFixture({ componentProperties: { breadCrumbs: mockBreadCrumbs } });
      const router = ngMocks.findInstance(Router);
      fixture.componentInstance.navigate('/dashboard');
      const spy = jest.spyOn(router, 'navigate');
      expect(spy).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('trackByFn', () => {
    it('should return the same value passed to trackByFn', async () => {
      const { fixture } = await getFixture({ componentProperties: { breadCrumbs: mockBreadCrumbs } });
      const testValues = [0, 1, 2, 3, 10, 50, 100];
      for (const value of testValues) {
        expect(fixture.componentInstance.trackByFn(value)).toEqual(value);
      }
    });
  });
});
