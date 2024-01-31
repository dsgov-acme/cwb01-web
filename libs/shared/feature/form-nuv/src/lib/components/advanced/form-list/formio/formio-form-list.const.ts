import {
  defaultConditionalPanelConfiguration,
  defaultConditionalPanelDocumentationLink,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultFieldLabelConfiguration,
  defaultFieldWidthConfiguration,
  defaultHideConditionalConfiguration,
  defaultPanelTabsConfiguration,
  defaultPropertyKeyConfiguration,
} from '../../../base';

export const selector = 'nuverialFormList';

export function EditForm() {
  return {
    components: [
      {
        // Tabs
        ...defaultPanelTabsConfiguration,
        components: [
          {
            // Display Panel
            ...defaultDisplayPanelConfiguration,
            components: [
              {
                ...defaultDisplayBasicConfiguration,
                components: [
                  { ...defaultFieldLabelConfiguration, defaultValue: 'Form list' },
                  { ...formioLabelConfiguration },
                  { ...includeLabel },
                  { ...includeIndex },
                  { ...propertyKeyConfiguration },
                  { ...defaultFieldWidthConfiguration, defaultValue: 'flex-full' },
                ],
              },
            ],
          },
          {
            // List Actions Panel
            ...listActionsConfiguration,
            components: [{ ...addItemLabel }, { ...removeItemLabel }, { ...includeRemoveItemAction }],
          },
          {
            // Conditional Panel
            ...defaultConditionalPanelConfiguration,
            components: [
              {
                ...defaultConditionalPanelDocumentationLink,
              },
              {
                ...defaultHideConditionalConfiguration,
              },
            ],
          },
        ],
      },
    ],
  };
}

const propertyKeyConfiguration = {
  ...defaultPropertyKeyConfiguration,
  props: {
    allowedSchemaTypes: ['List'],
  },
};

/** This label is used by the formio builder */
const formioLabelConfiguration = {
  calculateValue: {
    '*': [{ var: 'data.props.label' }],
  },
  key: 'label',
  type: 'hidden',
  weight: 0,
};

const includeLabel = {
  key: 'props.includeLabel',
  label: 'Include label',
  tooltip: 'Controls whether to show the list label on the form',
  type: 'checkbox',
  weight: 0,
};

const includeIndex = {
  key: 'props.includeIndex',
  label: 'Include index',
  tooltip: 'Controls whether to show the index number next to the label',
  type: 'checkbox',
  weight: 0,
};

export const listActionsConfiguration = {
  key: 'listActions',
  label: 'List Item Actions',
  weight: 0,
};

const addItemLabel = {
  defaultValue: 'Add another',
  key: 'props.addItemLabel',
  label: 'Add item label',
  type: 'textfield',
  validate: {
    required: true,
  },
  weight: 0,
};

const removeItemLabel = {
  defaultValue: 'Remove',
  key: 'props.removeItemLabel',
  label: 'Remove item label',
  type: 'textfield',
  validate: {
    required: true,
  },
  weight: 0,
};

const includeRemoveItemAction = {
  key: 'props.includeRemoveItemAction',
  label: 'Include remove item action',
  tooltip: 'Controls whether to show the remove item action on each list item',
  type: 'checkbox',
  weight: 0,
};
