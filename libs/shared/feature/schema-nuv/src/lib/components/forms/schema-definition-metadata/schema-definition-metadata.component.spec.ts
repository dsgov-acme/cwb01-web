import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SchemaMetadataMock } from '@dsg/shared/data-access/work-api';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { SchemaDefinitionMetaDataComponent } from './schema-definition-metadata.component';
describe('SchemaDefinitionMetaDataComponent', () => {
  let component: SchemaDefinitionMetaDataComponent;
  let fixture: ComponentFixture<SchemaDefinitionMetaDataComponent>;
  const mockDialogRef = {
    close: jest.fn(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
      providers: [MockProvider(LoggingAdapter), { provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaDefinitionMetaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  describe('onSave', () => {
    it('should set saving to true and close the dialog', () => {
      const mockMetaData = SchemaMetadataMock;
      const mockFormGroup = new FormGroup({
        createdBy: new FormControl(mockMetaData?.createdBy),
        description: new FormControl(mockMetaData?.description),
        key: new FormControl({ disabled: true, value: mockMetaData?.key }),
        lastUpdatedBy: new FormControl(mockMetaData?.lastUpdatedBy),
        name: new FormControl(mockMetaData?.name),
      });
      component.metaData = mockMetaData;
      component.formGroup = mockFormGroup;
      component.onSave();
      expect(component.loading).toBe(true);
      expect(mockDialogRef.close).toHaveBeenCalledWith({ metaData: component.metaData, save: true });
      expect(component.metaData.createdBy).toEqual(component.formGroup.value.createdBy);
      expect(component.metaData.lastUpdatedBy).toEqual(component.formGroup.value.lastUpdatedBy);
      expect(component.metaData.description).toEqual(component.formGroup.value.description);
      expect(component.metaData.name).toEqual(component.formGroup.value.name);
    });

    it('should close the dialog if form is pristine', () => {
      const mockMetaData = SchemaMetadataMock;
      const mockFormGroup = new FormGroup({
        createdBy: new FormControl(mockMetaData?.createdBy),
        description: new FormControl(mockMetaData?.description),
        key: new FormControl({ disabled: true, value: mockMetaData?.key }),
        lastUpdatedBy: new FormControl(mockMetaData?.lastUpdatedBy),
        name: new FormControl(mockMetaData?.name),
      });
      component.metaData = mockMetaData;
      component.formGroup = mockFormGroup;
      component.formGroup.markAsPristine();
      component.onSave();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('SchemaDefinitionMetaDataComponent - Constructor', () => {
    it('constructor should have dialogRef and dialogData', async () => {
      expect(component.dialogData).toBeTruthy();
      expect(component.dialogRef).toBeTruthy();
    });

    it('should not have dialogData when not provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SchemaDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
        providers: [MockProvider(LoggingAdapter)],
      }).compileComponents();
      expect(component.dialogData).toStrictEqual({});
    });

    it('should initialize with default values when dialog data is not provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SchemaDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
        providers: [MockProvider(LoggingAdapter), { provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MatDialogRef, useValue: mockDialogRef }],
      }).compileComponents();
      expect(component.dialogData).toStrictEqual({});
      expect(component.dialogRef).toBeTruthy();
      const localFixture = TestBed.createComponent(SchemaDefinitionMetaDataComponent);
      const componentInstance = localFixture.componentInstance;

      expect(componentInstance.metaData).toStrictEqual({});
      expect(componentInstance.formGroup.get('createdBy')?.value).toBeNull();
      expect(componentInstance.formGroup.get('description')?.value).toBeNull();
      expect(componentInstance.formGroup.get('lastUpdatedBy')?.value).toBeNull();
      expect(componentInstance.formGroup.get('name')?.value).toBeNull();
      expect(componentInstance.formGroup.get('key')?.value).toBeNull();
    });

    it('should initialize with provided values when dialog data is provided', () => {
      const mockMetaData = SchemaMetadataMock;

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SchemaDefinitionMetaDataComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
        providers: [MockProvider(LoggingAdapter), { provide: MAT_DIALOG_DATA, useValue: mockMetaData }, { provide: MatDialogRef, useValue: mockDialogRef }],
      }).compileComponents();

      const localFixture = TestBed.createComponent(SchemaDefinitionMetaDataComponent);
      const componentInstance = localFixture.componentInstance;

      expect(componentInstance.metaData).toEqual(mockMetaData);
      expect(componentInstance.formGroup.get('createdBy')?.value).toEqual(mockMetaData.createdBy);
      expect(componentInstance.formGroup.get('description')?.value).toEqual(mockMetaData.description);
      expect(componentInstance.formGroup.get('lastUpdatedBy')?.value).toEqual(mockMetaData.lastUpdatedBy);
      expect(componentInstance.formGroup.get('name')?.value).toEqual(mockMetaData.name);
      expect(componentInstance.formGroup.get('key')?.value).toEqual(mockMetaData.key);
    });
  });
});
