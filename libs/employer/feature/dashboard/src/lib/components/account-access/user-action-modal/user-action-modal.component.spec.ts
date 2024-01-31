import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RolesMock, UserApiRoutesService } from '@dsg/shared/data-access/user-api';
import { ProfileAccessLevelsMock } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { UserActionModalComponent, UserActionModalModes } from './user-action-modal.component';

const formValueMock = {
  emailAddress: 'test@test.com',
  role: 'ADMIN',
};

describe('UserActionModalComponent', () => {
  let component: UserActionModalComponent;
  let fixture: ComponentFixture<UserActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActionModalComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingAdapter),
        MockProvider(MatDialogRef, {
          close: jest.fn(),
        }),
        MockProvider(UserApiRoutesService, {
          getRoles$: jest.fn().mockImplementation(() => of(RolesMock)),
        }),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        MockProvider(EnumerationsStateService, {
          getEnumMap$: jest.fn().mockImplementation(() => of(ProfileAccessLevelsMock)),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with a valid form', () => {
    component.formGroup.setValue(formValueMock);
    const dialog = ngMocks.findInstance(MatDialogRef);
    const closeSpy = jest.spyOn(dialog, 'close');
    const submitSpy = jest.spyOn(component, 'submit');

    const submitButton = fixture.debugElement.query(By.css('.user-action__submit'));

    submitButton.nativeElement.click();

    expect(submitSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledWith(formValueMock);
  });

  it('should have a disable submit button if the form is not valid', () => {
    const submitButton = fixture.debugElement.query(By.css('.user-action__submit button'));

    expect(submitButton.attributes['disabled']).toBeTruthy();
  });

  it('should not close dialog if form is not valid', () => {
    const dialog = ngMocks.findInstance(MatDialogRef);
    const closeSpy = jest.spyOn(dialog, 'close');
    const formSpy = jest.spyOn(component.formGroup, 'updateValueAndValidity');

    component.submit();

    expect(closeSpy).not.toHaveBeenCalled();
    expect(formSpy).toHaveBeenCalled();
  });

  it('should return correct text', () => {
    component.dialogMode = UserActionModalModes.invite;

    expect(component.submitText).toBe('SEND INVITE');
    expect(component.dialogLabel).toBe('Invite User');
  });
});
