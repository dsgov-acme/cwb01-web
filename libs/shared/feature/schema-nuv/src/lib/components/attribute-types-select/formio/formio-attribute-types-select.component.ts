import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IParentSchemas, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { INuverialSelectOption, NuverialSelectComponent } from '@dsg/shared/ui/nuverial';
import { Filter } from '@dsg/shared/utils/http';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, map, switchMap, take, tap } from 'rxjs';
import { FormioBaseCustomComponent } from '../../base';
import { AttributeBaseProperties, AttributeTypes } from '../../base/formio/formio-attribute-base.model';
import { SchemaBuilderService } from '../../forms/builder/schema-builder.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSelectComponent],
  selector: 'dsg-formio-attribute-types-select',
  standalone: true,
  styleUrls: ['./formio-attribute-types-select.component.scss'],
  templateUrl: './formio-attribute-types-select.component.html',
})
export class FormioAttributeTypesSelectComponent extends FormioBaseCustomComponent<string, AttributeBaseProperties> implements OnInit {
  public attributeTypes: INuverialSelectOption[] = Object.values(AttributeTypes)
    .map(value => ({
      disabled: false,
      displayTextValue: value,
      key: value,
      selected: false,
    }))
    .filter(option => option.displayTextValue !== AttributeTypes.SCHEMA && option.displayTextValue !== AttributeTypes.LIST)
    .sort((a, b) => a.displayTextValue.localeCompare(b.displayTextValue)) as INuverialSelectOption[];

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
          this.formControl.setValue(this.value);
          this._changeDetectorRef.markForCheck();
        }),
        switchMap(() => {
          if (this.value && this.value.match(/DynamicEntity/g) && this.attributeTypes.findIndex(schema => this.value === schema.key) === -1) {
            const filters = [
              { field: 'key', value: this.value.split('-')[1].replace(/\s/g, '') },
              { field: 'name', value: this.value.split('-')[1] },
            ];

            return this._getSchemas$(filters).pipe(
              take(1),
              tap(() => {
                this.formControl.setValue(this.value);
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
          this.updateValue(value);
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private _getSchemas$(filter?: Filter[]) {
    return this._workApiRoutesService.getSchemaDefinitionsList$(filter).pipe(
      take(1),
      map(response => response.items),
      map(schemaDefinitions => {
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
            return {
              disabled: false,
              displayTextValue: `${schema.name} - ${schema.key}`,
              key: `DynamicEntity-${schema.key}`,
              selected: false,
            };
          });
      }),
      tap(schemas => {
        const newSchemas = schemas.filter(schema => {
          return !this.attributeTypes.some(existingSchema => existingSchema.key === schema.key);
        });
        this.attributeTypes = [...this.attributeTypes, ...newSchemas];
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
}
