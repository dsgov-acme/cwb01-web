import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockService } from 'ng-mocks';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../test';
import { FormStateMode } from '../../forms';
import { FormlyTextContentComponent } from './formly-text-content.component';

let mockFields: FormlyFieldConfig[] = [
  {
    key: 'textContent',
    props: {
      content: '<h2>Welcome</h2>',
    },
    type: 'nuverialTextContent',
  },
];

const getFixtureByTemplate = async (props?: Record<string, unknown>) => {
  const template = MockTemplate;
  const { fixture } = await render(template, {
    componentProperties: {
      ...MockDefaultComponentProperties,
      fields: mockFields,
      ...props,
    },
    imports: [
      ReactiveFormsModule,
      FormlyModule.forRoot({
        ...MockDefaultFormlyModuleConfiguration,
        types: [{ component: FormlyTextContentComponent, name: 'nuverialTextContent' }],
      }),
    ],
    providers: [{ provide: LoggingService, useValue: MockService(LoggingService) }],
  });

  const component = fixture.debugElement.query(By.directive(FormlyTextContentComponent)).componentInstance;

  return { component, fixture };
};

describe('FormlyTextContentComponent', () => {
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

  it('should verify text in the dom', async () => {
    const { fixture } = await getFixtureByTemplate();
    fixture.detectChanges();

    expect(await screen.findByText('Welcome')).toBeInTheDocument();
  });

  it('should keep non script tags in the innerHTML', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.innerHTML).toContain('<h2>Welcome</h2>');
  });

  it('should remove script tags from the innerHTML', async () => {
    mockFields = [
      {
        key: 'textContent',
        props: {
          content: '<script>alert("Hello")</script><h2>Welcome Script Test</h2>',
        },
        type: 'nuverialTextContent',
      },
    ];
    const { fixture } = await getFixtureByTemplate();

    expect(fixture.nativeElement.innerHTML).not.toContain('<script>alert("Hello")</script>');
    expect(fixture.nativeElement.innerHTML).toContain('<h2>Welcome Script Test</h2>');
  });

  it('should not display content when in review mode and hideInReviewPage is true', async () => {
    mockFields = [
      {
        key: 'textContent',
        props: {
          content: '<script>alert("Hello")</script><h2>Welcome Script Test</h2>',
          hideInReviewPage: true,
        },
        type: 'nuverialTextContent',
      },
    ];
    const { component, fixture } = await getFixtureByTemplate();
    component.formState.mode = FormStateMode.Review;
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML).not.toContain('<h2>Welcome Script Test</h2>');
    expect(fixture.nativeElement.innerHTML).not.toContain('<nuverial-rich-text-viewer');
  });

  it('should display content when in review mode and hideInReviewPage is true', async () => {
    mockFields = [
      {
        key: 'textContent',
        props: {
          content: '<script>alert("Hello")</script><h2>Welcome Script Test</h2>',
          hideInReviewPage: true,
        },
        type: 'nuverialTextContent',
      },
    ];
    const { component, fixture } = await getFixtureByTemplate();
    component.formState.mode = FormStateMode.Edit;
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML).toContain('<h2>Welcome Script Test</h2>');
    expect(fixture.nativeElement.innerHTML).toContain('<nuverial-rich-text-viewer');
  });
});
