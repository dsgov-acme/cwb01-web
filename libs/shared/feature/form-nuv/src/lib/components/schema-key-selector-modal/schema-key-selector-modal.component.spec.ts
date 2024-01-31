import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { SchemaTreeDefinitionMock, SchemaTreeDefinitionModel } from '@dsg/shared/data-access/work-api';
import { NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { LoggingService } from '@dsg/shared/utils/logging';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { SchemaTreeService } from '../../services';
import { SchemaKeySelectorModalComponent } from './schema-key-selector-modal.component';

interface TreeNode {
  [key: string]: any;
  children: TreeNode[];
  disabled: boolean;
  icon?: string;
  key: string;
  label: string;
  selected?: boolean;
}

export const mockTree: TreeNode = {
  children: [
    {
      children: [
        {
          children: [],
          disabled: false,
          key: 'Child1a',
          label: 'Child1a',
          type: 'String',
        },
      ],
      disabled: false,
      key: 'Child1',
      label: 'Child1',
      type: 'DynamicEntity',
    },
    {
      children: [
        {
          children: [],
          contentType: 'Document',
          disabled: false,
          key: 'Child2a',
          label: 'Child2a',
          type: 'List',
        },
      ],
      disabled: false,
      key: 'Child2',
      label: 'Child2',
      type: 'DynamicEntity',
    },
  ],
  disabled: false,
  key: 'Root',
  label: 'Root',
  type: 'DynamicEntity',
};

const mockTreeNode: TreeNode = {
  children: [],
  disabled: false,
  key: 'key',
  label: 'label',
};

const schemaTreeMock = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);
global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

