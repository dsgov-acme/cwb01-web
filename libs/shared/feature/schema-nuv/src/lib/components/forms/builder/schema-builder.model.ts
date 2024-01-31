const defaultPanelConfiguration = [
  {
    ignore: true,
    key: 'api',
  },
  {
    ignore: true,
    key: 'data',
  },
  {
    ignore: false,
    key: 'conditional',
  },
  {
    ignore: true,
    key: 'logic',
  },
  {
    ignore: true,
    key: 'layout',
  },
];

export const FORM_BUILDER_OPTIONS = {
  builder: {
    advanced: false,
    attributes: {
      default: true,
      title: 'Attributes',
      weight: 0,
    },
    basic: false,
    data: false,
    hidden: false,
    layout: false,

    premium: false,
    resource: false,
  },
  editForm: {
    button: [...defaultPanelConfiguration],
    panel: [
      {
        ignore: false,
        key: 'data',
      },
      {
        ignore: true,
        key: 'conditional',
      },
      {
        ignore: true,
        key: 'logic',
      },
      {
        key: 'display',
      },
    ],
    tabs: [...defaultPanelConfiguration],
    textfield: [...defaultPanelConfiguration],
  },
  formConfig: {
    schema: 'formio',
  },
  noDefaultSubmitButton: true,
};
