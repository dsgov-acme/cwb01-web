import { Injectable } from '@angular/core';
import {
  FormConfigurationModel,
  IFormConfigurationSchema,
  ITransactionsPaginationResponse,
  RejectedDocument,
  TransactionModel,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { PagingRequestModel, PagingResponseModel } from '@dsg/shared/utils/http';
import { BehaviorSubject, Observable, catchError, concatMap, from, map, of, switchMap, tap, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _transactionDefinitionFormModelMap: Map<string, FormConfigurationModel> = new Map();
  private readonly _documentOrder: Map<string, string[]> = new Map();

  private readonly _activeTransactions$ = new BehaviorSubject<ITransactionsPaginationResponse<TransactionModel>>({
    items: [],
    pagingMetadata: new PagingResponseModel(),
  });
  private readonly _pastTransactions$ = new BehaviorSubject<ITransactionsPaginationResponse<TransactionModel>>({
    items: [],
    pagingMetadata: new PagingResponseModel(),
  });

  public activeTransactions$: Observable<ITransactionsPaginationResponse<TransactionModel>> = this._activeTransactions$.asObservable();
  public pastTransactions$: Observable<ITransactionsPaginationResponse<TransactionModel>> = this._pastTransactions$.asObservable();

  private _processTransactionItems(transactionItem: TransactionModel): Observable<TransactionModel> {
    const transactionModel = new TransactionModel(transactionItem);
    if (transactionModel.rejectedDocuments.length > 0 && !this._transactionDefinitionFormModelMap.has(transactionModel.transactionDefinitionKey)) {
      return this._handleFormConfigFetch(transactionModel);
    } else {
      transactionModel.rejectedDocuments = transactionModel.rejectedDocuments
        .map(rejectedDocumentItem => {
          let componentLabel = this._transactionDefinitionFormModelMap
            .get(transactionModel.transactionDefinitionKey)
            ?.getComponentLabelByKey(rejectedDocumentItem.dataPath);

          if (componentLabel && rejectedDocumentItem.index >= 0) componentLabel += ` - Document ${rejectedDocumentItem.index + 1}`;

          rejectedDocumentItem.label = componentLabel ?? rejectedDocumentItem.dataPath;

          return rejectedDocumentItem;
        })
        .sort((firstDoc, secondDoc) => this._sortRejectedDocuments(this._getDocumentOrder(transactionModel), firstDoc, secondDoc));

      return of(transactionModel);
    }
  }

  private _handleFormConfigFetch(transactionModel: TransactionModel) {
    return this.getFormConfigurationById$(transactionModel.id).pipe(
      catchError(_error => of(null)),
      map(formModel => {
        if (formModel) {
          this._transactionDefinitionFormModelMap.set(transactionModel.transactionDefinitionKey, formModel);
          transactionModel.rejectedDocuments = transactionModel.rejectedDocuments
            .map(rejectedDocumentItem => {
              let componentLabel = formModel.getComponentLabelByKey(rejectedDocumentItem.dataPath);
              if (rejectedDocumentItem.index >= 0) componentLabel += ` - Document ${rejectedDocumentItem.index + 1}`;

              rejectedDocumentItem.label = componentLabel !== '' ? componentLabel : rejectedDocumentItem.dataPath;

              return rejectedDocumentItem;
            })
            .sort((firstDoc, secondDoc) => this._sortRejectedDocuments(this._getDocumentOrder(transactionModel), firstDoc, secondDoc));
        }

        return transactionModel;
      }),
    );
  }

  private _getDocumentOrder(transactionModel: TransactionModel): string[] {
    const documentAttributes: string[] = [];

    if (!this._documentOrder.has(transactionModel.transactionDefinitionKey)) {
      const formComponents = this._transactionDefinitionFormModelMap.get(transactionModel.transactionDefinitionKey);

      formComponents?.components?.forEach(docComponent => {
        if (docComponent) {
          this._getDocumentKey(docComponent, documentAttributes);
        }
      });
      this._documentOrder.set(transactionModel.transactionDefinitionKey, documentAttributes);
    }

    return this._documentOrder.get(transactionModel.transactionDefinitionKey) || [];
  }

  private _getDocumentKey(docComponent: IFormConfigurationSchema, documentAttributes: string[]) {
    if (docComponent.components && (docComponent.type === 'nuverialFileUpload' || docComponent.type === 'nuverialMultipleFileUpload')) {
      const attributes = docComponent.components.map(component => component.key).filter(component => component !== undefined) as string[];
      documentAttributes.push(...attributes);
    } else if (docComponent.components) {
      for (const component of docComponent.components) {
        this._getDocumentKey(component, documentAttributes);
      }
    }
  }

  private _sortRejectedDocuments(sortOrder: string[], firstDoc: RejectedDocument, secondDoc: RejectedDocument) {
    const firstIdx = sortOrder.indexOf(firstDoc.dataPath);
    const secondIdx = sortOrder.indexOf(secondDoc.dataPath);

    if (firstIdx !== -1 && secondIdx !== -1) {
      if (firstIdx === secondIdx) {
        return firstDoc.index - secondDoc.index;
      }

      return firstIdx - secondIdx;
    }

    return 0;
  }

  private _getTransactions$(isCompleted: boolean, pagination: PagingRequestModel): Observable<ITransactionsPaginationResponse<TransactionModel>> {
    return this._workApiRoutesService.getAllTransactionsForUser$([{ field: 'isCompleted', value: isCompleted }], pagination).pipe(
      switchMap(transactionWithPagination =>
        from(transactionWithPagination.items).pipe(
          concatMap(transactionItem => this._processTransactionItems(transactionItem)),
          toArray(),
          map(items => ({
            items,
            pagingMetadata: transactionWithPagination.pagingMetadata,
          })),
        ),
      ),
      tap(transactionWithPagination => {
        if (isCompleted) {
          this._pastTransactions$.next({
            items: [...this._pastTransactions$.value.items, ...transactionWithPagination.items],
            pagingMetadata: transactionWithPagination.pagingMetadata,
          });
        } else {
          this._activeTransactions$.next({
            items: [...this._activeTransactions$.value.items, ...transactionWithPagination.items],
            pagingMetadata: transactionWithPagination.pagingMetadata,
          });
        }
      }),
      catchError(_error => {
        this._nuverialSnackBarService.notifyApplicationError();

        return of({
          items: [],
          pagingMetadata: new PagingResponseModel({
            nextPage: '',
            pageNumber: 1,
            pageSize: 0,
            totalCount: 0,
          }),
        });
      }),
    );
  }

  /**
   * loads the active form configuration of a given transaction
   * @param transactionId ID of the transaction
   * @returns an observable of the form configuration
   */
  public getFormConfigurationById$(transactionId: string): Observable<FormConfigurationModel> {
    return this._workApiRoutesService.getFormByTransactionId$(transactionId).pipe(map(formModel => formModel.formConfigurationModel));
  }

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService, private readonly _nuverialSnackBarService: NuverialSnackBarService) {}

  public loadActiveTransactions$(pagination: PagingRequestModel): Observable<ITransactionsPaginationResponse<TransactionModel>> {
    return this._getTransactions$(false, pagination);
  }

  public loadPastTransactions$(pagination: PagingRequestModel): Observable<ITransactionsPaginationResponse<TransactionModel>> {
    return this._getTransactions$(true, pagination);
  }

  public cleanUp(): void {
    this._activeTransactions$.next({
      items: [],
      pagingMetadata: new PagingResponseModel(),
    });
    this._pastTransactions$.next({
      items: [],
      pagingMetadata: new PagingResponseModel(),
    });
  }
}
