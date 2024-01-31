import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { NuverialButtonComponent } from '@dsg/shared/ui/nuverial';
import { AuthenticationProviderActions } from '../../models';
import { AuthenticationStatusComponent } from './authentication-status.component';

const dependencies = MockBuilder(AuthenticationStatusComponent).keep(NuverialButtonComponent).build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(AuthenticationStatusComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('AuthenticationStatusComponent', () => {
  describe('Accessibility', () => {
    it('should have violations', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).not.toHaveNoViolations();
    });

    it('should have violations', async () => {
      const { fixture } = await getFixture({ componentProperties: { title: 'title' } });
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should have title element', async () => {
    await getFixture({ componentProperties: { title: 'title' } });
    expect(await screen.findByText('title')).toBeVisible();
  });

  it('should have sub title element', async () => {
    await getFixture({ componentProperties: { subTitle: 'sub-title' } });
    expect(await screen.findByText('sub-title')).toBeVisible();
  });

  it('should have sub message element', async () => {
    await getFixture({ componentProperties: { subTitle: 'message' } });
    expect(await screen.findByText('message')).toBeVisible();
  });

  it('should have link text', async () => {
    let emitted = false;
    const { fixture } = await getFixture({
      componentProperties: {
        authenticationProvider: AuthenticationProviderActions.SignUpWithEmailAndPassword,
        linkText: 'link text',
      },
    });

    expect(await screen.findByText('link text')).toBeVisible();
    fixture.componentInstance.statusClose.subscribe(_ => (emitted = true));
    ngMocks.click('button');
    expect(emitted).toEqual(true);
  });
});
