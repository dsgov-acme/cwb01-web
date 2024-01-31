import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NuverialIconComponent } from '../icon';

interface TreeNode {
  [key: string]: unknown;
  children: TreeNode[];
  disabled: boolean;
  icon?: string;
  key: string;
  label: string;
  selected?: boolean;
}

/**
 * Nuverial Tree Component
 *
 * The tree component provides display for an generic n-ary tree in a nested list fashion.
 * Users can select a tree node, which triggers the `select` event emitter to output the full
 * path from the root node to the selected node. Each internal node can also be collapsed to hide its children.
 *
 * The tree must have a single root node
 * Example structure:
 * - Root
 *   - Child 1
 *     - Child 1.1
 *     - Child 1.2
 *   - Child 2
 *     - Child 2.1
 *   - Child 3
 *
 * ## Usage
 *
 * ```html
 *   <nuverial-tree
 *     [root]="treeRoot"
 *     [selectable]="true"
 *     (nodeSelected)="onNodeSelected($event)"
 *   </nuverial-tree>
 * ```
 *
 * - `[root]`: The root node of the tree to be displayed.
 * - `[selectable]`: Whether the tree nodes are selectable or not.
 * - `(actionSelected)`: Event emitter containing the path from the root to the selected node (e.g. root.child1.child2).
 *
 * The `root` input should be of type `TreeNode`, which has the following properties:
 * - `children`: An array of child nodes.
 * - `disabled`: Whether the node is disabled or not.
 * - `icon`: The icon to be shown next to the label
 * - `key`: A unique identifier for the node.
 * - `parent`: The parent node of the current node.
 * - `label`: The label to be displayed for the node.
 * - `selected`: Whether the node is selected or not.
 *
 * Tree nodes are not modified in this component, handle any modifications in the parent component.
 * The tree automatically styles the leaf or internal nodes which are determined by the number of children.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialIconComponent],
  selector: 'nuverial-tree',
  standalone: true,
  styleUrls: ['./tree.component.scss'],
  templateUrl: './tree.component.html',
})
export class NuverialTreeComponent {
  /**
   * The root node of the tree to be displayed
   */
  private _root!: TreeNode;
  public rootLabel = '';

  @Input()
  public set root(value: TreeNode) {
    this._root = value;
    this.rootLabel = this._root?.label;
  }

  public get root(): TreeNode {
    return this._root;
  }

  @Input()
  public attributeName = '';

  /**
   * Event emitter containing the path from the root to the selected node (e.g. root.child1.child2)
   */
  @Output() public readonly nodeSelected: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

  /**
   * If the tree nodes are selectable or not
   */
  @Input()
  public selectable = false;

  public onSelect(node: TreeNode): void {
    if (!this.selectable) return;

    this.nodeSelected.emit(node);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
