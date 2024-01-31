import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormConfigurationModel, FormioConfigurationTestMock, TransactionModelMock } from '@dsg/shared/data-access/work-api';
import { DocumentFormService, FormRendererService } from '@dsg/shared/feature/form-nuv';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { IntakeFormComponent } from './intake-form.component';

global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

const formConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);

describe('IntakeFormComponent', () => {
  let component: IntakeFormComponent;
  let fixture: ComponentFixture<IntakeFormComponent>;
  const formConfiguration$ = new BehaviorSubject(formConfigurationModel);

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }, // required in formly tests
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakeFormComponent, RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(NuverialSnackBarService),
        MockProvider(DocumentFormService),
        MockProvider(FormRendererService, {
          formConfiguration$: formConfiguration$,
          transaction: TransactionModelMock,
          transaction$: of(TransactionModelMock),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IntakeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formRendererConfiguration$', () => {
    it('should load form configuration', done => {
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');
      component.formRendererConfiguration$?.subscribe(formConfiguration => {
        expect(formConfiguration).toEqual(formConfigurationModel.toIntakeForm());
        expect(errorSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should notify if there is no formConfiguration', done => {
      formConfiguration$.next(undefined as any);
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');
      component.formRendererConfiguration$?.subscribe(formConfiguration => {
        expect(formConfiguration).toBeFalsy();
        expect(errorSpy).toHaveBeenCalled();
        done();
      });
    });
  });
});
