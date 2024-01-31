import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef } from '@angular/material/dialog';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { UnsavedStepModalComponent, UnsavedStepModalReponses } from './unsaved-step-modal.component';

describe('UnsavedStepModalComponent', () => {
  let component: UnsavedStepModalComponent;
  let fixture: ComponentFixture<UnsavedStepModalComponent>;

  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsavedStepModalComponent],
      providers: [MockProvider(LoggingAdapter), { provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsavedStepModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with SaveAndcontinue response on save & continue', () => {
    component.saveAndcontinue();
    expect(mockDialogRef.close).toHaveBeenCalledWith(UnsavedStepModalReponses.SaveAndcontinue);
  });
  it('should close the dialog with ProceedWithoutChanges response on proceed without changes', () => {
    component.proceedWithoutChanges();
    expect(mockDialogRef.close).toHaveBeenCalledWith(UnsavedStepModalReponses.ProceedWithoutChanges);
  });
});
