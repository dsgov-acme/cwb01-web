import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IParentSchemas, ISchemaDefinition, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { INuverialSelectOption, NuverialSelectComponent } from '@dsg/shared/ui/nuverial';
import { Filter } from '@dsg/shared/utils/http';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, map, switchMap, take, tap } from 'rxjs';
import { FormioBaseCustomComponent } from '../../base';
import { AttributeBaseProperties } from '../../base/formio/formio-attribute-base.model';
import { SchemaBuilderService } from '../../forms/builder/schema-builder.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSelectComponent],
  selector: 'dsg-formio-schema-select',
  standalone: true,
  styleUrls: ['./formio-schema-select.component.scss'],
  templateUrl: './formio-schema-select.component.html',
})
export class FormioSchemaSelectComponent extends FormioBaseCustomComponent<ISchemaDefinition, AttributeBaseProperties> implements OnInit {
  public schemas: Map<string, ISchemaDefinition> = new Map<string, ISchemaDefinition>();
  public schemasOptions: INuverialSelectOption[] = [];
  public gotChildrenMap: Map<string, boolean> = new Map<string, boolean>();

  public formControl = new FormControl();
  public gotSchemas = false;

  private _schemaKey = '';
  private readonly _getSchemaKey$ = this._schemaBuilderService.metaDataFields$.pipe(tap(data => (this._schemaKey = data.key)));
  private _parentSchemas: string[] = [];
  public loadingSearchSchema = false;

  constructor(
    private readonly _workApiRoutesService: WorkApiRoutesService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _schemaBuilderService: SchemaBuilderService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this._getSchemaKey$.pipe(take(1)).subscribe();

    this._workApiRoutesService
      .getSchemaParents$(this._schemaKey)
      .pipe(
        take(1),
        switchMap((parentSchemasResponse: IParentSchemas) => {
          this._parentSchemas = parentSchemasResponse.parentSchemas;

          return this._getSchemas$().pipe(take(1));
        }),
        tap(() => {
          this.gotSchemas = true;
          this.formControl.setValue(this.value?.key);
          this._changeDetectorRef.markForCheck();
        }),
        switchMap(() => {
          if (this.value?.key && this.schemasOptions.findIndex(schema => this.value.key === schema.key) === -1) {
            const filters = [
              { field: 'key', value: this.value.key.replace(/\s/g, '') },
              { field: 'name', value: this.value.key },
            ];

            return this._getSchemas$(filters).pipe(
              take(1),
              tap(() => {
                this.formControl.setValue(this.value.key);
                this._changeDetectorRef.detectChanges();
              }),
            );
          }

          return EMPTY;
        }),
      )
      .subscribe();

    this.formControl.valueChanges
      .pipe(
        tap(value => {
          this._selectSchema(value);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }
  private _selectSchema(value: string) {
    if (this.gotChildrenMap.get(value)) {
      const selectedSchema = this.schemas.get(value);
      if (selectedSchema) {
        this._triggerUpdateValue(selectedSchema);
      }
    }
  }

  private _getSchemas$(filter?: Filter[]) {
    return this._workApiRoutesService.getSchemaDefinitionsList$(filter).pipe(
      take(1),
      map(response => response.items),
      map(schemaDefinitions => {
        schemaDefinitions.forEach(schema => {
          this.schemas.set(schema.key, schema);
        });

        return schemaDefinitions
          .filter(schema => {
            const isCurrentSchema = schema.key === this._schemaKey;
            const parentSchemasForSchema = this._parentSchemas.find(parentSchema => parentSchema === schema.key);
            if (isCurrentSchema || parentSchemasForSchema) {
              return false;
            }

            return true;
          })
          .map(schema => {
            const hasSubSchemas = schema.attributes.some(attribute => attribute.type === 'DynamicEntity');
            this.gotChildrenMap.set(schema.key, !hasSubSchemas);

            return {
              disabled: false,
              displayTextValue: `${schema.name} - ${schema.key}`,
              key: schema.key,
              selected: false,
            };
          });
      }),
      tap(schemas => {
        const newSchemas = schemas.filter(schema => {
          return !this.schemasOptions.some(existingSchema => existingSchema.key === schema.key);
        });

        this.schemasOptions = [...this.schemasOptions, ...newSchemas].sort((a, b) => a.key.localeCompare(b.key));
        this._changeDetectorRef.markForCheck();
      }),
    );
  }

  public handleSearchSchema(search: string) {
    if (search) {
      this.loadingSearchSchema = true;
      const filters = [
        { field: 'key', value: search.replace(/\s/g, '') },
        { field: 'name', value: search },
      ];

      this._getSchemas$(filters)
        .pipe(
          take(1),
          tap(() => {
            this.loadingSearchSchema = false;
          }),
        )
        .subscribe();
    }
  }

  public loadSchemaWithChildren(selectedOption: INuverialSelectOption): void {
    if (!this.gotChildrenMap.get(selectedOption.key)) {
      this._workApiRoutesService
        .getSchemaTree$(selectedOption.key)
        .pipe(
          tap((schema: ISchemaDefinition) => {
            this.gotChildrenMap.set(schema.key, true);
            if (!this.schemas.get(schema.key)) {
              this.schemas.set(schema.key, schema);
            }
            this._triggerUpdateValue(schema);
          }),
          take(1),
        )
        .subscribe();
    }
  }

  private _triggerUpdateValue(schema: ISchemaDefinition) {
    this.updateValue(schema);
    this._changeDetectorRef.markForCheck();
  }
}
