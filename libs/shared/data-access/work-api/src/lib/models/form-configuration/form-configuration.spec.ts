import {
  FormioConfigurationMockDocuments,
  FormioConfigurationTestMock,
  FormlyConfigurationTestMock,
  UglyFormioConfigurationTestMock,
} from './form-configuration.mock';
import { CONFIRMATION_STEP_KEY, FormConfigurationModel, IFormConfigurationSchema } from './form-configuration.model';

global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

describe('FormConfigurationModel', () => {
  let formConfigurationModel: FormConfigurationModel;

  beforeEach(() => {
    formConfigurationModel = new FormConfigurationModel(FormioConfigurationTestMock);
  });

  describe('fromSchema', () => {
    test('should not remove empty properties', () => {
      expect(formConfigurationModel.components).toEqual(FormioConfigurationTestMock);
    });

    test('should remove empty properties', () => {
      formConfigurationModel = new FormConfigurationModel(UglyFormioConfigurationTestMock, true);

      expect(formConfigurationModel.components).toEqual(FormioConfigurationTestMock);
    });
  });

  test('toFormioJson', () => {
    expect(formConfigurationModel.toFormioJson()).toEqual(FormioConfigurationTestMock);
  });

  test('toFormlyJson', () => {
    expect(formConfigurationModel.toFormlyJson()).toEqual(FormlyConfigurationTestMock);
  });

  test('toFormioBuilderForm', () => {
    expect(formConfigurationModel.toFormioBuilderForm()).toEqual({
      components: FormioConfigurationTestMock,
      display: 'wizard',
    });
  });

  test('_toFormlyForm', () => {
    expect(formConfigurationModel['_toFormlyForm']()).toEqual([
      {
        className: 'flex-full',
        fieldGroup: FormlyConfigurationTestMock,
        type: 'nuverialSteps',
      },
    ]);
  });

  test('toReviewForm', () => {
    expect(formConfigurationModel.toReviewForm()).toEqual([
      {
        className: 'flex-full',
        fieldGroup: FormlyConfigurationTestMock,
        type: 'nuverialSteps',
      },
    ]);
  });

  test('toIntakeForm', () => {
    const confirmationStep = formConfigurationModel.toIntakeForm()[0]?.fieldGroup?.[2];

    expect(confirmationStep?.props?.['stepKey']).toEqual(CONFIRMATION_STEP_KEY);
  });

  test('should keep the input property', () => {
    const _formConfigurationModel = new FormConfigurationModel(
      [
        {
          components: [
            {
              addons: [],
              allowCalculateOverride: false,
              allowMultipleMasks: false,
              attributes: {},
              autofocus: false,
              calculateServer: false,
              calculateValue: '',
              className: 'flex-full',
              clearOnHide: true,
              conditional: {
                eq: '',
                show: false,
                when: undefined,
              },
              customClass: '',
              customDefaultValue: '',
              dataGridLabel: false,
              dbIndex: false,
              defaultValue: null,
              description: '',
              disabled: false,
              encrypted: false,
              errorLabel: '',
              hidden: false,
              hideLabel: false,
              id: 'em5s58r',
              input: false,
              key: 'nuverialSectionHeader',
              label: '',
              labelPosition: 'top',
              modalEdit: false,
              multiple: false,
              overlay: {
                height: '',
                left: '',
                style: '',
                top: '',
                width: '',
              },
              persistent: true,
              placeholder: '',
              prefix: '',
              properties: {},
              props: {
                label: 'Current Address',
              },
              protected: false,
              redrawOn: '',
              refreshOn: '',
              showCharCount: false,
              showWordCount: false,
              suffix: '',
              tabindex: '',
              tableView: false,
              tooltip: '',
              type: 'nuverialSectionHeader',
              unique: false,
              validate: {
                custom: '',
                customPrivate: false,
                multiple: false,
                required: false,
                strictDateValidation: false,
                unique: false,
              },
              validateOn: 'change',
              widget: {
                type: 'input',
              },
            },
          ],
          input: true,
          key: 'personalInformation',
          label: 'Page 1',
          props: {
            label: 'Personal Information',
          },
          title: 'Personal Information',
          type: 'panel',
        },
      ] as unknown as IFormConfigurationSchema[],
      true,
    );

    expect(_formConfigurationModel.toSchema()).toEqual([
      {
        components: [
          {
            className: 'flex-full',
            input: false,
            key: 'nuverialSectionHeader',
            props: {
              label: 'Current Address',
            },
            type: 'nuverialSectionHeader',
          },
        ],
        input: true,
        key: 'personalInformation',
        label: 'Page 1',
        props: { label: 'Personal Information' },
        title: 'Personal Information',
        type: 'panel',
      },
    ]);
  });

  test('should keep empty components property', () => {
    const _formConfigurationModel = new FormConfigurationModel(
      [
        {
          components: [
            {
              addons: [],
              allowCalculateOverride: false,
              allowMultipleMasks: false,
              attributes: {},
              autofocus: false,
              calculateServer: false,
              calculateValue: '',
              className: 'flex-full',
              clearOnHide: true,
              components: [],
              conditional: {
                eq: '',
                show: false,
                when: undefined,
              },
              customClass: '',
              customDefaultValue: '',
              dataGridLabel: false,
              dbIndex: false,
              defaultValue: null,
              description: '',
              disabled: false,
              encrypted: false,
              errorLabel: '',
              hidden: false,
              hideLabel: false,
              id: 'em5s58r',
              input: false,
              key: 'nuverialSectionHeader',
              label: '',
              labelPosition: 'top',
              modalEdit: false,
              multiple: false,
              overlay: {
                height: '',
                left: '',
                style: '',
                top: '',
                width: '',
              },
              persistent: true,
              placeholder: '',
              prefix: '',
              properties: {},
              props: {
                label: 'Current Address',
              },
              protected: false,
              redrawOn: '',
              refreshOn: '',
              showCharCount: false,
              showWordCount: false,
              suffix: '',
              tabindex: '',
              tableView: false,
              tooltip: '',
              type: 'nuverialSectionHeader',
              unique: false,
              validate: {
                custom: '',
                customPrivate: false,
                multiple: false,
                required: false,
                strictDateValidation: false,
                unique: false,
              },
              validateOn: 'change',
              widget: {
                type: 'input',
              },
            },
          ],
          input: true,
          key: 'personalInformation',
          label: 'Page 1',
          props: {
            label: 'Personal Information',
          },
          title: 'Personal Information',
          type: 'panel',
        },
        {
          components: [],
          input: true,
          key: 'page2',
          label: 'Page 2',
          props: {
            label: 'Page 2',
          },
          title: 'Page 2',
          type: 'panel',
        },
      ] as unknown as IFormConfigurationSchema[],
      true,
    );

    expect(_formConfigurationModel.toSchema()).toEqual([
      {
        components: [
          {
            className: 'flex-full',
            components: [],
            input: false,
            key: 'nuverialSectionHeader',
            props: {
              label: 'Current Address',
            },
            type: 'nuverialSectionHeader',
          },
        ],
        input: true,
        key: 'personalInformation',
        label: 'Page 1',
        props: { label: 'Personal Information' },
        title: 'Personal Information',
        type: 'panel',
      },
      {
        components: [],
        input: true,
        key: 'page2',
        label: 'Page 2',
        props: { label: 'Page 2' },
        title: 'Page 2',
        type: 'panel',
      },
    ]);
  });

  describe('getComponentByKey', () => {
    it('should return the component when it exists at the top level', () => {
      const componentsArr = [
        { key: 'firstName', props: { label: 'First Name' } },
        { key: 'lastName', props: { label: 'Last Name' } },
      ];

      const result = formConfigurationModel.getComponentByKey('firstName', componentsArr);
      expect(result).toEqual({ key: 'firstName', props: { label: 'First Name' } });
    });

    it('should return the component when it exists at a nested level', () => {
      const componentsArr = [
        {
          components: [
            { key: 'firstName', props: { label: 'First Name' } },
            { key: 'lastName', props: { label: 'Last Name' } },
          ],
          key: 'personalInformation',
          props: { label: 'Personal Information' },
        },
      ];

      const result = formConfigurationModel.getComponentByKey('lastName', componentsArr);
      expect(result).toEqual({ key: 'lastName', props: { label: 'Last Name' } });
    });

    it('should return undefined when the component does not exist', () => {
      const componentsArr = [
        {
          components: [
            { key: 'firstName', props: { label: 'First Name' } },
            { key: 'lastName', props: { label: 'Last Name' } },
          ],
          key: 'personalInformation',
          props: { label: 'Personal Information' },
        },
      ];

      const result = formConfigurationModel.getComponentByKey('email', componentsArr);
      expect(result).toBeUndefined();
    });

    it('should return the component label when the component exists and the label exists', () => {
      const result = formConfigurationModel.getComponentLabelByKey('personalInformation.firstName');

      expect(result).toBe('First Name');
    });

    it('should return the key when the component exist and the label does not exist', () => {
      const result = formConfigurationModel.getComponentLabelByKey('personalInformation.middleName');

      expect(result).toBe('personalInformation.middleName');
    });

    it('should return the document label with the sub label when the component exists and the label exists', () => {
      const result = new FormConfigurationModel(FormioConfigurationMockDocuments).getComponentLabelByKey('documents.idFront');

      expect(result).toBe('Photo ID - Front of ID');
    });

    it('should return the document label without the sub label when the component exists and the label exists', () => {
      const result = new FormConfigurationModel(FormioConfigurationMockDocuments).getComponentLabelByKey('documents.proofOfResidency');

      expect(result).toBe('Proof of Residency');
    });

    it('should return the document key when the component does not exists and the label does not exists', () => {
      const result = new FormConfigurationModel(FormioConfigurationMockDocuments).getComponentLabelByKey('documents.doesNotExist');

      expect(result).toBe('documents.doesNotExist');
    });

    it('should return the address field label when the component exists and the label exists', () => {
      const result = formConfigurationModel.getComponentLabelByKey('personalInformation.currentAddress.addressLine1');

      expect(result).toBe('Current Address - Address Line 1');
    });

    it('should return the component when it exists at the root', () => {
      const result = formConfigurationModel.getComponentDataByKey('personalInformation.firstName');
      expect(result).toBeTruthy();
      expect(result.label).toBeTruthy();
      expect(result.component).toBeTruthy();
      expect(result.parent).toBeTruthy();
      expect(result.label).toEqual('First Name');
      expect(result.component?.key).toEqual('personalInformation.firstName');
      expect(result.parent?.key).toEqual('personalInformation');
    });

    it('should return undefined component when not exist', () => {
      const result = formConfigurationModel.getComponentDataByKey('firstName');
      expect(result).toBeTruthy();
      expect(result.label).toBeTruthy();
      expect(result.label).toEqual('firstName');
      expect(result.component).toBeUndefined();
      expect(result.parent).toBeUndefined();
    });

    it('should sort documents as they are in the form configuration', () => {
      const result = formConfigurationModel.findComponentsKeyInOrder(['documents.idBack', 'documents.proofOfIncome', 'documents.idFront']);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('documents.idFront');
      expect(result[1]).toEqual('documents.idBack');
      expect(result[2]).toEqual('documents.proofOfIncome');
    });
  });
});
