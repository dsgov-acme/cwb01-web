import { SchemaModel } from '@dsg/shared/utils/http';
import { ISchemaAttributeConfigurations, ISchemaComputedAttributes } from '../schema-definition/schema-definition.model';

export interface TreeNode {
  [key: string]: unknown;
  children: TreeNode[];
  disabled: boolean;
  icon?: string;
  key: string;
  label: string;
  selected?: boolean;
}

export interface ISchemaTreeDefinition {
  attributes: ISchemaTreeDefinitionAttributes[];
  computedAttributes?: ISchemaComputedAttributes[];
  createdBy: string;
  createdTimestamp: string;
  description: string;
  key: string;
  lastUpdatedTimestamp: string;
  name: string;
  id: string;
  lastUpdatedBy: string;
}

export interface ISchemaTreeDefinitionAttributes {
  constraints: unknown[];
  name: string;
  type: string;
  entitySchema?: string;
  schema?: ISchemaTreeDefinition;
  attributeConfigurations?: ISchemaAttributeConfigurations[];
  contentType?: string;
  concatenatedContentType?: string;
}

export class SchemaTreeDefinitionModel implements SchemaModel<ISchemaTreeDefinition> {
  public attributes: ISchemaTreeDefinitionAttributes[] = [];
  public computedAttributes?: ISchemaComputedAttributes[];
  public createdBy = '';
  public createdTimestamp = '';
  public description = '';
  public id = '';
  public key = '';
  public lastUpdatedTimestamp = '';
  public name = '';
  public lastUpdatedBy = '';

  constructor(schemaDefinition?: ISchemaTreeDefinition) {
    if (schemaDefinition) {
      this.fromSchema(schemaDefinition);
    }
  }

  public static assignIcon(type: string): string {
    switch (type) {
      case 'String':
        return 'short_text';
      case 'List':
        return 'format_list_bulleted';
      case 'Boolean':
        return 'radio_button_checked';
      case 'DynamicEntity':
        return 'schema';
      case 'Integer':
        return 'money';
      case 'Number':
        return 'money';
      case 'BigDecimal':
        return 'decimal_increase';
      case 'LocalDate':
        return 'calendar_today';
      case 'LocalTime':
        return 'schedule';
      case 'Document':
        return 'description';
      default:
        return 'short_text';
    }
  }

  // Returns the basic type (String, Boolean, etc.) with the content type if it's a List (List[Document], List[string], etc).
  public static getTypeString(type: string, contentType?: string) {
    let typeString = type || '';
    if (contentType) {
      typeString += `<${contentType}>`;
    }

    return typeString;
  }

  public static toTree(schema: ISchemaTreeDefinition): TreeNode {
    const toTreeRecursive = (current: ISchemaTreeDefinition | ISchemaTreeDefinitionAttributes): TreeNode => {
      const root: TreeNode = {
        children: [],
        disabled: false,
        icon: '',
        key: '',
        label: '',
      };

      if (SchemaTreeDefinitionModel.isAttribute(current)) {
        root.icon = SchemaTreeDefinitionModel.assignIcon(current.type);
        root.key = current.name;
        root.label = current.name;

        // Assign type for filtering schema keys by type
        root['type'] = current.type;
        if (current.contentType) {
          root['contentType'] = current.contentType;
          if (current.contentType === 'DynamicEntity') {
            root['entitySchema'] = current.entitySchema;
          }
        }

        if (current?.schema && current.type !== 'List') {
          // Exclude List types as they contain the schema attribute but are not a node. They are a selectable key.
          // Only include intermediate attribute node
          // Skip next schema node (current (attribute) -> skip single child (schema) -> many schema children (attributes))
          current.schema.attributes.forEach(attribute => {
            root.children.push(toTreeRecursive(attribute));
          });
        }
      } else {
        // Intermediate schema node
        root.icon = 'schema';
        root.key = current.key;
        root.label = current.key;

        root['type'] = 'DynamicEntity';

        current.attributes.forEach(attribute => {
          root.children.push(toTreeRecursive(attribute));
        });
      }

      return root;
    };

    return toTreeRecursive(schema);
  }

  public static isAttribute(schema: ISchemaTreeDefinition | ISchemaTreeDefinitionAttributes): schema is ISchemaTreeDefinitionAttributes {
    return (schema as ISchemaTreeDefinitionAttributes).type !== undefined;
  }

  public getAttributeByName(name: string): ISchemaTreeDefinitionAttributes | undefined {
    let resultAttribute: ISchemaTreeDefinitionAttributes | undefined;

    const searchNested = (attributes: ISchemaTreeDefinitionAttributes[]) => {
      for (const attribute of attributes) {
        if (attribute.name === name) {
          resultAttribute = attribute;

          return;
        }

        if (attribute.schema && Object.keys(attribute.schema)) {
          searchNested(attribute.schema.attributes);
        }
      }
    };

    searchNested(this.attributes);

    return resultAttribute;
  }

  public fromSchema(schemaDefinition: ISchemaTreeDefinition) {
    this.attributes = schemaDefinition.attributes;
    this.createdBy = schemaDefinition.createdBy;
    this.createdTimestamp = schemaDefinition.createdTimestamp;
    this.description = schemaDefinition.description;
    this.id = schemaDefinition.id;
    this.key = schemaDefinition.key;
    this.lastUpdatedBy = schemaDefinition.lastUpdatedBy;
    this.lastUpdatedTimestamp = schemaDefinition.lastUpdatedTimestamp;
    this.name = schemaDefinition.name;
    if (schemaDefinition.computedAttributes) this.computedAttributes = schemaDefinition.computedAttributes;
  }

  public toSchema(): ISchemaTreeDefinition {
    return {
      attributes: this.attributes,
      ...(this.computedAttributes && { computedAttributes: this.computedAttributes }),
      createdBy: this.createdBy,
      createdTimestamp: this.createdTimestamp,
      description: this.description,
      id: this.id,
      key: this.key,
      lastUpdatedBy: this.lastUpdatedBy,
      lastUpdatedTimestamp: this.lastUpdatedTimestamp,
      name: this.name,
    };
  }
}
