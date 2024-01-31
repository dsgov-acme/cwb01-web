import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { CustomerProvidedDocumentMock, DocumentRejectionReasonsMock, TransactionMock, TransactionMockWithDocuments } from '@dsg/shared/data-access/work-api';
import { INuverialSelectOption, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { distinctUntilChanged, of, tap } from 'rxjs';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';
import { NeedsCorrectionModalComponent } from './needs-correction-modal.component';

describe('NeedsCorrectionModalComponent', () => {
  let component: NeedsCorrectionModalComponent;
  let fixture: ComponentFixture<NeedsCorrectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedsCorrectionModalComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
      providers: [
        MockProvider(LoggingAdapter),
        MockProvider(NuverialSnackBarService),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            rejectedReasons: [
              {
                displayTextValue: 'Does Not Satisfy Requirements',
                key: 'DOES_NOT_SATISFY_REQUIREMENTS',
              },
              { displayTextValue: 'Incorrect Type', key: 'INCORRECT_TYPE' },
              { displayTextValue: 'Poor Quality', key: 'POOR_QUALITY' },
              { displayTextValue: 'Suspected Fraud', key: 'SUSPECTED_FRAUD' },
            ],
          },
        },
        MockProvider(MatDialogRef),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ transactionId: 'transactionId' }),
            snapshot: {
              paramMap: {
                get: () => TransactionMockWithDocuments.id,
              },
              params: { transactionId: TransactionMockWithDocuments.id },
            },
          },
        },
        MockProvider(TransactionDetailService, {
          getDocumentRejectionReasons$: jest.fn().mockReturnValue(of(DocumentRejectionReasonsMock)),
          updateCustomerProvidedDocument: jest.fn().mockImplementation(() =>
            of(TransactionMock.id, CustomerProvidedDocumentMock.id, {
              ...CustomerProvidedDocumentMock,
              rejectionReasons: undefined,
              reviewStatus: 'NEW',
            }),
          ),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NeedsCorrectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('nuverial-button disabled', () => {
    it('should enable the nuverial-button if selectedReasons.length is greater than 0', () => {
      fixture = TestBed.createComponent(NeedsCorrectionModalComponent);
      component = fixture.componentInstance;
      component.selectedReasons = [
        { disabled: false, displayTextValue: 'Does Not Satisfy Requirements', key: 'DOES_NOT_SATISFY_REQUIREMENTS', selected: true },
      ];
      fixture.detectChanges();

      const nuverialButton = fixture.nativeElement.querySelector('nuverial-button.needs-correction-modal__actions[ariaLabel="Save"]');
      expect(nuverialButton).toBeDefined();
      expect(nuverialButton.getAttribute('ng-reflect-disabled')).toEqual('false');
    });
    it('should disable the nuverial-button if selectedReasons.length is 0', () => {
      component.selectedReasons = [];
      component.ngOnInit();
      fixture.detectChanges();
      const nuverialButton = fixture.nativeElement.querySelector('nuverial-button.needs-correction-modal__actions[ariaLabel="Save"]');
      expect(nuverialButton).toBeDefined();
      expect(nuverialButton.getAttribute('ng-reflect-disabled')).toEqual('true');
    });
  });

  describe('saveNeedsCorrection', () => {
    it('should saveNeedsCorrection', fakeAsync(async () => {
      const service = ngMocks.findInstance(TransactionDetailService);
      const spy = jest.spyOn(service, 'updateCustomerProvidedDocument');
      component.formGroup.get('rejectionReason')?.valueChanges.subscribe(_ => {
        component.saveNeedsCorrection();
        expect(spy).toBeCalledTimes(1);
      });
    }));
    it('should saveNeedsCorrection', fakeAsync(async () => {
      const service = ngMocks.findInstance(TransactionDetailService);
      const spy = jest.spyOn(service, 'updateCustomerProvidedDocument');
      component.formGroup.get('rejectionReason')?.valueChanges.subscribe(_ => {
        component.saveNeedsCorrection();
        expect(spy).toBeCalledWith(component.data.transactionId);
      });
    }));
  });

  it('should remove the selected reason', async () => {
    expect(component.selectedReasons).toHaveLength(0);
    component.formGroup.get(['rejectionReason'])?.setValue(component.rejectionReasonSelectOptions[0].key, {
      emitEvent: true,
    });
    expect(component.selectedReasons).toHaveLength(1);
    component.removeSelectedReason(component.rejectionReasonSelectOptions[0]);
    expect(component.selectedReasons?.length).toBeLessThanOrEqual(0);
  });

  describe('setSelectedReason', () => {
    it('should get the document rejection reasons to populate the dropdown', () => {
      expect(component.rejectionReasonSelectOptions[0].displayTextValue).toEqual('Does Not Satisfy Requirements');
      expect(component.rejectionReasonSelectOptions[0].key).toEqual('DOES_NOT_SATISFY_REQUIREMENTS');
      expect(component.rejectionReasonSelectOptions[0].selected).toEqual(false);
    });
    it('should set the selected reason', async () => {
      component.formGroup
        .get('rejectionReason')
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          tap(value => {
            expect(component.selectedReasons).toContain(value);
          }),
        )
        .subscribe();
    });
    it('should find a matching reason based on the form control key', async () => {
      component.formGroup
        .get('rejectionReason')
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          tap(value => {
            expect(component.rejectionReasonSelectOptions.find(reason => reason.key === value)).toBeTruthy();
          }),
        )
        .subscribe();
    });
  });

  it('should emit event when click on cancel', () => {
    jest.spyOn(component['onCancel'], 'emit');
    component.onCancelClick();

    fixture.detectChanges();

    expect(component.onCancel.emit).toHaveBeenCalled();
  });

  it('should close dialog with rejected reasons', () => {
    const dialogService = ngMocks.findInstance(MatDialogRef);
    const closeSpy = jest.spyOn(dialogService, 'close');

    const rejectedReasons = Array.from(DocumentRejectionReasonsMock, reason => reason).map(
      ([key, value]) =>
        ({
          displayTextValue: value.label,
          key,
        } as INuverialSelectOption),
    );

    component.selectedReasons = rejectedReasons;

    component.saveNeedsCorrection();

    expect(closeSpy).toHaveBeenCalledWith(rejectedReasons.map(reason => reason.key));
  });

  it('should add the selected reason to the array', () => {
    component.formGroup.get(['rejectionReason'])?.setValue(component.rejectionReasonSelectOptions[0].key, {
      emitEvent: true,
    });
    expect(component.selectedReasons).toHaveLength(1);
  });

  it('should not add the selected reason to the array if it is already selected', () => {
    component.formGroup.get(['rejectionReason'])?.setValue(component.rejectionReasonSelectOptions[0].key, {
      emitEvent: true,
    });
    fixture.detectChanges();
    component.formGroup.get(['rejectionReason'])?.setValue(component.rejectionReasonSelectOptions[0].key, {
      emitEvent: true,
    });
    expect(component.selectedReasons).toHaveLength(1);
  });

  it('should not push if the reason does not exists', () => {
    component.formGroup.get(['rejectionReason'])?.setValue(component.rejectionReasonSelectOptions[0].key, {
      emitEvent: true,
    });
    expect(component.selectedReasons).toHaveLength(1);
    component.formGroup.get(['rejectionReason'])?.setValue('TEST', {
      emitEvent: true,
    });
    expect(component.selectedReasons).toHaveLength(1);
  });
});
