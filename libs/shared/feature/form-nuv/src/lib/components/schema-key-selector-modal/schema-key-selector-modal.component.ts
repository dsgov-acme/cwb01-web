import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchemaTreeDefinitionModel, TreeNode } from '@dsg/shared/data-access/work-api';
import { NuverialButtonComponent, NuverialIconComponent, NuverialTextInputComponent, NuverialTreeComponent } from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { SchemaTreeService } from '../../services';

interface SchemaKeySelectorModalData {
  allowedSchemaTypes: string[];
}

const searchDelay = 350;

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTextInputComponent, NuverialTreeComponent, NuverialButtonComponent, NuverialIconComponent],
  selector: 'dsg-schema-key-selector-modal',
  standalone: true,
  styleUrls: ['./schema-key-selector-modal.component.scss'],
  templateUrl: './schema-key-selector-modal.component.html',
})
export class SchemaKeySelectorModalComponent implements OnInit {
  public searchInput = new FormControl();
  public searchBoxIcon = 'search';
  public schemaTree!: TreeNode;
  public selectedSchemaKey = '';
  public selectedNode: TreeNode | null = null;
  public baseSchemaTree!: TreeNode;
  public allowedSchemaTypes!: Set<string>;

  private readonly _searchFilter: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public loadSchemaTree$ = this._schemaTreeService.schemaTree$.pipe(
    tap(schemaTree => {
      const fullSchemaTree = SchemaTreeDefinitionModel.toTree(schemaTree);
      this.baseSchemaTree = this._disableDisallowedTypes(fullSchemaTree, this.allowedSchemaTypes);
      this.getSchemasList();
    }),
  );

  public filteredSchemaTree$ = this._searchFilter.asObservable().pipe(
    debounceTime(searchDelay),
    distinctUntilChanged(),
    tap(searchText => {
      this.filterSchemaTree(searchText);
      this._changeDetectorRef.markForCheck();
    }),
    untilDestroyed(this),
  );

  // Filters base tree by key, ignoring root key in text and tree
  // Also filters by allowedSchemaTypes
  public filterSchemaTree(searchText: string): void {
    if (!searchText) {
      this.schemaTree = structuredClone(this.baseSchemaTree);
      this.updateSelectedNode();

      return;
    }

    const searchSteps = searchText.toLowerCase().split('.');
    let root: TreeNode = {
      children: [],
      contentType: this.baseSchemaTree['contentType'],
      disabled: false,
      key: this.baseSchemaTree.key,
      label: this.baseSchemaTree.label,
      type: this.baseSchemaTree['type'],
    };

    if (searchSteps.length === 1) {
      // Single step search, return partial matches anywhere
      root = this._filterSchemaTreeSingleStep(searchSteps[0], this.baseSchemaTree) ?? root;
    } else {
      // Multi step search, expect intermediate steps to full match
      root.children = this._filterSchemaTreeMultiStep(0, searchSteps, this.baseSchemaTree);
    }

    this.schemaTree = root;
    this.updateSelectedNode();
  }

  // Updates the selected node in schemaTree based on the selectedSchemaKey
  public updateSelectedNode(): void {
    if (this.selectedNode) {
      this.selectedNode.selected = false;
      this.selectedNode = null;
    }

    const keySteps = this.selectedSchemaKey.split('.');
    const selectedNode = this.findNodeByKey(keySteps, this.schemaTree);

    if (selectedNode) {
      selectedNode.selected = true;
      this.selectedNode = selectedNode;
    } else {
      this.selectedNode = null;
    }
  }

  // Returns the node in the current schemaTree that matches the path of the key
  public findNodeByKey(key: string[], root: TreeNode): TreeNode | null {
    if (key.length === 0 && root !== this.schemaTree) {
      return root;
    } else if (key.length === 0) {
      return null;
    }

    const step = key[0].toLowerCase();
    const matchingChild = root.children.find(child => child.key.toLowerCase() === step);
    if (matchingChild) {
      return this.findNodeByKey(key.slice(1), matchingChild);
    }

    return null;
  }

  // Filters the tree with a single step key (e.g. 'child1'). Key should be lowercase
  private _filterSchemaTreeSingleStep(searchStep: string, currentNode: TreeNode): TreeNode | null {
    const partialMatch = currentNode.key.toLowerCase().includes(searchStep);

    // End of search steps, return deep copy of current node on partial match
    if (partialMatch && currentNode !== this.baseSchemaTree) {
      return structuredClone(currentNode);
    }

    const currentSubtree: TreeNode = {
      children: [],
      contentType: currentNode['contentType'],
      disabled: false,
      key: currentNode.key,
      label: currentNode.label,
      type: currentNode['type'],
    };

    currentNode.children.forEach(child => {
      const childSubtree = this._filterSchemaTreeSingleStep(searchStep, child);
      if (childSubtree) currentSubtree.children.push(childSubtree);
    });

    if (currentSubtree.children.length) return currentSubtree;

    return null;
  }

