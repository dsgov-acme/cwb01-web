import { Injectable } from '@angular/core';
import { FormConfigurationModel, IFormConfigurationSchema, SchemaTreeDefinitionModel, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { BehaviorSubject, Observable, distinctUntilChanged, filter, of, switchMap, tap, zip } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchemaTreeService {
  private readonly _schemaTree: BehaviorSubject<SchemaTreeDefinitionModel> = new BehaviorSubject<SchemaTreeDefinitionModel>(new SchemaTreeDefinitionModel());
  public schemaTree$: Observable<SchemaTreeDefinitionModel> = this._schemaTree.asObservable();

  private readonly _formSchemaTree: BehaviorSubject<SchemaTreeDefinitionModel> = new BehaviorSubject<SchemaTreeDefinitionModel>(
    new SchemaTreeDefinitionModel(),
  );

  private readonly _componentKey: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _componentUpdateFormConfigSchema: BehaviorSubject<IFormConfigurationSchema[]> = new BehaviorSubject<IFormConfigurationSchema[]>([]);

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService) {}

  public getSchemaKeySelectorSchemaTree$(): Observable<SchemaTreeDefinitionModel | undefined> {
    return zip([this._componentKey, this._componentUpdateFormConfigSchema]).pipe(
      filter(([componentKey, formConfigSchema]) => !!formConfigSchema.length && !!componentKey),
      distinctUntilChanged((prev, curr) => prev[0] === curr[0]),
      switchMap(([componentKey, formConfigSchema]) => {
        const formConfig = new FormConfigurationModel(formConfigSchema);
        const { parent } = formConfig.getComponentDataByKey(componentKey);
        if (parent && parent['keyContextProvider'] && parent.key) {
          const schemaAttribue = this._formSchemaTree.getValue().getAttributeByName(parent.key);
          if (schemaAttribue && schemaAttribue.schema) {
            const schemaTreeModel = new SchemaTreeDefinitionModel(schemaAttribue.schema);
            this._schemaTree.next(schemaTreeModel);

            return of(schemaTreeModel);
          }
        }

        return this._formSchemaTree.asObservable();
      }),
    );
  }

  public getFormSchemaTree$(schemaKey: string): Observable<SchemaTreeDefinitionModel> {
    return this._workApiRoutesService.getSchemaTree$(schemaKey).pipe(
      tap(schemaTree => {
        this._schemaTree.next(schemaTree);
        this._formSchemaTree.next(schemaTree);
      }),
    );
  }

  public setComponentKey(key: string) {
    this._componentKey.next(key);
  }

  public setComponentUpdateFormConfig(formConfigSchema: IFormConfigurationSchema[]) {
    this._componentUpdateFormConfigSchema.next(formConfigSchema);
  }

  public cleanUp() {
    this._schemaTree.next(this._formSchemaTree.value);
    this._componentKey.next('');
    this._componentUpdateFormConfigSchema.next([]);
  }
}
