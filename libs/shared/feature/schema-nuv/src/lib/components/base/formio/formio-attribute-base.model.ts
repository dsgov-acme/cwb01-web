export interface AttributeBaseProperties {
  name: string;
  key: string;
  type: string;
  icon: string;
}

export enum AttributeTypes {
  STRING = 'String',
  BOOLEAN = 'Boolean',
  LOCALDATE = 'LocalDate',
  LOCALTIME = 'LocalTime',
  DOCUMENT = 'Document',
  LIST = 'List',
  SCHEMA = 'Schema',
  INTEGER = 'Integer',
  BIGDECIMAL = 'BigDecimal',
}

export const typeToIconMap: Map<AttributeTypes, string> = new Map([
  [AttributeTypes.STRING, 'short_text'],
  [AttributeTypes.BOOLEAN, 'radio_button_checked'],
  [AttributeTypes.LOCALDATE, 'calendar_today'],
  [AttributeTypes.LOCALTIME, 'schedule'],
  [AttributeTypes.DOCUMENT, 'description'],
  [AttributeTypes.LIST, 'format_list_bulleted'],
  [AttributeTypes.SCHEMA, 'schema'],
  [AttributeTypes.INTEGER, 'money'],
  [AttributeTypes.BIGDECIMAL, 'east'],
]);
