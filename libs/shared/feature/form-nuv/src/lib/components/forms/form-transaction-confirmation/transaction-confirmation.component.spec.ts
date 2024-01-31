import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { FormTransactionConfirmationComponent } from './transaction-confirmation.component';

global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

describe('FormTransactionConfirmationComponent', () => {
  let component: FormTransactionConfirmationComponent;
  let fixture: ComponentFixture<FormTransactionConfirmationComponent>;

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
      imports: [FormTransactionConfirmationComponent, RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(Router, {
          navigate: jest.fn(),
          url: '/dashboard/category/transaction/id/subCategory',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTransactionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard with category', () => {
    component.navigateToTransactionsDashboard();
    const service = ngMocks.findInstance(Router);
    const spy = jest.spyOn(service, 'navigate');

    expect(spy).toHaveBeenCalledWith(['/dashboard/category']);
  });
});
