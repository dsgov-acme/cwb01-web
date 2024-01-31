import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { DocumentFormService } from '../../../../../services';
import { FormRendererService } from '../../../../../services/form-renderer.service';
import { MockDefaultComponentProperties, MockDefaultFormlyModuleConfiguration, MockTemplate } from '../../../../../test';
import { FormlyFileUploaderComponent } from '../../file-uploader/file-uploader.component';
import { FormlyFileUploadComponent } from './formly-file-upload.component';

const mockModel = {};

const mockFields: FormlyFieldConfig[] = [
  {
    fieldGroup: [
      {
        key: 'documents.document1',
        props: {
          label: 'Document 1',
        },
      },
    ],
    key: 'documents',
    props: {
      label: 'File Upload Label',
    },
    type: 'nuverialFileUpload',
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
        types: [
          { component: FormlyFileUploadComponent, name: 'nuverialFileUpload' },
          { component: FormlyFileUploaderComponent, name: 'nuverialFileUploader' },
        ],
      }),
    ],
    providers: [
      MockProvider(LoggingService),
      MockProvider(NuverialSnackBarService),
      MockProvider(DocumentFormService, {}),
      MockProvider(FormRendererService, {}),
    ],
  });
  const component = fixture.debugElement.query(By.directive(FormlyFileUploadComponent)).componentInstance;

  return { component, fixture };
};

describe('FormlyFileUploadComponent', () => {
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
    await getFixtureByTemplate();

    expect(screen.getByText('File Upload Label')).toBeInTheDocument();
    expect(screen.getByText('SHOW LESS')).toBeInTheDocument();
    expect(screen.getByText('Document 1')).toBeInTheDocument();
  });

  it('should show content at full width if multiple is true', async () => {
    const mockFieldsWithMultiple: FormlyFieldConfig[] = [
      {
        fieldGroup: [
          {
            key: 'documents.document1',
            props: {
              label: 'Document 1',
            },
          },
        ],
        key: 'documents',
        props: {
          label: 'File Upload Label',
          multiple: true,
        },
        type: 'nuverialFileUpload',
      },
    ];

    const { fixture } = await getFixtureByTemplate({ fields: mockFieldsWithMultiple });

    const editContent = fixture.debugElement.query(By.css('[data-testid="edit-content"]'));

    expect(editContent.classes['flex-full']).toBeTruthy();
  });

  it('should show content at half width if multiple is false', async () => {
    const mockFieldsWithMultiple: FormlyFieldConfig[] = [
      {
        fieldGroup: [
          {
            key: 'documents.document1',
            props: {
              label: 'Document 1',
            },
          },
        ],
        key: 'documents',
        props: {
          label: 'File Upload Label',
          multiple: false,
        },
        type: 'nuverialFileUpload',
      },
    ];

    const { fixture } = await getFixtureByTemplate({ fields: mockFieldsWithMultiple });

    const editContent = fixture.debugElement.query(By.css('[data-testid="edit-content"]'));

    expect(editContent.classes['flex-half']).toBeTruthy();
  });

  it('should show content at half width if multiple does not exist', async () => {
    const { fixture } = await getFixtureByTemplate();

    const editContent = fixture.debugElement.query(By.css('[data-testid="edit-content"]'));

    expect(editContent.classes['flex-half']).toBeTruthy();
  });

  it('should show content at half width if props do not exist', async () => {
    const mockFieldsWithoutProps: FormlyFieldConfig[] = [
      {
        fieldGroup: [
          {
            key: 'documents.document1',
            props: {
              label: 'Document 1',
            },
          },
        ],
        key: 'documents',
        type: 'nuverialFileUpload',
      },
    ];

    const { fixture } = await getFixtureByTemplate({ fields: mockFieldsWithoutProps });

    const editContent = fixture.debugElement.query(By.css('[data-testid="edit-content"]'));

    expect(editContent.classes['flex-half']).toBeTruthy();
  });

  it('should work if fieldGroup does not exist', async () => {
    const mockFieldsWithoutProps: FormlyFieldConfig[] = [
      {
        key: 'documents',
        type: 'nuverialFileUpload',
      },
    ];

    const { component } = await getFixtureByTemplate({ fields: mockFieldsWithoutProps });

    expect(component.field.fieldGroup).toBeFalsy();
  });

  it('should verify fromControls', async () => {
    const { component } = await getFixtureByTemplate();

    expect(component.formControls.length).toEqual(1);
  });
});
