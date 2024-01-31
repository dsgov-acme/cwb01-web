export interface Step {
  label: string;
  type: 'intake' | 'review' | 'formio-json' | 'formly-json' | 'form-data';
}

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

const preDefinedComponents = {
  email: {
    icon: 'terminal',
    schema: {
      key: 'email',
      props: {
        label: 'Email',
        required: true,
        type: 'email',
      },
      type: 'nuverialTextInput',
      validators: {
        validation: ['email'],
      },
    },
    title: 'Email',
    weight: 0,
  },
};

export const FORM_BUILDER_OPTIONS = {
  builder: {
    advanced: false,
    basic: false,
    data: false,
    hidden: false,
    layout: false,
    nuverial: {
      default: true,
      title: 'Nuverial',
      weight: 0,
    },
    nuverialAdvanced: {
      default: true,
      title: 'Nuverial Advanced',
      weight: 0,
    },
    preDefined: {
      components: preDefinedComponents,
      default: false,
      title: 'Pre defined',
      weight: 1,
    },
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
