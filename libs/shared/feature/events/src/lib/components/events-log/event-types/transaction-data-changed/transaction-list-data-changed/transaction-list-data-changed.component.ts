import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EventUpdates } from '@dsg/shared/data-access/audit-api';
import { FormConfigurationModel } from '@dsg/shared/data-access/work-api';
import { DocumentFormService } from '@dsg/shared/feature/form-nuv';
import { take } from 'rxjs';
import { componentIsListType, displayValueOrBlank, getComponentLabelValidity, splitIndicesFromKey } from '../../utils/transaction-data-changed.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'dsg-transaction-list-data-changed',
  standalone: true,
  styleUrls: ['../transaction-data-changed.component.scss'],
  templateUrl: './transaction-list-data-changed.component.html',
})
export class TransactionListDataChangedComponent implements OnInit {
  @Input()
  public newStates?: Record<string, string>;

  @Input()
  public oldStates?: Record<string, string>;

  @Input()
  public formConfiguration?: FormConfigurationModel;

  public listEventUpdates: Map<string, EventUpdates[]> = new Map();

  constructor(private readonly _documentFormService: DocumentFormService) {}

  public ngOnInit(): void {
    const newStateListMap = this._mapSameKeyValues(this.newStates ?? {});
    const oldStateListMap = this._mapSameKeyValues(this.oldStates ?? {});

    this._getListUpdates(newStateListMap, oldStateListMap);
  }

  private _handleNewStateList(componentKey: string, newStateList: string[]): void {
    for (const [index, newStateValue] of newStateList.entries()) {
      if (!newStateValue) continue;

      const { component, label, valid } = getComponentLabelValidity(componentKey, this.formConfiguration);
      if (!valid) continue;

      let _newStateValue = newStateValue;
      let newDocumentId = '';
      const _oldStateValue = '';
      const oldDocumentId = '';

      if (component && component.type === 'nuverialMultipleFileUpload') {
        newDocumentId = newStateValue;
        _newStateValue = this._fileDisplayValue(index); // TODO: Doesn't yet support file lists within lists (DSG-2717)
      }

      const newStateDisplayValue: string = displayValueOrBlank(_newStateValue);

      this._addListEventUpdate(componentKey, {
        label: label,
        newDocumentId: newDocumentId,
        newState: newStateDisplayValue,
        oldDocumentId: oldDocumentId,
        oldState: _oldStateValue,
      });
    }
  }

  private _handleRemoveStateList(componentKey: string, oldStateList: string[]): void {
    for (const [index, oldStateValue] of oldStateList.entries()) {
      if (!oldStateValue) continue;

      const { component, label, valid } = getComponentLabelValidity(componentKey, this.formConfiguration);
      if (!valid) continue;

      if (component && component.type === 'nuverialMultipleFileUpload') {
        const oldDocumentId = oldStateValue;
        const _oldStateValue = this._fileDisplayValue(index); // Doesn't yet support file lists within lists

        this._addListEventUpdate(componentKey, {
          label: label,
          newDocumentId: '',
          newState: '',
          oldDocumentId: oldDocumentId,
          oldState: _oldStateValue,
        });
      }
    }
  }

  private _getListUpdates(newStateListMap: Map<string, string[]>, oldStateListMap: Map<string, string[]>): void {
    const allKeys = new Set([...newStateListMap.keys(), ...oldStateListMap.keys()]);

    allKeys.forEach(componentKey => {
      const oldStateList = oldStateListMap.get(componentKey);
      const newStateList = newStateListMap.get(componentKey);

      if (!oldStateList && newStateList) {
        this._handleNewStateList(componentKey, newStateList);
      } else if (oldStateList && !newStateList) {
        this._handleRemoveStateList(componentKey, oldStateList);
      } else {
        if (!oldStateList || !newStateList) return;

        this._handleListItemRemovalAndAddition(componentKey, oldStateList, newStateList);
      }
    });
  }

