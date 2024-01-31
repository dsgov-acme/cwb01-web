import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { AlertModalComponent } from './alert-modal.component';

describe('AlertModalComponent', () => {
  let component: AlertModalComponent;
  let fixture: ComponentFixture<AlertModalComponent>;

  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertModalComponent],
      providers: [MockProvider(LoggingAdapter), { provide: MatDialogRef, useValue: mockDialogRef }, { provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog correctly', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
