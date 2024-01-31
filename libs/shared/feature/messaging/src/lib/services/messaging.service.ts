import { Injectable } from '@angular/core';
import {
  ConversationModel,
  IConversation,
  IConversationParticipant,
  IConversationsPaginationResponse,
  NewConversationModel,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { UserStateService } from '@dsg/shared/feature/app-state';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { Filter, PagingRequestModel } from '@dsg/shared/utils/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly _referenceType: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _referenceId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _conversations: BehaviorSubject<ConversationModel[]> = new BehaviorSubject<ConversationModel[]>([]);

  public conversations$ = this._conversations.asObservable();

  constructor(
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _userStateService: UserStateService,
    private readonly _formRendererService: FormRendererService,
  ) {}

  public initialize(referenceType: string, referenceId: string) {
    this._referenceType.next(referenceType);
    this._referenceId.next(referenceId);
  }

  public getConversations$(filters: Filter[], pagingRequestModel: PagingRequestModel): Observable<IConversationsPaginationResponse<IConversation>> {
    const requestFilters: Filter[] = [
      ...filters,
      {
        field: 'referenceType',
        value: this._referenceType.getValue(),
      },
      {
        field: 'referenceId',
        value: this._referenceId.getValue(),
      },
    ];

    return this._workApiRoutesService.getConversations$(requestFilters, pagingRequestModel).pipe(
      tap(response => {
        const conversationModels = response.items.map(converstaion => new ConversationModel(converstaion));
        this._conversations.next([...this._conversations.getValue(), ...conversationModels]);
      }),
    );
  }

  public clearConversations() {
    this._conversations.next([]);
  }

  public createNewConversation$(messageBody: string, subject: string) {
    const newConversation = new NewConversationModel();

    newConversation.messageBody = messageBody;
    newConversation.subject = subject;
    newConversation.referenceId = this._referenceId.value;
    newConversation.referenceType = this._referenceType.value;

    return this._userStateService.user$.pipe(
      tap(user => {
        const participants: IConversationParticipant[] = [
          {
            participantId: user?.id || '',
            type: 'AGENCY',
          },
          {
            participantId: this._formRendererService.transaction.subjectProfileId,
            type: this._formRendererService.transaction.subjectProfileType,
          },
        ];
        newConversation.participants = participants;
      }),
      switchMap(() => this._workApiRoutesService.createConversation$(newConversation)),
    );
  }

  public cleanUp() {
    this._referenceType.next('');
    this._referenceId.next('');
    this._conversations.next([]);
  }
}