  /**
   * Detects file removal and addition events and adds them to the listEventUpdates map.
   * Identifies removals in the middle of lists and ignores the resulting left shift of other files.
   * Also detects new additions towards the back.
   */
  private _handleListItemRemovalAndAddition(componentKey: string, oldStateList: string[], newStateList: string[]): void {
    const newStateListIndices = new Set(newStateList.map((_, index) => index));

    for (const [oldIndex, oldStateValue] of oldStateList.entries()) {
      if (!oldStateValue) continue;

      const { component, label, valid } = getComponentLabelValidity(componentKey, this.formConfiguration);
      if (!valid) continue;

      if (component && component.type === 'nuverialMultipleFileUpload') {
        const newIndex = newStateList.indexOf(oldStateValue);
        const oldDocumentId = oldStateValue;

        if (newIndex === -1) {
          // File removed from list at oldIndex
          const _oldStateValue = this._fileDisplayValue(oldIndex); // Doesn't yet support file lists within lists

          this._addListEventUpdate(componentKey, {
            label: label,
            newDocumentId: '',
            newState: '',
            oldDocumentId: oldDocumentId,
            oldState: _oldStateValue,
          });
        }
        // if oldIndex - newIndex !== numFilesRemoved, a file removed and then reuploaded at a different index
        // This should not occur since a reuploaded file will have a different id. It is also handled with the loop below

        // if oldIndex - newIndex === numFilesRemoved, this change was due to a left shift and should be ignored
        // Thus the if statement has only one case; the other cases are ignored.

        newStateListIndices.delete(newIndex);
      }
    }
    this._handleAddedFiles(newStateListIndices, componentKey, newStateList);
  }

  /**
   * Helper to catch new files that were added at the back
   */
  private _handleAddedFiles(newStateListIndices: Set<number>, componentKey: string, newStateList: string[]): void {
    for (const remainingIndex of newStateListIndices) {
      const { label, valid } = getComponentLabelValidity(componentKey, this.formConfiguration);
      if (!valid) continue;

      const newStateValue = newStateList[remainingIndex];

      if (!newStateValue) continue;

      const _newStateValue = this._fileDisplayValue(remainingIndex); // Doesn't yet support file lists within lists
      const newStateDisplayValue: string = displayValueOrBlank(_newStateValue);
      const newDocumentId = newStateValue;

      this._addListEventUpdate(componentKey, {
        label: label,
        newDocumentId: newDocumentId,
        newState: newStateDisplayValue,
        oldDocumentId: '',
        oldState: '',
      });
    }
  }

  /**
   * Helper function to add an event update to the listEventUpdates map
   */
  private _addListEventUpdate(componentKey: string, eventUpdate: EventUpdates): void {
    if (!this.listEventUpdates.get(componentKey)) {
      this.listEventUpdates.set(componentKey, []);
    }

    this.listEventUpdates.get(componentKey)?.push(eventUpdate);
  }

  /**
   * Helper function to calculate the display index, one-indexed
   */
  private _fileDisplayValue(index: number): string {
    return `File[${index + 1}]`;
  }

  /**
   * Groups values with the same key into lists
   * Ignores list notation: keys with same path but different indices will be grouped together
   *
   * Example: documents.id[0] and documents.id[1] will be grouped together
   */
  private _mapSameKeyValues(states: Record<string, string>): Map<string, string[]> {
    const stateListValueBucket: Map<string, Map<number, string>> = Object.entries(states).reduce((acc, entry) => {
      const [key, value] = entry;
      const { componentKey, indices } = splitIndicesFromKey(key);
      const component = this.formConfiguration?.getComponentDataByKey(componentKey)?.component;

      if (!component || !componentIsListType(component)) return acc;

      const index = Number(indices[0][1]); // Should be list

      if (!acc.has(componentKey)) {
        acc.set(componentKey, new Map([[index, value]]));
      } else {
        acc.get(componentKey)?.set(index, value);
      }

      return acc;
    }, new Map());

    const stateListMap: Map<string, string[]> = new Map();

    for (const [componentKey, valueMap] of stateListValueBucket.entries()) {
      if (!stateListMap.has(componentKey)) {
        const valueList = Array(valueMap.size);
        for (const [key, value] of valueMap.entries()) {
          valueList[key] = value;
        }

        stateListMap.set(splitIndicesFromKey(componentKey).componentKey, valueList);
      }
    }

    return stateListMap;
  }

  public openDocument(documentId: string) {
    this._documentFormService.openDocument$(documentId).pipe(take(1)).subscribe();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
