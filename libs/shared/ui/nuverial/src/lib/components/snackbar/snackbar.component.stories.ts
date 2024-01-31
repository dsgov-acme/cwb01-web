import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, Injector } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { makeDecorator } from '@storybook/addons';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ICollection, NgModuleMetadata } from '@storybook/angular/dist/ts3.9/client/preview/types';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';
import { NuverialSnackbarComponent } from './snackbar.component';
import { NuverialSnackBarService } from './snackbar.service';

const injectInjectorToProps = makeDecorator({
  name: 'injectInjectorToProps',
  parameterName: 'injectInjectorToProps',
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context) => {
    const story = getStory(context) as { props: ICollection; moduleMetadata: NgModuleMetadata };

    if (!story.moduleMetadata.providers) {
      story.moduleMetadata.providers = [];
    }

    story.moduleMetadata.providers.push({
      deps: [Injector],
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector): void => {
        Object.assign(story.props, { injector });
      },
    });

    return story;
  },
});

export default {
  argTypes: {
    change: {
      action: 'change',
      defaultValue: '',
      description: 'Checkbox select event',
    },
  },
  component: NuverialSnackbarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatSnackBarModule,
        NuverialButtonComponent,
        NuverialIconComponent,
        SharedUtilsLoggingModule.useConsoleLoggingAdapter(),
      ],
    }),
    injectInjectorToProps,
  ],
  parameters: {
    injectInjectorToProps: true,
  },
  title: 'DSG/Nuverial/Components/SnackBar',
} as Meta<NuverialSnackbarComponent>;

const Template: Story<NuverialSnackbarComponent> = args => {
  const lbl = `Open snackbar ${args.nuverialSnackBarConfiguration.type}`;

  return {
    props: {
      ...args,
      onClickOpenSnackbar: (injector: Injector) => {
        injector.get<NuverialSnackBarService>(NuverialSnackBarService).openConfigured(args.nuverialSnackBarConfiguration);
      },
    },
    template: `
      <nuverial-button (click)="onClickOpenSnackbar(injector)" buttonStyle="outlined" ariaLabel="example snackbar">${lbl}</nuverial-button>
    `,
  };
};

export const SnackBarSuccess = Template.bind({});
SnackBarSuccess.args = {
  nuverialSnackBarConfiguration: {
    ariaLabelDismiss: 'Close snackbar',
    dismissible: true,
    message: 'Message sub title',
    nuverialActions: [
      {
        ariaLabel: 'action-label',
        buttonStyle: 'filled',
        colorTheme: 'primary',
        context: 'action-action',
        label: 'Action',
        uppercaseText: true,
      },
    ],
    title: 'Message title',
    type: 'success',
  },
};

export const SnackBarWarn = Template.bind({});
SnackBarWarn.args = {
  nuverialSnackBarConfiguration: {
    ariaLabelDismiss: 'Close snackbar',
    dismissible: true,
    message: 'Warn message sub title',
    title: 'Warn message title',
    type: 'warn',
  },
};

export const SnackBarError = Template.bind({});
SnackBarError.args = {
  nuverialSnackBarConfiguration: {
    ariaLabelDismiss: 'Close snackbar',
    dismissible: true,
    message: 'Error message sub title',
    title: 'Error message title',
    type: 'error',
  },
};
