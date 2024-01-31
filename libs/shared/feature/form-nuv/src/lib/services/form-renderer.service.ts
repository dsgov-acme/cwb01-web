import { Injectable } from '@angular/core';
import { FormConfigurationModel, FormModel, TransactionModel, UpdateTransactionOptions, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { IFormError } from '@dsg/shared/ui/nuverial';
import { BehaviorSubject, Observable, filter, forkJoin, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormRendererService {
  private readonly _transactionId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _transaction: BehaviorSubject<TransactionModel> = new BehaviorSubject<TransactionModel>(new TransactionModel());
  private readonly _form: BehaviorSubject<FormModel> = new BehaviorSubject<FormModel>(new FormModel());
  private readonly _taskId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _formErrors: BehaviorSubject<IFormError[]> = new BehaviorSubject<IFormError[]>([]);

  /**
   * TransactionId getter, only used when you need the transactionId now
   */
  public get transactionId() {
    return this._transactionId.value;
  }

  /**
   * Transaction getter, only used when you need the value of a transaction now
   */
  public get transaction() {
    return this._transaction.value;
  }

  /**
   * Update the transaction behavior subject
   */
  public set transaction(value: TransactionModel) {
    this._transaction.next(value);
  }

  /**
   * From configuration getter, only used when you need the value of a form now
   */
  public get formConfiguration() {
    return this._form.value.formConfigurationModel;
  }

  /**
   * The transaction data
   */
  public transaction$: Observable<TransactionModel> = this._transaction.asObservable();

  /**
   * The form configuration used to render the form
   */
  public formConfiguration$: Observable<FormConfigurationModel> = this._form.asObservable().pipe(
    filter(formModel => !!formModel.formConfigurationModel),
    map(formModel => formModel.formConfigurationModel),
  );

  /**
   * FormErrors used to populate the form errors section above the form
   */
  public formErrors$: Observable<IFormError[]> = this._formErrors.asObservable();

  private _getFormConfiguration$(): Observable<FormModel> {
    return this._workApiRoutesService.getFormByTransactionId$(this._transactionId.value).pipe(
      tap(formModel => {
        this._form.next(formModel);
        this._taskId.next(formModel.taskName);
      }),
    );
  }

  private _getTransaction$(): Observable<TransactionModel> {
    return this._workApiRoutesService.getTransactionById$(this._transactionId.value).pipe(tap(transactionModel => this._transaction.next(transactionModel)));
  }

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService) {}

  /**
   * Load the transaction and formConfiguration
   */
  public loadTransactionDetails$(transactionId: string): Observable<[FormModel, TransactionModel]> {
    this._transactionId.next(transactionId);

    return forkJoin([this._getFormConfiguration$(), this._getTransaction$()]);
  }

  /**
   * Update the transaction
   */
  public updateTransaction$(completeTask?: boolean, formStepKey?: string): Observable<TransactionModel> {
    const updateOptions: UpdateTransactionOptions = {
      completeTask: completeTask,
      formStepKey: formStepKey,
      taskId: this._taskId.value,
      transaction: this._transaction.value.toDataSchema(),
      transactionId: this._transactionId.value,
    };

    return this._workApiRoutesService.updateTransactionById$(updateOptions).pipe(
      tap(transactionModel => {
        this._transaction.next(transactionModel);
      }),
    );
  }

  /**
   * Set the form configuration manually when configuration is not tied to transaction (builder)
   */
  public setFormConfiguration(formConfigurationModel: FormConfigurationModel) {
    const formModel = this._form.value;
    formModel.formConfigurationModel = formConfigurationModel;
    this._form.next(formModel);
  }

  /**
   * Set the form errors
   */
  public setFormErrors(errors: IFormError[]) {
    this._formErrors.next(errors);
  }

  /**
   * Reset form errors
   */
  public resetFormErrors() {
    this._formErrors.next([]);
  }

  /**
   * clean up and reset state
   */
  public cleanUp() {
    this._formErrors.next([]);
    this._transactionId.next('');
    this._transaction.next(new TransactionModel());
    this._form.next(new FormModel());
  }
}
