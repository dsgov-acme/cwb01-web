import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';
import { NuverialSnackbarComponent } from './snackbar.component';
import { INuverialSnackBarComponentOptions } from './snackbar.models';

const getDependencies = (config: INuverialSnackBarComponentOptions) => {
  return MockBuilder(NuverialSnackbarComponent)
    .keep(NuverialButtonComponent)
    .keep(NuverialIconComponent)
    .keep(MatTooltipModule)
    .provide([
      {
        provide: MAT_SNACK_BAR_DATA,
        useValue: config,
      },
    ])
    .build();
};

const getFixture = async (props: Record<string, Record<string, unknown>>, dependencies: any) => {
  const { fixture } = await render(NuverialSnackbarComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('NuverialSnackbarComponent', () => {
  describe('Accessibility', () => {
    it('should have violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture(
        {},
        getDependencies({
          ariaLabelDismiss: 'dismiss',
          dismissible: true,
          message: 'snackbar message',
          title: 'snackbar title',
          type: 'success',
        }),
      );
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture(
        {},
        getDependencies({
          ariaLabelDismiss: '',
          dismissible: true,
          message: 'snackbar message',
          title: 'snackbar title',
          type: 'success',
        }),
      );
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).not.toHaveNoViolations();
    });
  });

  it('should display message and title success', async () => {
    const config: INuverialSnackBarComponentOptions = {
      ariaLabelDismiss: 'dismiss',
      dismissible: true,
      message: 'snackbar message',
      title: 'snackbar title',
      type: 'success',
    };

    await getFixture({}, getDependencies(config));

    expect(screen.getByText(`${config.title}`)).toBeInTheDocument();
    expect(screen.getByText(config.message as string)).toBeInTheDocument();
    const button = ngMocks.findInstance(NuverialButtonComponent);
    expect(button).toBeTruthy();
  });

  it('should display message and title warn', async () => {
    const config: INuverialSnackBarComponentOptions = {
      ariaLabelDismiss: 'dismiss',
      dismissible: true,
      message: 'snackbar message',
      title: 'snackbar title',
      type: 'warn',
    };

    await getFixture({}, getDependencies(config));

    const instance = ngMocks.find('.nuverial-snackbar-container .warn');
    expect(instance).toBeTruthy();
  });

  it('should display message and title error', async () => {
    const config: INuverialSnackBarComponentOptions = {
      ariaLabelDismiss: 'dismiss',
      dismissible: true,
      message: 'snackbar message',
      title: 'snackbar title',
      type: 'error',
    };

    await getFixture({}, getDependencies(config));

    const instance = ngMocks.find('.nuverial-snackbar-container .error');
    expect(instance).toBeTruthy();
  });

  it('should close snackbar', async () => {
    const config: INuverialSnackBarComponentOptions = {
      ariaLabelDismiss: 'dismiss',
      dismissible: true,
      message: 'snackbar message',
      title: 'snackbar title',
      type: 'error',
    };

    let closed = false;

    const { fixture } = await getFixture({}, getDependencies(config));
    fixture.componentInstance.closed$.subscribe(_ => (closed = true));

    const instance = ngMocks.find('.nuverial-snackbar-container .error');
    expect(instance).toBeTruthy();

    const button = ngMocks.find('.nuverial-snackbar-close');
    expect(button).toBeTruthy();
    ngMocks.click(button);

    expect(closed).toEqual(true);
  });

  it('should display snackbar actions', async () => {
    const config: INuverialSnackBarComponentOptions = {
      ariaLabelDismiss: 'dismiss',
      dismissible: true,
      message: 'snackbar message',
      nuverialActions: [
        {
          ariaLabel: 'label',
          buttonStyle: 'outlined',
          colorTheme: 'primary',
          context: 'action1',
          label: 'action button 1',
        },
        {
          ariaLabel: 'label',
          buttonStyle: 'filled',
          colorTheme: 'primary',
          context: 'action2',
          label: 'action button 2',
          uppercaseText: true,
        },
      ],
      title: 'snackbar title',
      type: 'error',
    };

    let closed = false;
    let closedAction: unknown;

    const { fixture } = await getFixture({}, getDependencies(config));
    fixture.componentInstance.closed$.subscribe(_ => (closed = true));
    fixture.componentInstance.action$.subscribe(_ => (closedAction = _));
    fixture.detectChanges();

    expect(screen.getByText(`action button 1`)).toBeInTheDocument();
    expect(screen.getByText(`action button 2`)).toBeInTheDocument();
    expect(screen.getByText(config.message as string)).toBeInTheDocument();

    const instance = ngMocks.find('.nuverial-snackbar-container .error');
    expect(instance).toBeTruthy();

    const button = ngMocks.find('.nuverial-snackbar-close');
    expect(button).toBeTruthy();
    ngMocks.click(button);

    const action = ngMocks.find('.nuverial-snackbar-action button');
    expect(action).toBeTruthy();
    ngMocks.click(action);

    expect(closed).toEqual(true);
    expect(closedAction).toEqual('action1');
  });

  it('should cannot dismiss snackbar', async () => {
    const config: INuverialSnackBarComponentOptions = {
      ariaLabelDismiss: 'dismiss',
      dismissible: false,
      message: 'snackbar message',
      title: 'snackbar title',
      type: 'error',
    };

    await getFixture({}, getDependencies(config));

    const instance = ngMocks.find('.nuverial-snackbar-container .error');
    expect(instance).toBeTruthy();

    expect(() => ngMocks.find('.nuverial-snackbar-close')).toThrow();
  });
});
