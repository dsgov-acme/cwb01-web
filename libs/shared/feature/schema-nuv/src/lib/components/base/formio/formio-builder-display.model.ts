export const defaultPropertyNameConfiguration = {
  input: true,
  inputType: 'text',
  key: 'props.name',
  label: 'Name',
  placeholder: 'Name',
  tooltip: `Enter text in camel case format. For example: 'camelCaseText'`,
  type: 'textfield',
  validate: {
    custom: 'valid = /^[a-z]+[A-Z0-9a-z]*$/.test(input);',
    customMessage: 'Please enter a name in camel case format.',
    required: true,
  },
};

export const defaultProcessorsConfiguration = {
  input: true,
  key: 'props.processors',
  label: 'Document Processors',
  type: 'nuverialProcessorCheckboxCards',
  weight: 0,
};

export const defaultAntivirusMessage = {
  html: `<br><span>The documents will be analyzed by an antivirus.</span><br>`,
  input: false,
  key: 'content',
  label: 'Content',
  refreshOnChange: false,
  tableView: false,
  type: 'content',
};
