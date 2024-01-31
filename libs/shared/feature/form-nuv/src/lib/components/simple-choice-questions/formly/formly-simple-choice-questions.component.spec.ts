import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockService } from 'ng-mocks';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormlySimpleChoiceQuestionsComponent } from './formly-simple-choice-questions.component';

const mockModel = {
  radioCardGroupLegend: 'This is a question?',
  radioCards: [
    {
      content: '',
      imageAltLabel: '',
      imagePath: '',
      imagePosition: 'before',
      pointValue: '',
      title: 'Yes',
      value: 'yes',
    },
    {
      content: '',
      imageAltLabel: '',
      imagePath: '',
      imagePosition: 'before',
      pointValue: '',
      title: 'No',
      value: 'no',
    },
  ],
};

const mockFields: FormlyFieldConfig[] = [
  {
    key: 'nuverialRadioCards',
    props: {
      answers: [
        {
          content: '',
          imageAltLabel: '',
          imagePath: '',
          imagePosition: 'before',
          pointValue: '',
          title: 'Yes',
          value: 'yes',
        },
        {
          content: '',
          imageAltLabel: '',
          imagePath: '',
          imagePosition: 'before',
          pointValue: '',
          title: 'No',
          value: 'no',
        },
      ],
      colorTheme: 'primary',
      label: 'Are you citizen ?',
    },
    type: 'nuverialRadioCards',
  },
];

const getFixtureByTemplate = async (props?: Record<string, unknown>) => {
  const template = MockTemplate;
  const { fixture } = await render(template, {
    componentProperties: {
      ...MockDefaultComponentProperties,
      fields: mockFields,
      model: mockModel,
      ...props,
    },
    imports: [
      ReactiveFormsModule,
      FormlyModule.forRoot({
        ...MockDefaultFormlyModuleConfiguration,
        types: [{ component: FormlySimpleChoiceQuestionsComponent, name: 'nuverialRadioCards' }],
      }),
    ],
    providers: [{ provide: LoggingService, useValue: MockService(LoggingService) }],
  });

  return { fixture };
};

describe('FormlySimpleChoiceQuestionsComponent', () => {
  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  it('should create', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixtureByTemplate();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should verify the dom', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.querySelector('dsg-formly-simple-choice-questions').id).toBe('nuverialRadioCards-field');
  });
});