describe('SchemaKeySelectorComponent', () => {
  let component: SchemaKeySelectorModalComponent;
  let fixture: ComponentFixture<SchemaKeySelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaKeySelectorModalComponent, NoopAnimationsModule],
      providers: [
        MockProvider(SchemaTreeService, {
          schemaTree$: of(schemaTreeMock),
        }),
        MockProvider(NuverialSnackBarService),
        MockProvider(LoggingService),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ transactionDefinitionKey: 'FinancialBenefit' })),
          },
        },
        { provide: MAT_DIALOG_DATA, useValue: 'FinancialBenefit' },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn().mockReturnValue('FinancialBenefit'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaKeySelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadSchemaTree$', () => {
    it('should set baseSchemaTree to the tree representation of the response items', () => {
      component.loadSchemaTree$.subscribe();

      expect(component.baseSchemaTree).toEqual(SchemaTreeDefinitionModel.toTree(SchemaTreeDefinitionMock));
    });

    it('should call getSchemasList', () => {
      jest.spyOn(component, 'getSchemasList');

      component.loadSchemaTree$.subscribe();

      expect(component.getSchemasList).toHaveBeenCalled();
    });
  });

  describe('filterSchemaTree', () => {
    it('should set schemaTree to baseSchemaTree when searchText is falsy', () => {
      component.baseSchemaTree = { children: [], disabled: false, key: 'root', label: 'Root' };
      component.schemaTree = { children: [], disabled: false, key: 'child', label: 'Child' };

      component.filterSchemaTree('');

      expect(component.schemaTree).toEqual(component.baseSchemaTree);
    });

    it('should filter with deep partial matching when searchText is single step', () => {
      const searchText = '2a';
      const expectedTree = {
        children: [
          {
            children: [
              {
                children: [],
                contentType: 'Document',
                disabled: false,
                key: 'Child2a',
                label: 'Child2a',
                type: 'List',
              },
            ],
            contentType: undefined,
            disabled: false,
            key: 'Child2',
            label: 'Child2',
            type: 'DynamicEntity',
          },
        ],
        contentType: undefined,
        disabled: false,
        key: 'Root',
        label: 'Root',
        type: 'DynamicEntity',
      };

      component.baseSchemaTree = mockTree;

      component.filterSchemaTree(searchText);

      expect(component.schemaTree).toEqual(expectedTree);
    });

    it('should filter with exact intermediate step matching when searchText is full path', () => {
      const searchText = 'child1.child1a';
      const expectedTree = {
        children: [
          {
            children: [
              {
                children: [],
                disabled: false,
                key: 'Child1a',
                label: 'Child1a',
                type: 'String',
              },
            ],
            contentType: undefined,
            disabled: false,
            key: 'Child1',
            label: 'Child1',
            type: 'DynamicEntity',
          },
        ],
        contentType: undefined,
        disabled: false,
        key: 'Root',
        label: 'Root',
        type: 'DynamicEntity',
      };

      component.baseSchemaTree = mockTree;

      component.filterSchemaTree(searchText);

      expect(component.schemaTree).toEqual(expectedTree);
    });
  });

  describe('searching', () => {
    it('should clear the search input', () => {
      component.searchInput.setValue('test');
      fixture.detectChanges();

      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      const clearIconDebugElement = containerDebugElement.query(By.css('nuverial-button'));
      expect(clearIconDebugElement).toBeTruthy();

      clearIconDebugElement.triggerEventHandler('click', null);
      expect(component.searchInput.value).toEqual('');
    });

    it('should set the search box icon', () => {
      fixture.detectChanges();

      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      const buttonDebugElement = containerDebugElement.query(By.css('nuverial-button'));
      expect(buttonDebugElement).toBeTruthy();

      const iconDebugElement = buttonDebugElement.query(By.css('nuverial-icon'));
      expect(iconDebugElement).toBeTruthy();

      let iconName = iconDebugElement.nativeElement.getAttribute('ng-reflect-icon-name');
      expect(iconName).toBe('search');

      component.searchInput.setValue('test');
      containerDebugElement.triggerEventHandler('keyup', {});
      fixture.detectChanges();

      iconName = iconDebugElement.nativeElement.getAttribute('ng-reflect-icon-name');
      expect(iconName).toBe('cancel_outline');
    });

    it('should call filterSchemaTree with proper filters when searchText has a value', async () => {
      const spy = jest.spyOn(component, 'filterSchemaTree');
      const searchText = 'some search text';
      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      component.searchInput.setValue(searchText);
      containerDebugElement.triggerEventHandler('keyup.enter', {});
      component.filteredSchemaTree$.subscribe();

      expect(spy).toHaveBeenCalledWith(searchText);
    });

    it('should call getTransactionDefinitionsList$ with proper filters when searchText is empty', () => {
      const spy = jest.spyOn(component, 'filterSchemaTree');
      const containerDebugElement = fixture.debugElement.query(By.css('nuverial-text-input'));
      expect(containerDebugElement).toBeTruthy();

      component.searchInput.setValue('');
      containerDebugElement.triggerEventHandler('keyup.enter', {});
      component.filteredSchemaTree$.subscribe();

      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('setSelectedSchemaKey', () => {
    it('should set selectedSchemaKey to the key of the selected schema', () => {
      component.schemaTree = mockTree;
      const selectedNode = mockTree.children[0].children[0];

      component.setSelectedSchemaKey(selectedNode);

      expect(component.selectedSchemaKey).toEqual('Child1.Child1a');
    });
  });

  describe('clearSelectedSchemaKey', () => {
    it('should set selectedSchemaKey to empty string', () => {
      component.schemaTree = mockTree;
      component.selectedSchemaKey = 'some value';

      component.clearSelectedSchemaKey();

      expect(component.selectedSchemaKey).toEqual('');
    });
  });

  describe('updateSelectedNode', () => {
    it('should set selectedNode to null if selectedSchemaKey is falsy', () => {
      component.schemaTree = mockTree;
      component.selectedNode = { selected: true } as any;
      component.selectedSchemaKey = '';

      component.updateSelectedNode();

      expect(component.selectedNode).toBeNull();
    });

    it('should set selectedNode to null if selectedSchemaKey does not match any node in the schemaTree', () => {
      component.selectedNode = { selected: true } as any;
      component.selectedSchemaKey = 'invalid.key';

      component.updateSelectedNode();

      expect(component.selectedNode).toBeNull();
    });

    it('should set selectedNode to the matching node in the schemaTree and mark it as selected', () => {
      component.schemaTree = mockTree;
      component.selectedNode = { selected: false } as any;
      component.selectedSchemaKey = 'Child1.Child1a';

      component.updateSelectedNode();

      expect(component.selectedNode).toEqual(mockTree.children[0].children[0]);
      expect(component?.selectedNode?.selected).toBeTruthy();
    });
  });

  describe('dialog closing', () => {
    it('should submit the dialog with the selected key', () => {
      const spy = jest.spyOn(component['_dialog'], 'close');
      component.selectedSchemaKey = 'some key';
      component.submitDialog();

      expect(spy).toHaveBeenCalledWith('some key');
    });

    it('should close the dialog', () => {
      const spy = jest.spyOn(component['_dialog'], 'close');
      component.closeDialog();

      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('_isAllowedType', () => {
    it('should return true if allowedTypes is empty', () => {
      const node = { ...mockTreeNode, type: 'String' };
      const allowedTypes = new Set<string>();

      const result = component['_isAllowedType'](node, allowedTypes);

      expect(result).toBe(true);
    });

    it('should return true if fullTypeString is DynamicEntity', () => {
      const node = { ...mockTreeNode, type: 'DynamicEntity' };
      const allowedTypes = new Set<string>(['String', 'Integer']);

      const result = component['_isAllowedType'](node, allowedTypes);

      expect(result).toBe(true);
    });

    it('should return true if fullTypeString is in allowedTypes', () => {
      const node = { ...mockTreeNode, type: 'String' };
      const allowedTypes = new Set<string>(['String', 'Integer']);

      const result = component['_isAllowedType'](node, allowedTypes);

      expect(result).toBe(true);
    });

    it('should return false if fullTypeString is not in allowedTypes', () => {
      const node = { ...mockTreeNode, type: 'Boolean' };
      const allowedTypes = new Set<string>(['String', 'Integer']);

      const result = component['_isAllowedType'](node, allowedTypes);

      expect(result).toBe(false);
    });

    it('should return true if node has contentType and fullTypeString is in allowedTypes', () => {
      const node = { ...mockTreeNode, contentType: 'Document', type: 'List' };
      const allowedTypes = new Set<string>(['List<Document>', 'String']);

      const result = component['_isAllowedType'](node, allowedTypes);

      expect(result).toBe(true);
    });

    it('should return true if node is List and generic List is in allowedTypes', () => {
      const node = { ...mockTreeNode, contentType: 'Document', type: 'List' };
      const allowedTypes = new Set<string>(['List']);

      const result = component['_isAllowedType'](node, allowedTypes);

      expect(result).toBe(true);
    });
  });

  describe('filterTreeByType', () => {
    it('should filter tree nodes by type', () => {
      const schemaTree = new SchemaTreeDefinitionModel(SchemaTreeDefinitionMock);
      const root = SchemaTreeDefinitionModel.toTree(schemaTree);
      root.children[0]['type'] = 'Integer';

      const expectedTree: TreeNode = {
        children: [
          {
            children: [],
            disabled: false,
            icon: 'short_text',
            key: 'firstName',
            label: 'firstName',
            type: 'Integer',
          },
          {
            children: [
              {
                children: [],
                disabled: true,
                icon: 'short_text',
                key: 'address',
                label: 'address',
                type: 'String',
              },
              {
                children: [],
                disabled: true,
                icon: 'short_text',
                key: 'city',
                label: 'city',
                type: 'String',
              },
            ],
            disabled: true,
            icon: 'schema',
            key: 'CommonPersonalInformation',
            label: 'CommonPersonalInformation',
            type: 'DynamicEntity',
          },
          {
            children: [],
            disabled: true,
            icon: 'short_text',
            key: 'lastName',
            label: 'lastName',
            type: 'String',
          },
          {
            children: [],
            disabled: true,
            icon: 'description',
            key: 'id',
            label: 'id',
            type: 'Document',
          },
          {
            children: [],
            contentType: 'Document',
            disabled: true,
            icon: 'format_list_bulleted',
            key: 'ids',
            label: 'ids',
            type: 'List',
          },
          {
            children: [],
            contentType: 'DynamicEntity',
            disabled: true,
            entitySchema: 'SomeSchema',
            icon: 'format_list_bulleted',
            key: 'schemas',
            label: 'schemas',
            type: 'List',
          },
          {
            children: [],
            contentType: 'Document',
            disabled: true,
            icon: 'format_list_bulleted',
            key: 'ids2',
            label: 'ids2',
            type: 'List',
          },
        ],
        disabled: false,
        icon: 'schema',
        key: 'FinancialBenefit',
        label: 'FinancialBenefit',
        type: 'DynamicEntity',
      };

      const result = component['_disableDisallowedTypes'](root, new Set<string>(['Integer']));

      expect(result).toEqual(expectedTree);
    });
  });
});
