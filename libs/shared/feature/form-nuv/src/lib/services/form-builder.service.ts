import { Injectable } from '@angular/core';
import {
  FormConfigurationModel,
  FormMetadataModel,
  IForm,
  IFormConfigurationSchema,
  IFormMetaData,
  IRendererFormConfigurationSchema,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { FormioForm } from '@formio/angular';
import { map, Observable, ReplaySubject } from 'rxjs';
import { FormRendererService } from '.';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  /** The initial loaded form components from the api */
  private readonly _initialFormComponents: ReplaySubject<FormConfigurationModel> = new ReplaySubject(1);
  /** The updated form components, not yet saved to the api */
  private readonly _updatedFormComponents: ReplaySubject<FormConfigurationModel> = new ReplaySubject(1);
  private readonly _formMetaData: ReplaySubject<FormMetadataModel> = new ReplaySubject(1);

  private _formWrapper!: IForm;

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService, private readonly _formRendererService: FormRendererService) {}

  /** Map the form configuration to the intake form configuration */
  public intakeFormFields$: Observable<IRendererFormConfigurationSchema[]> = this._updatedFormComponents
    .asObservable()
    .pipe(map(formConfigurationModel => structuredClone(formConfigurationModel.toIntakeForm())));

  public builderFormFields$: Observable<FormioForm> = this._updatedFormComponents
    .asObservable()
    .pipe(map(formConfigurationModel => structuredClone(formConfigurationModel.toFormioBuilderForm())));

  /** Map the form configuration to the review form configuration */
  public reviewFormFields$: Observable<IRendererFormConfigurationSchema[]> = this._updatedFormComponents
    .asObservable()
    .pipe(map(formConfigurationModel => structuredClone(formConfigurationModel.toReviewForm())));

  public metaDataFields$: Observable<IFormMetaData> = this._formMetaData.asObservable();

  /** Get the form configuration from the api and map to the formio builder form json*/
  public getFormConfigurationByKey$(transactionDefinitionKey: string, key: string): Observable<FormioForm> {
    const observable = this._workApiRoutesService.getFormConfigurationByKey$(transactionDefinitionKey, key);

    return this._processFormConfigurationObservable(observable, transactionDefinitionKey, key);
  }

  private _processFormConfigurationObservable(_observable$: Observable<IForm>, transactionDefinitionKey: string, key: string): Observable<FormioForm> {
    return _observable$.pipe(
      map(formConfigurationWrapper => {
        this._formWrapper = formConfigurationWrapper;
        this._formWrapper.transactionDefinitionKey = transactionDefinitionKey;
        this._formWrapper.key = key;

        const formConfigurationModel = new FormConfigurationModel(formConfigurationWrapper.configuration.components);
        this._initialFormComponents.next(formConfigurationModel);
        this._updatedFormComponents.next(formConfigurationModel);
        this._formRendererService.setFormConfiguration(formConfigurationModel);

        const formMetaDataModel = new FormMetadataModel(formConfigurationWrapper);
        this._formMetaData.next(formMetaDataModel);

        return formConfigurationModel;
      }),
      map(formConfigurationModel => structuredClone(formConfigurationModel.toFormioBuilderForm())),
    );
  }

  /** Clean up the form json and store the updated form,
   * also converts the formio json to formly json
   */
  public updateFormComponents(formComponents: IFormConfigurationSchema[]): {
    formioJson: IFormConfigurationSchema[];
    formlyJson: IRendererFormConfigurationSchema[];
  } {
    const formConfigurationModel = new FormConfigurationModel(formComponents, true);
    this._updatedFormComponents.next(formConfigurationModel);
    this._formRendererService.setFormConfiguration(formConfigurationModel);

    return {
      formioJson: formConfigurationModel.toFormioJson(),
      formlyJson: formConfigurationModel.toFormlyJson(),
    };
  }

  /** Clean up the form json and store the updated form,
   * also converts the formio json to formly json
   */
  public updateFormConfiguration(formComponents: IFormConfigurationSchema[], transactionDefinitionKey: string, key: string): Observable<FormioForm> {
    this._formWrapper.configuration.components = formComponents;
    const observable$ = this._workApiRoutesService.updateFormConfiguration$(this._formWrapper, transactionDefinitionKey, key);

    return this._processFormConfigurationObservable(observable$, transactionDefinitionKey, key);
  }

  public updateMetaData(metaData: IFormMetaData): Observable<IFormMetaData> {
    this._formWrapper.name = metaData.name;
    this._formWrapper.schemaKey = metaData.schemaKey;
    this._formWrapper.description = metaData.description;
    const updateFormConfiguration$ = this._workApiRoutesService.updateFormConfiguration$(this._formWrapper, metaData.transactionDefinitionKey, metaData.key);

    return updateFormConfiguration$.pipe(
      map(formConfiguration => {
        formConfiguration.transactionDefinitionKey = metaData.transactionDefinitionKey;
        formConfiguration.key = metaData.key;
        const transactionMetaDataModel = new FormMetadataModel(formConfiguration);

        return transactionMetaDataModel;
      }),
      map(formConfigurationModel => structuredClone(formConfigurationModel.toSchema())),
    );
  }

  public cleanUp() {
    this._initialFormComponents.next(new FormConfigurationModel());
    this._formWrapper = {} as IForm;
    this._formRendererService.cleanUp();
  }
}
