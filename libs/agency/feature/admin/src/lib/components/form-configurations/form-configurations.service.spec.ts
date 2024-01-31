import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { FormConfigurationService } from './form-configurations.service';

describe('FormConfigurationService', () => {
  let service: FormConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockProvider(WorkApiRoutesService, {
          createFormConfiguration$: jest.fn().mockImplementation(() => of(FormMock)),
          getFormConfigurations$: jest.fn().mockImplementation(() => of([FormMock])),
        }),
      ],
    });
    service = TestBed.inject(FormConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFormConfigurations$', () => {
    it('should get form configurations', done => {
      service.getFormConfigurations$('transactionDefinitionKey').subscribe(forms => {
        expect(forms).toEqual([FormMock]);
        done();
      });
    });
  });

  describe('notify', () => {
    it('should update formConfigurations subject', done => {
      service.notifyNewFormConfig(FormMock);
      service.notifyNewFormConfig(FormMock);

      service.formConfigurationsList$.subscribe(forms => {
        expect(forms).toEqual([FormMock, FormMock]);
        done();
      });
    });
  });
});
