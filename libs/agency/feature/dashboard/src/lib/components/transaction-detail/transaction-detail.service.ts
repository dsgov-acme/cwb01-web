import { Injectable } from '@angular/core';
import { AuditEventModel } from '@dsg/shared/data-access/audit-api';
import { DocumentApiRoutesService, IProcessingResultSchema, checkIfDocumentShouldDisplayErrors } from '@dsg/shared/data-access/document-api';
import { UserApiRoutesService, UserModel } from '@dsg/shared/data-access/user-api';
import {
  EnumMapType,
  ICustomerProvidedDocument,
  ICustomerProvidedDocumentGroup,
  IEnumData,
  ITransactionActiveTask,
  NoteModel,
  TransactionData,
  TransactionModel,
  UpdateTransactionOptions,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService, UserStateService } from '@dsg/shared/feature/app-state';
import { EventsLogService } from '@dsg/shared/feature/events';
import { FormRendererService } from '@dsg/shared/feature/form-nuv';
import { MessagingService } from '@dsg/shared/feature/messaging';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { Filter, PagingRequestModel, PagingResponseModel } from '@dsg/shared/utils/http';
import { get } from 'lodash';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  catchError,
  combineLatest,
  concatMap,
  firstValueFrom,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
  toArray,
  zip,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionDetailService {
  private readonly _user: ReplaySubject<UserModel> = new ReplaySubject<UserModel>(1);
  private readonly _events: ReplaySubject<AuditEventModel[]> = new ReplaySubject<AuditEventModel[]>(1);
  private readonly _eventsPagination: BehaviorSubject<PagingResponseModel> = new BehaviorSubject<PagingResponseModel>(new PagingResponseModel());
  private readonly _notes: BehaviorSubject<NoteModel[]> = new BehaviorSubject<NoteModel[]>([]);
  private readonly _notesPagination: BehaviorSubject<PagingResponseModel> = new BehaviorSubject<PagingResponseModel>(new PagingResponseModel());
  private readonly _transactionData: BehaviorSubject<TransactionData> = new BehaviorSubject({});
  private readonly _customerProvidedDocuments: BehaviorSubject<ICustomerProvidedDocument[]> = new BehaviorSubject<ICustomerProvidedDocument[]>([]);
  private readonly _agents: BehaviorSubject<UserModel[]> = new BehaviorSubject<UserModel[]>([]);
  private readonly _agentsPagination: BehaviorSubject<PagingResponseModel> = new BehaviorSubject<PagingResponseModel>(new PagingResponseModel());
  private readonly _processingResults: Map<string, IProcessingResultSchema[]> = new Map<string, IProcessingResultSchema[]>();

  public user$: Observable<UserModel> = this._user.asObservable();
  public events$: Observable<AuditEventModel[]> = this._events.asObservable();
  public eventsPagination$: Observable<PagingResponseModel> = this._eventsPagination.asObservable();
  public notes$: Observable<NoteModel[]> = this._notes.asObservable();
  public notesPagination$: Observable<PagingResponseModel> = this._notesPagination.asObservable();
  public transactionActiveTask$: Observable<ITransactionActiveTask | undefined> = this._formRendererService.transaction$.pipe(
    // We currently assume that there can be a maximum of one active task
    map(transaction => (transaction.activeTasks.length > 0 ? transaction.activeTasks[0] : undefined)),
  );

  public customerProvidedDocuments$: Observable<ICustomerProvidedDocumentGroup[]> = this._customerProvidedDocuments.asObservable().pipe(
    switchMap(documents => {
      return combineLatest({
        documents: of(documents),
        transactionData: this._transactionData,
      });
    }),
    map(({ documents, transactionData }) => {
      // Sort documents as they are in the form configuration
      const docBucketKeys = documents.map(document => document.parentKey).filter((key): key is string => !!key);
      const sortedDocBucketKeys = this._formRendererService.formConfiguration.findComponentsKeyInOrder(docBucketKeys);

      const keyToDocumentMap: Map<string, ICustomerProvidedDocument[]> = new Map();
      documents.forEach(document => {
        if (document.parentKey) {
          if (keyToDocumentMap.has(document.parentKey)) {
            keyToDocumentMap.get(document.parentKey)?.push(document);
          } else {
            keyToDocumentMap.set(document.parentKey, [document]);
          }
        }
      });

      return sortedDocBucketKeys
        .map(key => keyToDocumentMap.get(key)?.filter(doc => !!doc))
        .map(mappedDocuments => mappedDocuments as ICustomerProvidedDocument[])
        .map(mappedDocuments => ({
          customerProvidedDocuments: mappedDocuments,
          hasIssues: mappedDocuments.some(doc => (doc.shouldDisplayErrors && doc.processingResult) || doc.reviewStatus === 'REJECTED'),
          isMultipleFileUpload: mappedDocuments.length > 1 && mappedDocuments.every((doc, i, arr) => i === 0 || doc.dataPath === arr[i - 1].dataPath),
        }))
        .map(docGroup => {
          // Order files in the same order as they are in the form configuration
          if (docGroup.isMultipleFileUpload) {
            const transactionDataDocuments = get(transactionData, docGroup.customerProvidedDocuments[0].dataPath);
            const customerProvidedDocuments = docGroup.customerProvidedDocuments;

            if (!transactionDataDocuments || !Array.isArray(transactionDataDocuments)) return docGroup;

            const docIndices: Map<string, number> = new Map(transactionDataDocuments.map((document, i) => [document.documentId, i]));
            if (docIndices.size !== customerProvidedDocuments.length) return docGroup;

            const sortedCustomerProvidedDocuments = new Array<ICustomerProvidedDocument>(docIndices.size);
            for (const document of customerProvidedDocuments) {
              const index = docIndices.get(document.id);
              if (index === undefined) return;

              sortedCustomerProvidedDocuments[index] = document;
            }

            docGroup.customerProvidedDocuments = sortedCustomerProvidedDocuments;
          }

          return docGroup;
        })
        .filter(docGroup => !!docGroup && docGroup.customerProvidedDocuments.length > 0) as ICustomerProvidedDocumentGroup[];
    }),
  );
  public agents$: Observable<UserModel[]> = this._agents.asObservable();
  public agentsPagination$: Observable<PagingResponseModel> = this._agentsPagination.asObservable();

  /**
   * Get the transaction user
   */

  private _getUserById$(userId: string): Observable<UserModel> {
    return this._userApiRoutesService.getUserById$(userId).pipe(tap(userModel => this._user.next(userModel)));
  }

  private _getNotes$(transactionId: string, pagingRequestModel?: PagingRequestModel): Observable<NoteModel[]> {
    return this._workApiRoutesService.getNotes$(transactionId, pagingRequestModel).pipe(
      tap(notesPaginationResp => this._notesPagination.next(notesPaginationResp.pagingMetadata)),
      switchMap(notesPaginationResp =>
        from(notesPaginationResp.items).pipe(
          concatMap(async note => {
            note.lastCreatedByDisplayName = await firstValueFrom(this._userStateService.getUserDisplayName$(note.createdBy));
            note.lastUpdatedByDisplayName = await firstValueFrom(this._userStateService.getUserDisplayName$(note.lastUpdatedBy));

            return note;
          }),
          toArray(),
        ),
      ),
      tap(notes => {
        this._notes.next([...this._notes.value, ...notes]);
      }),
    );
  }

  public get transactionId(): string {
    return this._formRendererService.transactionId;
  }

  public get eventsPagination(): PagingResponseModel {
    return this._eventsPagination.value;
  }

  public get notesPagination(): PagingResponseModel {
    return this._notesPagination.value;
  }

  public get notes(): NoteModel[] {
    return this._notes.value;
  }

  constructor(
    private readonly _documentApiRoutesService: DocumentApiRoutesService,
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _userApiRoutesService: UserApiRoutesService,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    public workApiRoutesService: WorkApiRoutesService,
    private readonly _userStateService: UserStateService,
    private readonly _formRendererService: FormRendererService,
    private readonly _enumerationsStateService: EnumerationsStateService,
    private readonly _messagingService: MessagingService,
    private readonly _eventsLogService: EventsLogService,
  ) {}

  public initialize$(transactionId: string) {
    return this._formRendererService.loadTransactionDetails$(transactionId).pipe(
      tap(() => this._messagingService.initialize('TRANSACTION', transactionId)),
      tap(() => this._eventsLogService.initialize('transaction', transactionId)),
      switchMap(([_, transactionModel]) => {
        const transactionDetailsRequests: Array<Observable<unknown>> = [];

        transactionModel.customerProvidedDocuments?.forEach(document => {
          document.isErrorTooltipOpen = false;

          transactionDetailsRequests.push(
            this.getProcessingResults$(document.id).pipe(
              tap(results => {
                document.processingResult = results;
                document.shouldDisplayErrors = checkIfDocumentShouldDisplayErrors(document.processingResult) > 0;
              }),
              catchError(_error => of([])),
            ),
          );
        });

        if (transactionModel.assignedTo) {
          transactionDetailsRequests.push(this.loadAssignedAgent$(transactionModel.assignedTo).pipe(catchError(_error => of({}))));
        }

        transactionDetailsRequests.push(this.loadUser$(transactionModel.subjectUserId).pipe(catchError(_error => of({}))));

        this._transactionData.next(transactionModel.data);

        return forkJoin(transactionDetailsRequests);
      }),
    );
  }

  public loadUser$(userId: string): Observable<UserModel> {
    return this._getUserById$(userId);
  }

  public getDocumentRejectionReasons$(): Observable<Map<string, IEnumData>> {
    return this._enumerationsStateService.getEnumMap$(EnumMapType.DocumentRejectionReasons);
  }

  public updateCustomerProvidedDocument(
    transactionId: string,
    documentId: string,
    customerProvidedDocument: ICustomerProvidedDocument,
  ): Observable<ICustomerProvidedDocument> {
    return this._workApiRoutesService.updateTransactionDocumentsById$(transactionId, documentId, customerProvidedDocument).pipe(
      mergeMap(document => {
        const processingResults = structuredClone(this._processingResults.get(document.id));
        if (processingResults) {
          document.processingResult = processingResults;
          document.shouldDisplayErrors = checkIfDocumentShouldDisplayErrors(processingResults) > 0;

          return of(document);
        }

        return zip(of(document), this.getProcessingResults$(document.id)).pipe(
          map(([updatedDocument, updatedProcessingResults]) => {
            updatedDocument.processingResult = updatedProcessingResults;
            updatedDocument.shouldDisplayErrors = checkIfDocumentShouldDisplayErrors(updatedDocument.processingResult) > 0;

            return updatedDocument;
          }),
        );
      }),
      switchMap(async updatedDocument => {
        const mappedUpdatedDocument = await this._mapDocumentForRendering(updatedDocument);
        const updatedDocuments = this._customerProvidedDocuments.value.map(doc => (doc.id === mappedUpdatedDocument.id ? mappedUpdatedDocument : doc));
        this._customerProvidedDocuments.next(updatedDocuments);

        return mappedUpdatedDocument;
      }),
    );
  }

  public storeCustomerDocuments$(): Observable<ICustomerProvidedDocument[]> {
    if (this._customerProvidedDocuments.value.length) return of(this._customerProvidedDocuments.value);

    const transaction = this._formRendererService.transaction;

    if (!transaction || !transaction.customerProvidedDocuments || transaction.customerProvidedDocuments.length === 0) {
      return EMPTY;
    }

    return of(transaction.customerProvidedDocuments).pipe(
      switchMap(async documents => {
        const mappedDocuments: ICustomerProvidedDocument[] = [];
        for (const document of documents) {
          mappedDocuments.push(await this._mapDocumentForRendering(document));
        }

        return mappedDocuments;
      }),
      tap(mappedDocuments => {
        this._customerProvidedDocuments.next(mappedDocuments);
      }),
    );
  }

  public createNote$(transactionId: string, noteModel: NoteModel): Observable<NoteModel> {
    return this.workApiRoutesService.createNote$(transactionId, noteModel);
  }

  public loadNotes$(transactionId: string, pagingRequestModel?: PagingRequestModel): Observable<NoteModel[]> {
    return this._getNotes$(transactionId, pagingRequestModel);
  }

  public getProcessingResults$(documentId: string): Observable<IProcessingResultSchema[]> {
    return this._documentApiRoutesService.getProcessingResults$(documentId).pipe(
      tap(results => {
        this._processingResults.set(documentId, structuredClone(results));
      }),
    );
  }

  public clearEvents() {
    this._events.next([]);
  }

  public clearNotes() {
    this._notes.next([]);
  }

  public clearCustomerProvidedDocuments() {
    this._customerProvidedDocuments.next([]);
  }

  public deleteNote$(transactionId: string, noteId: string): Observable<void> {
    return this._workApiRoutesService.deleteNote$(transactionId, noteId).pipe(
      tap(() => {
        return this._notes
          .pipe(
            take(1),
            tap(notes => {
              const updatedNotes = notes.filter(note => note.id !== noteId);
              this._notes.next(updatedNotes);
            }),
          )
          .subscribe();
      }),
      catchError(_error => {
        this._nuverialSnackBarService.notifyApplicationError();

        return EMPTY;
      }),
    );
  }

  public loadAssignedAgent$(userId: string): Observable<UserModel | undefined> {
    return this._userStateService.getUserById$(userId).pipe(
      tap(userModel => {
        if (!userModel) return;

        if (!this._agents.value.some(agents => agents.id === userId)) {
          this._agents.next([...this._agents.value, userModel]);
        }
      }),
    );
  }

  public loadAgencyUsers$(filters?: Filter[], pagingRequestModel?: PagingRequestModel): Observable<UserModel[]> {
    return this._getAgents$(filters, pagingRequestModel);
  }

  private _getAgents$(filters: Filter[] = [], pagingRequestModel?: PagingRequestModel): Observable<UserModel[]> {
    filters.push({ field: 'userType', value: 'agency' });

    return this._userApiRoutesService.getUsers$(filters, pagingRequestModel).pipe(
      tap(usersPaginationResp => {
        this._agentsPagination.next(usersPaginationResp.pagingMetadata);

        // Filter out existing users (agents)
        const newAgents = usersPaginationResp.users.filter(user => {
          return !this._agents.value.some(existingAgent => existingAgent.id === user.id);
        });

        this._agents.next([...this._agents.value, ...newAgents].sort((a, b) => a.displayName.localeCompare(b.displayName)));
      }),
      map(usersPaginationResp => usersPaginationResp.users),
    );
  }

  public updateTransactionPriority$(priority: string): Observable<TransactionModel> {
    const transactionModel = new TransactionModel();
    transactionModel.priority = priority;
    const updateTransactionOptions: UpdateTransactionOptions = {
      transaction: transactionModel.toPrioritySchema(),
      transactionId: this.transactionId,
    };

    return this._workApiRoutesService.updateTransactionById$(updateTransactionOptions);
  }

  public updateTransactionAssignedTo$(assignedTo: string): Observable<TransactionModel> {
    const transactionModel = new TransactionModel();
    transactionModel.assignedTo = assignedTo;

    const updateTransactionOptions: UpdateTransactionOptions = {
      transaction: transactionModel.toAssignedToSchema(),
      transactionId: this.transactionId,
    };

    return this._workApiRoutesService.updateTransactionById$(updateTransactionOptions);
  }

  public reviewTransaction$(action: string, taskId: string): Observable<TransactionModel> {
    const transactionModel = new TransactionModel();
    const updateTransactionOptions: UpdateTransactionOptions = {
      completeTask: true,
      taskId,
      transaction: transactionModel.toActionSchema(action),
      transactionId: this.transactionId,
    };

    return this._workApiRoutesService.updateTransactionById$(updateTransactionOptions).pipe(
      tap(updatedTransaction => {
        this._formRendererService.transaction = updatedTransaction;
      }),
    );
  }

  public getNoteById$(transactionId: string, noteId: string): Observable<NoteModel> {
    return this._workApiRoutesService.getNote$(transactionId, noteId);
  }

  public editNote$(transactionId: string, noteId: string, noteModel: NoteModel): Observable<NoteModel> {
    return this._workApiRoutesService.updateNote$(transactionId, noteId, noteModel);
  }

  private async _mapDocumentForRendering(document: ICustomerProvidedDocument): Promise<ICustomerProvidedDocument> {
    const formElement = this._formRendererService.formConfiguration.getComponentDataByKey(document.dataPath);
    const splitLabel = formElement.label.split(' - ');

    return {
      ...document,
      label: splitLabel.length > 1 ? splitLabel[1] : formElement.label,
      parentKey: formElement.parent?.key || '',
      parentLabel: splitLabel.length > 1 ? splitLabel[0] : formElement.label,
      reviewedByDisplayName: await firstValueFrom(this._userStateService.getUserDisplayName$(document.reviewedBy)),
    };
  }

  /**
   * clean up and reset state
   */
  public cleanUp() {
    this._user.next(new UserModel());
    this._events.next([]);
    this._eventsPagination.next(new PagingResponseModel());
    this._notes.next([]);
    this.clearCustomerProvidedDocuments();
    this._messagingService.cleanUp();
    this._eventsLogService.cleanUp();
  }
}
