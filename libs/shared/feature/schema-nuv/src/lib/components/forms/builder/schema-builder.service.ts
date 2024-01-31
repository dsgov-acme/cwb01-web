import { Injectable } from '@angular/core';
import {
  ISchemaAttributeConfigurations,
  ISchemaDefinitionAttributes,
  ISchemaMetaData,
  ISchemaTreeDefinition,
  ISchemaTreeDefinitionAttributes,
  SchemaDefinitionModel,
  SchemaMetadataModel,
  SchemaTreeDefinitionModel,
  WorkApiRoutesService,
} from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { FormioForm } from '@formio/angular';
import { BehaviorSubject, EMPTY, Observable, ReplaySubject, catchError, forkJoin, map, switchMap, tap } from 'rxjs';
import { AttributeTypes } from '../../base/formio/formio-attribute-base.model';

type CounterMap = Record<string, number>;

@Injectable({
  providedIn: 'root',
})
export class SchemaBuilderService {
  /** Initial loaded schema tree from the API */
  private _initialSchemaTree!: BehaviorSubject<SchemaTreeDefinitionModel>;
  /** Updated schema tree, not yet saved to the API */
  private readonly _updatedSchemaTree: ReplaySubject<SchemaTreeDefinitionModel> = new ReplaySubject(1);

  private readonly _schemaAttributes: BehaviorSubject<ISchemaTreeDefinition[]> = new BehaviorSubject<ISchemaTreeDefinition[]>([]);

  private readonly _schemaMetaData: ReplaySubject<SchemaMetadataModel> = new ReplaySubject(1);