  // Filters the tree with a multi step key (e.g. 'root.child1.child2'). Key should be lowercase
  private _filterSchemaTreeMultiStep(step: number, searchSteps: string[], currentNode: TreeNode): TreeNode[] {
    if (currentNode.children.length === 0) return [];

    const treeNodes: TreeNode[] = [];
    const searchStep = searchSteps[step];

    if (step < searchSteps.length - 1) {
      // Full match in intermediate steps
      // Only add intermediate node's children if their decendants match subsequent search steps

      currentNode.children.forEach((child: TreeNode) => {
        const childNode: TreeNode = {
          children: this._filterSchemaTreeMultiStep(step + 1, searchSteps, child),
          contentType: child['contentType'],
          disabled: false,
          key: child.key,
          label: child.label,
          type: child['type'],
        };

        // Push only if intermediate node's child has matching descendants
        if (childNode.children.length && childNode.key.toLowerCase() === searchStep) treeNodes.push(childNode);
      });
    } else {
      // Last step of search, partial match all children
      currentNode.children.forEach(child => {
        const childSubtree = this._filterSchemaTreeSingleStep(searchStep, child);
        if (childSubtree) {
          treeNodes.push(childSubtree);
        }
      });
    }

    return treeNodes;
  }

  private _isAllowedType(node: TreeNode, allowedTypes: Set<string>): boolean {
    if (allowedTypes.size === 0) return true;

    const typeString = node['type'] as string;
    const fullTypeString = SchemaTreeDefinitionModel.getTypeString(typeString, node['contentType'] as string);

    if (typeString === 'List' && allowedTypes.has(typeString)) return true; // Allow any list if generic 'List' is allowed
    if (fullTypeString === 'DynamicEntity') return true; // Search nested through child schemas

    return fullTypeString ? allowedTypes.has(fullTypeString) : true;
  }

  private _disableDisallowedTypes(root: TreeNode, allowedTypes: Set<string>): TreeNode {
    const disableDisallowedTypesRecursive = (current: TreeNode): TreeNode => {
      const allowed = this._isAllowedType(current, allowedTypes);

      if (!current.children.length && allowed) {
        return { ...current };
      } else if (!current.children.length) {
        return { ...current, disabled: true };
      }

      const children: TreeNode[] = [];
      let allChildrenDisabled = true;

      current.children.forEach(child => {
        const newChild = disableDisallowedTypesRecursive(child);
        allChildrenDisabled = allChildrenDisabled && newChild.disabled;
        children.push(newChild);
      });

      return { ...current, children, disabled: allChildrenDisabled };
    };

    return disableDisallowedTypesRecursive(root);
  }

  constructor(
    private readonly _schemaTreeService: SchemaTreeService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _dialog: MatDialogRef<SchemaKeySelectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: SchemaKeySelectorModalData,
  ) {
    this.allowedSchemaTypes = new Set(data.allowedSchemaTypes);
  }

  public ngOnInit(): void {
    this.filteredSchemaTree$.subscribe();
  }

  public getSchemasList(): void {
    const searchText = this.searchInput.value ? this.searchInput.value.trim().toLowerCase() : '';
    this.filterSchemaTree(searchText);
  }

  public updateSearchBoxIcon(): void {
    this.searchBoxIcon = this.searchInput.value ? 'cancel_outline' : 'search';
  }

  public liveSearch(): void {
    this.updateSearchBoxIcon();
    const searchText = this.searchInput.value ? this.searchInput.value.trim().toLowerCase() : '';
    this._searchFilter.next(searchText);
  }

  public clearSearch(): void {
    this.searchInput.setValue('');
    this.updateSearchBoxIcon();
    this.getSchemasList();
  }

  public setSelectedSchemaKey(selectedNode: TreeNode): void {
    const fullSchemaKey = this._findFullSchemaKey(selectedNode, this.schemaTree);
    const key = fullSchemaKey.split('.').slice(1).join('.');
    this.selectedSchemaKey = key;
    this.updateSelectedNode();
    this._changeDetectorRef.markForCheck();
  }

  public clearSelectedSchemaKey(): void {
    this.selectedSchemaKey = '';
    this.updateSelectedNode();
    this._changeDetectorRef.markForCheck();
  }

  private _findFullSchemaKey(selectedNode: TreeNode, root: TreeNode): string {
    if (selectedNode === root) {
      return selectedNode.key;
    }

    for (const child of root.children) {
      const foundKey = this._findFullSchemaKey(selectedNode, child);

      if (foundKey) {
        return `${root.key}.${foundKey}`;
      }
    }

    return '';
  }

  public closeDialog(): void {
    this._dialog.close(null);
  }

  public submitDialog(): void {
    this._dialog.close(this.selectedSchemaKey);
  }
}
