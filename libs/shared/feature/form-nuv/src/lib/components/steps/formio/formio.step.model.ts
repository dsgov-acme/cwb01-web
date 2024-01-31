import { Components } from '@formio/angular';
import {
  defaultConditionalPanelConfiguration,
  defaultConditionalPanelDocumentationLink,
  defaultDisplayBasicConfiguration,
  defaultDisplayPanelConfiguration,
  defaultFieldLabelConfiguration,
  defaultHideConditionalConfiguration,
  defaultPanelTabsConfiguration,
} from '../../base';

export function overrideWizardPanel() {
  const wizardPanel = Components.components.panel;
  wizardPanel.schema = function () {
    return { input: true };
  };
  wizardPanel.editForm = editForm;
}

function editForm() {
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
                  {
                    ...defaultFieldLabelConfiguration,
                    key: 'title',
                  },
                  { ...stepFormioLabelConfiguration },
                  { ...stepLabelConfiguration },
                ],
              },
            ],
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

/** This title is used by the formio wizard pages tabs */
const stepFormioLabelConfiguration = {
  calculateValue: {
    '*': [{ var: 'undefined' }],
  },
  key: 'label',
  type: 'hidden',
  weight: 0,
};

const stepLabelConfiguration = {
  calculateValue: {
    '*': [{ var: 'data.title' }],
  },
  key: 'props.label',
  type: 'hidden',
  weight: 0,
};