  private _schemaWrapper!: SchemaDefinitionModel;

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService, private readonly _nuverialSnackbarService: NuverialSnackBarService) {}

  public metaDataFields$: Observable<ISchemaMetaData> = this._schemaMetaData.asObservable();

  public schemaBuilderFormFields$: Observable<FormioForm> = this._updatedSchemaTree.asObservable().pipe(
    map(schemaTree => {
      const form = this._toSchemaBuilderForm(schemaTree);
      this.getSchemaTreeAtrributes(form);

      return form;
    }),
  );

  private _getType(type: string): string {
    if (type === 'DynamicEntity') return 'Schema';

    return type;
  }

  private _toSchemaBuilderForm(schema: SchemaTreeDefinitionModel): FormioForm {
    // Formio appends numbers to attribute keys if the type already exists the form components
    const counterMap: CounterMap = {};

    const components = schema.attributes.map(attribute => {
      if (!attribute.concatenatedContentType && attribute.type === 'List') {
        if (attribute.contentType === 'DynamicEntity') {
          attribute.concatenatedContentType = `${attribute.contentType}-${attribute.entitySchema}`;
        } else {
          attribute.concatenatedContentType = attribute.contentType;
        }
      }

      const type = this._getType(attribute.type);
      if (counterMap[type] === undefined) counterMap[type] = 0;

      const key = type.toLowerCase() + (counterMap[type] === 0 ? '' : counterMap[type].toString());

      let processorString = '';
      if (
        attribute.attributeConfigurations &&
        attribute.attributeConfigurations.length &&
        attribute.attributeConfigurations[0]['processorId'] &&
        (attribute.type === AttributeTypes.DOCUMENT || attribute.concatenatedContentType === AttributeTypes.DOCUMENT)
      ) {
        processorString = JSON.stringify(
          attribute.attributeConfigurations.map((attributeConfiguration: ISchemaAttributeConfigurations) => attributeConfiguration['processorId']),
        );
      }

      if (attribute.concatenatedContentType) {
        if (attribute.concatenatedContentType && attribute.concatenatedContentType.startsWith('DynamicEntity-')) {
          const parts = attribute.concatenatedContentType.split('-');
          attribute.contentType = parts[0];
          attribute.entitySchema = parts[1];
        } else {
          attribute.contentType = attribute.concatenatedContentType;
          delete attribute.entitySchema;
        }
      }

      const formAttribute = this._getFormAttribute(attribute, key, type, processorString);
      counterMap[type]++;

      return formAttribute;
    });

    const builderForm: FormioForm = {
      components: components,
    };

    return builderForm;
  }

  private _getFormAttribute(attribute: ISchemaTreeDefinitionAttributes, key: string, type: string, processorString: string) {
    return {
      input: true,
      key: key,
      label: '',
      props: {
        name: attribute.name,
        ...(attribute.entitySchema && attribute.schema && { selectedSchema: structuredClone(attribute.schema) }),
        ...(processorString && { processors: processorString }),
        ...(attribute.concatenatedContentType && { concatenatedContentType: attribute.concatenatedContentType }),
      },
      tableView: false,
      type: type,
      ...(attribute.contentType && { contentType: attribute.contentType }),
      ...(attribute.entitySchema && { entitySchema: attribute.entitySchema }),
      ...(attribute.concatenatedContentType && { concatenatedContentType: attribute.concatenatedContentType }),
    };
  }

  /** Generates the schema attributes from the formio form for displaying children schemas in the schema builder
   */
  public getSchemaTreeAtrributes(form: FormioForm): void {
    if (!form.components) return;

    const currentAttributes = this._schemaAttributes.getValue();
    form.components.forEach(component => {
      const props = component['props'];
      if (props.selectedSchema) {
        if (!currentAttributes.find(attr => attr === props.selectedSchema)) {
          currentAttributes.push(props.selectedSchema);
        }
      }
    });

    this._schemaAttributes.next(currentAttributes);
  }

  /** Transforms the formio form to a schema definition, for saving to the API
   */
  public toSchemaDefinition(form: FormioForm): SchemaDefinitionModel {
    if (!form.components) return new SchemaDefinitionModel();

    const schemaDefinition = new SchemaDefinitionModel();

    form.components.forEach(component => {
      const props = component['props'];

      let processors = [];
      const processorsJSON = JSON.parse(props?.processors || '[]');
      if (props.processors && processorsJSON.length) {
        processors = processorsJSON.map((processor: string) => {
          return {
            processorId: processor,
            type: 'DocumentProcessor',
          };
        });
      }

      const attribute: ISchemaDefinitionAttributes = {
        constraints: [],
        name: props.name,
        type: component.type === 'Schema' ? 'DynamicEntity' : component.type,
        ...(props.selectedSchema && { entitySchema: props.selectedSchema.key }),
        ...(processors.length && { attributeConfigurations: processors }),
        ...(component['contentType'] && { contentType: component['contentType'] }),
        ...(component['concatenatedContentType'] && { concatenatedContentType: component['concatenatedContentType'] }),
        ...(component['entitySchema'] && { entitySchema: component['entitySchema'] }),
      };
      schemaDefinition.attributes.push(attribute);
    });

    return schemaDefinition;
  }

  /** Get the form configuration from the api and map to the formio builder form json
   */
  public getSchemaTreeByKey$(schemaKey: string): Observable<SchemaTreeDefinitionModel> {
    const observable = this._workApiRoutesService.getSchemaTree$(schemaKey);

    return this._processSchemaTreeObservable(observable);
  }

  public updateSchemaDefinition(form: FormioForm, schemaKey: string): Observable<SchemaTreeDefinitionModel> {
    const newSchemaDefinition = this.toSchemaDefinition(form);
    this._schemaWrapper.attributes = newSchemaDefinition.attributes;

    const observable$ = this._workApiRoutesService.updateSchemaDefinition$(schemaKey, this._schemaWrapper).pipe(
      switchMap(updatedSchemaDefinition => {
        // Need to call API again to get the tree, not just a flat schema definition
        const key = updatedSchemaDefinition.key;

        return this._workApiRoutesService.getSchemaTree$(key);
      }),
    );

    return this._processSchemaTreeObservable(observable$);
  }

  private _processSchemaTreeObservable(_observable$: Observable<SchemaTreeDefinitionModel>): Observable<SchemaTreeDefinitionModel> {
    return _observable$.pipe(
      map(schemaTree => {
        this._schemaWrapper = new SchemaDefinitionModel(schemaTree);

        // Update schema trees
        this._initialSchemaTree = new BehaviorSubject<SchemaTreeDefinitionModel>(schemaTree);
        this._updatedSchemaTree.next(schemaTree);

        // Update metadata
        const schemaMetaDataModel = new SchemaMetadataModel(schemaTree);
        this._schemaMetaData.next(schemaMetaDataModel);

        return schemaTree;
      }),
    );
  }

  public discardChanges(): void {
    this._updatedSchemaTree.next(this._initialSchemaTree.value);
  }

  /** Clean up the form json and store the updated form
   */
  public updateFormComponents(formComponents: SchemaDefinitionModel): Observable<SchemaTreeDefinitionModel[]> {
    const schemaDefinitionModel = formComponents;
    const apiCalls: Array<Observable<SchemaTreeDefinitionModel>> = [];

    schemaDefinitionModel.attributes.forEach(attribute => {
      if (attribute.entitySchema && attribute.type !== 'List') {
        attribute.schema = this._schemaAttributes.getValue().find(x => x.key === attribute.entitySchema);

        // if user changes the schema key in the JSON editor, we need to get the schema tree from the API
        if (!attribute.schema) {
          const apiCall = this._workApiRoutesService.getSchemaTree$(attribute.entitySchema).pipe(
            tap(schemaTree => {
              this._schemaAttributes.next([...this._schemaAttributes.getValue(), { ...schemaTree }]);
              attribute.schema = schemaTree;
            }),
            catchError(_ => {
              this._nuverialSnackbarService.notifyApplicationError('Cannot find schema.');

              return EMPTY;
            }),
          );

          apiCalls.push(apiCall);
        }
      }
    });

    const schemaDefinitionTreeModel = new SchemaTreeDefinitionModel(schemaDefinitionModel.toSchema());
    this._updatedSchemaTree.next(schemaDefinitionTreeModel);

    return forkJoin(apiCalls).pipe(
      tap(_ => {
        this._updatedSchemaTree.next(schemaDefinitionTreeModel);
      }),
    );
  }

  public updateMetaData(metaData: ISchemaMetaData): Observable<ISchemaMetaData> {
    this._schemaWrapper.description = metaData.description;
    this._schemaWrapper.name = metaData.name;
    this._schemaWrapper.key = metaData.key;

    const updateSchemaConfiguration$ = this._workApiRoutesService.updateSchemaDefinition$(this._schemaWrapper.key, this._schemaWrapper);

    return updateSchemaConfiguration$.pipe(
      map(schemaConfiguration => {
        const schemaMetaDataModel = new SchemaMetadataModel(schemaConfiguration);

        return schemaMetaDataModel;
      }),
      map(schemaMetaDataModel => structuredClone(schemaMetaDataModel.toSchema())),
    );
  }
}
