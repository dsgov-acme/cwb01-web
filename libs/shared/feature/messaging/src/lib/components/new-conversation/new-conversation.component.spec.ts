import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NewConversationResponseMock } from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { MessagingService } from '../../services';
import { NewConversationComponent } from './new-conversation.component';

describe('NewConversationComponent', () => {
  let component: NewConversationComponent;
  let fixture: ComponentFixture<NewConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewConversationComponent, NoopAnimationsModule],
      providers: [
        MockProvider(LoggingService),
        MockProvider(Router),
        MockProvider(ActivatedRoute),
        MockProvider(NuverialSnackBarService),
        MockProvider(MessagingService, {
          createNewConversation$: jest.fn().mockImplementation(() => of(NewConversationResponseMock)),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onActionClick', () => {
    it('should navigate back if the user cancels', () => {
      const event = 'cancel';

      const route = ngMocks.findInstance(ActivatedRoute);
      const router = ngMocks.findInstance(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.onActionClick(event);

      expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: route });
    });

    it('should set formErrors and not create if form is invalid', () => {
      const event = 'send';
      component.newConversationForm.setValue({
        body: '<p>Test body</p>',
        subject: '',
      });
      const service = ngMocks.findInstance(MessagingService);
      const spy = jest.spyOn(service, 'createNewConversation$');

      component.onActionClick(event);

      expect(component.formErrors.length).toBeGreaterThan(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create conversation and navigate to messages if the form is valid', () => {
      const event = 'send';
      const mockForm = {
        body: '<p>Test body</p>',
        subject: 'Test subject',
      };
      component.newConversationForm.setValue(mockForm);

      const messagingService = ngMocks.findInstance(MessagingService);
      const createSpy = jest.spyOn(messagingService, 'createNewConversation$');
      const route = ngMocks.findInstance(ActivatedRoute);
      const router = ngMocks.findInstance(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');

      component.onActionClick(event);

      expect(component.formErrors.length).toEqual(0);
      expect(createSpy).toHaveBeenCalledWith(mockForm.body, mockForm.subject);
      expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: route });
      expect(successSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    it('should handle error when loading conversations', () => {
      const event = 'send';
      const mockForm = {
        body: '<p>Test body</p>',
        subject: 'Test subject',
      };
      component.newConversationForm.setValue(mockForm);

      const messagingService = ngMocks.findInstance(MessagingService);
      const createSpy = jest.spyOn(messagingService, 'createNewConversation$').mockImplementation(() => throwError(() => new Error()));
      const router = ngMocks.findInstance(Router);
      const navigateSpy = jest.spyOn(router, 'navigate');
      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const errorSpy = jest.spyOn(snackService, 'notifyApplicationError');

      component.onActionClick(event);

      expect(component.formErrors.length).toEqual(0);
      expect(createSpy).toHaveBeenCalledWith(mockForm.body, mockForm.subject);
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
