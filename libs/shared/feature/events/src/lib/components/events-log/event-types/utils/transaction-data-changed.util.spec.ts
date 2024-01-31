import { AuditEventFormioConfigurationNuverialMultipleFileUploadMock } from '@dsg/shared/data-access/audit-api';
import { FormConfigurationModel } from '@dsg/shared/data-access/work-api';
import { componentIsListType, displayValueOrBlank, getComponentLabelValidity, splitIndicesFromKey } from './transaction-data-changed.util';

describe('transaction-data-changed utils', () => {
  describe('splitIndicesFromKey', () => {
    it('should split indices from key', () => {
      const key = 'documents[0].pages[2].text';
      const expected = {
        componentKey: 'documents.pages.text',
        indices: ['[0]', '[2]'],
        splitKey: ['documents', '[0]', '.pages', '[2]', '.text'],
      };

      const result = splitIndicesFromKey(key);

      expect(result).toEqual(expected);
    });

    it('should handle key without indices', () => {
      const key = 'documents.pages.text';
      const expected = {
        componentKey: 'documents.pages.text',
        indices: [],
        splitKey: ['documents.pages.text'],
      };

      const result = splitIndicesFromKey(key);

      expect(result).toEqual(expected);
    });
  });

  describe('getComponentLabelValidity', () => {
    it('should return valid component label', () => {
      const key = 'documents.proofOfIncome';
      const formConfiguration = new FormConfigurationModel(AuditEventFormioConfigurationNuverialMultipleFileUploadMock);
      const spy = jest.spyOn(formConfiguration, 'getComponentDataByKey');

      const expected = {
        component: {
          className: 'flex-full',
          components: [
            {
              input: true,
              key: 'documents.proofOfIncome',
            },
          ],
          key: 'documents',
          props: {
            label: 'Proof of Income/Tax',
          },
          type: 'nuverialMultipleFileUpload',
        },
        label: 'Proof of Income/Tax',
        valid: true,
      };

      const result = getComponentLabelValidity(key, formConfiguration);

      expect(result).toEqual(expected);
      expect(spy).toHaveBeenCalledWith(key);
    });

    it('should return empty label and invalid flag if form element is not found', () => {
      const key = 'documents.proofOfIncome';
      const formConfiguration = new FormConfigurationModel(AuditEventFormioConfigurationNuverialMultipleFileUploadMock);
      const spy = jest.spyOn(formConfiguration, 'getComponentDataByKey').mockReturnValue({ component: undefined, label: '', parent: undefined });

      // Does not return component if invalid
      const expected = {
        label: '',
        valid: false,
      };

      const result = getComponentLabelValidity(key, formConfiguration);

      expect(result).toEqual(expected);
      expect(spy).toHaveBeenCalledWith(key);
    });

    it('should return empty label and invalid flag if label is not defined', () => {
      const key = 'documents.proofOfIncome';
      const formConfiguration = new FormConfigurationModel(AuditEventFormioConfigurationNuverialMultipleFileUploadMock);
      const spy = jest.spyOn(formConfiguration, 'getComponentDataByKey').mockReturnValue({
        component: {
          input: true,
          key: 'documents.proofOfIncome',
        },
        label: '',
        parent: undefined,
      });

      // Does not return component if invalid
      const expected = {
        label: '',
        valid: false,
      };

      const result = getComponentLabelValidity(key, formConfiguration);

      expect(result).toEqual(expected);
      expect(spy).toHaveBeenCalledWith(key);
    });
  });

  describe('componentIsListType', () => {
    it('should return true if component type is nuverialFormList', () => {
      const component = { type: 'nuverialFormList' };

      const result = componentIsListType(component);

      expect(result).toBe(true);
    });

    it('should return true if component type is nuverialMultipleFileUpload', () => {
      const component = { type: 'nuverialMultipleFileUpload' };

      const result = componentIsListType(component);

      expect(result).toBe(true);
    });

    it('should return false if component type is not nuverialFormList or nuverialMultipleFileUpload', () => {
      const component = { type: 'someOtherType' };

      const result = componentIsListType(component);

      expect(result).toBe(false);
    });

    it('should return false if component is undefined', () => {
      const component = undefined;

      const result = componentIsListType(component);

      expect(result).toBe(false);
    });
  });

  describe('displayValueOrBlank', () => {
    it('should return "blank" if state is empty', () => {
      const state = '';
      const expected = 'blank';

      const result = displayValueOrBlank(state);

      expect(result).toEqual(expected);
    });

    it('should return "blank" if state is null', () => {
      const state = 'null';
      const expected = 'blank';

      const result = displayValueOrBlank(state);

      expect(result).toEqual(expected);
    });

    it('should return the state if it is not empty, null, or undefined', () => {
      const state = 'some value';
      const expected = 'some value';

      const result = displayValueOrBlank(state);

      expect(result).toEqual(expected);
    });
  });
});
