import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { ISchemaDefinition, SchemaTreeDefinitionModel, TreeNode } from '@dsg/shared/data-access/work-api';
import { NuverialTreeComponent } from '@dsg/shared/ui/nuverial';
import { FormioBaseCustomComponent } from '../../base';
import { AttributeBaseProperties } from '../../base/formio/formio-attribute-base.model';

export interface SchemaAttributeProps extends AttributeBaseProperties {
  selectedSchema: ISchemaDefinition;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTreeComponent],
  selector: 'dsg-formio-schema',
  standalone: true,
  styleUrls: ['./formio-schema.component.scss'],
  templateUrl: './formio-schema.component.html',
})
export class FormioSchemaComponent extends FormioBaseCustomComponent<string, SchemaAttributeProps> implements OnChanges {
  public schemaTree!: TreeNode;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['props']) {
      const props = changes['props'].currentValue;
      if (props && props.selectedSchema) {
        this.schemaTree = SchemaTreeDefinitionModel.toTree(props.selectedSchema);
      }
    }
  }
}
