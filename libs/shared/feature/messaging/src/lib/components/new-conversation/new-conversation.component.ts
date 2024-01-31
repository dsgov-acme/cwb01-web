import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FooterAction,
  FormErrorsFromGroup,
  IFormError,
  MarkAllControlsAsTouched,
  NuverialButtonComponent,
  NuverialFooterActionsComponent,
  NuverialFormErrorsComponent,
  NuverialIconComponent,
  NuverialRichTextEditorComponent,
  NuverialSnackBarService,
  NuverialTextInputComponent,
} from '@dsg/shared/ui/nuverial';
import { EMPTY, catchError, take, tap } from 'rxjs';
import { MessagingService } from '../../services';

enum Actions {
  send = 'send',
  cancel = 'cancel',
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NuverialTextInputComponent,
    NuverialRichTextEditorComponent,
    NuverialFooterActionsComponent,
    NuverialIconComponent,
    NuverialButtonComponent,
    NuverialFormErrorsComponent,
  ],
  selector: 'dsg-new-conversation',
  standalone: true,
  styleUrls: ['./new-conversation.component.scss'],
  templateUrl: './new-conversation.component.html',
})
export class NewConversationComponent {
  //Order disabled to match the order of the form in the form errors component
  /* eslint-disable sort-keys */
  public newConversationForm = new FormGroup({
    subject: new FormControl<string>('', [Validators.required]),
    body: new FormControl<string>('', [Validators.required]),
  });
  /* eslint-enable sort-keys */

  public formErrors: IFormError[] = [];
  public formConfigs = {
    body: {
      id: 'conversation-form-body',
      label: 'Message',
    },
    subject: {
      id: 'conversation-form-subject',
      label: 'Subject',
    },
  };

  public actions: FooterAction[] = [
    {
      key: Actions.send,
      uiClass: 'Primary',
      uiLabel: 'Send',
    },
    {
      key: Actions.cancel,
      uiClass: 'Secondary',
      uiLabel: 'Cancel',
    },
  ];

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _messagingService: MessagingService,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  private _createNewMessage() {
    this.formErrors = [];

    if (!this.newConversationForm.valid) {
      this.formErrors = FormErrorsFromGroup(this.newConversationForm, this.formConfigs);
      MarkAllControlsAsTouched(this.newConversationForm);

      return;
    }

    const newConversation = this.newConversationForm.value;
    this._messagingService
      .createNewConversation$(newConversation.body ?? '', newConversation.subject ?? '')
      .pipe(
        tap(() => {
          this._nuverialSnackBarService.notifyApplicationSuccess('New Message Sent');
          this._router.navigate(['../'], { relativeTo: this._route });
        }),
        catchError(() => {
          this._cdr.markForCheck();
          this._nuverialSnackBarService.notifyApplicationError();

          return EMPTY;
        }),
        take(1),
      )
      .subscribe();
  }

  public onActionClick(event: string) {
    switch (event) {
      case Actions.send:
        this._createNewMessage();
        break;
      case Actions.cancel:
        this._router.navigate(['../'], { relativeTo: this._route });
        break;
    }
  }
}
