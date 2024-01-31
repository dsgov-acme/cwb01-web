import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { ConfirmationModalComponent, ConfirmationModalData } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  const mockDialogRef = {
    close: jest.fn(),
  };

  const mockData: ConfirmationModalData = {
    contentText: 'Test Confirmation Button',
    primaryAction: 'Modal text',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent],
      providers: [MockProvider(LoggingAdapter), { provide: MAT_DIALOG_DATA, useValue: mockData }, { provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
