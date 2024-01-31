import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Renderer2, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { SchemaTreeDefinitionMock, SchemaTreeDefinitionModel } from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { MockProvider, ngMocks } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';
import { SchemaTreeService } from '../../services';
import { SchemaKeySelectorComponent } from './schema-key-selector.component';

describe('SchemaKeySelectorComponent', () => {
  let component: SchemaKeySelectorComponent;
  let fixture: ComponentFixture<SchemaKeySelectorComponent>;
  let schemaTreeSubject: ReplaySubject<SchemaTreeDefinitionModel>;

  beforeEach(async () => {
    schemaTreeSubject = new ReplaySubject<SchemaTreeDefinitionModel>(1);
    schemaTreeSubject.next(new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock));

    await TestBed.configureTestingModule({
      imports: [SchemaKeySelectorComponent, NoopAnimationsModule],
      providers: [
        MockProvider(NuverialSnackBarService),
        MockProvider(MatDialog, {
          open: jest.fn().mockReturnValue({
            afterClosed: () => of(''),
          }),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ transactionDefinitionKey: 'FinancialBenefit' })),
          },
        },
        MockProvider(SchemaTreeService, {
          getSchemaKeySelectorSchemaTree$: jest.fn().mockImplementation(() => of(SchemaTreeDefinitionMock)),
          schemaTree$: schemaTreeSubject.asObservable(),
        }),
        MockProvider(Renderer2, {
          setStyle: jest.fn(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaKeySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectedSchemaKey', () => {
    it('should be empty on init', () => {
      expect(component.selectedSchemaKey).toBeFalsy();
    });
  });

  describe('clearSelectedSchemaKey', () => {
    it('should be set selectedSchemaKey to falsy value when called', () => {
      component.selectedSchemaKey = 'some key';
      expect(component.selectedSchemaKey).toBe('some key');

      component.clearSelectedSchemaKey();
      expect(component.selectedSchemaKey).toBeFalsy();
    });

    it('should call updateValue with new falsy key', () => {
      const spy = jest.spyOn(component, 'updateValue');

      component.selectedSchemaKey = 'some key';
      expect(component.selectedSchemaKey).toBe('some key');

      component.clearSelectedSchemaKey();
      expect(component.selectedSchemaKey).toBeFalsy();
      expect(spy).toHaveBeenCalledWith(component.selectedSchemaKey);
    });
  });

  describe('openModal', () => {
    it('dialog should open and set the returned key', async () => {
      expect(component.selectedSchemaKey).toBeFalsy();

      const spy = jest.spyOn(component['_dialog'], 'open').mockReturnValue({ afterClosed: () => of('FinancialBenefit') } as MatDialogRef<unknown, unknown>);
      component.openModal();

      expect(spy).toHaveBeenCalled();
      expect(component.selectedSchemaKey).toBe('FinancialBenefit');
    });

    it('should not call updateValue if dialog responds with empty string', async () => {
      const emptyKey = '';
      const service = ngMocks.findInstance(MatDialog);
      jest.spyOn(service, 'open').mockReturnValue({
        afterClosed: () => of(emptyKey),
      } as MatDialogRef<unknown, unknown>);

      const spy = jest.spyOn(component, 'updateValue');
      component.openModal();

      await component.dialogRef?.afterClosed().toPromise();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call updateValue with the key after the dialog is closed', async () => {
      const key = 'key';
      const service = ngMocks.findInstance(MatDialog);
      jest.spyOn(service, 'open').mockReturnValue({
        afterClosed: () => of(key),
      } as MatDialogRef<unknown, unknown>);

      const spy = jest.spyOn(component, 'updateValue');
      component.openModal();

      await component.dialogRef?.afterClosed().toPromise();
      expect(spy).toHaveBeenCalledWith(key);
    });

    it('should do nothing if disabled is true', async () => {
      component.disabled = true;

      const spy = jest.spyOn(component['_dialog'], 'open');
      component.openModal();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should set the existing schema key if value is a key in the tree', () => {
      const spy = jest.spyOn(component, 'checkAndSetExistingSchemaKey');
      const changes: SimpleChanges = {
        value: {
          currentValue: 'CommonPersonalInformation.address',

          firstChange: true,

          isFirstChange: () => true,

          previousValue: null,
        },
      };

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalledWith('CommonPersonalInformation.address', expect.anything());
      expect(component.selectedSchemaKey).toBe('CommonPersonalInformation.address');
    });

    it('should set value as empty string if change value is not a key in the tree', () => {
      const spy = jest.spyOn(component, 'checkAndSetExistingSchemaKey');
      const changes: SimpleChanges = {
        value: {
          currentValue: 'some fake key',

          firstChange: true,

          isFirstChange: () => true,

          previousValue: null,
        },
      };

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalledWith('some fake key', expect.anything());
      expect(component.selectedSchemaKey).toBeFalsy();
    });
  });

  it('should set value to null if schema does not exist', () => {
    component['_schemaTree$'].next(new SchemaTreeDefinitionModel());

    const spy = jest.spyOn(component, 'updateValue');
    const changes: SimpleChanges = {
      value: {
        currentValue: 'CommonPersonalInformation.address',

        firstChange: true,

        isFirstChange: () => true,

        previousValue: null,
      },
    };

    component.ngOnChanges(changes);

    expect(spy).toHaveBeenCalledWith(null);
  });
});
