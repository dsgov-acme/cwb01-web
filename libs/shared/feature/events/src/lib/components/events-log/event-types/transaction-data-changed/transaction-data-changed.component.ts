import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AuditEventModel, EventUpdates } from '@dsg/shared/data-access/audit-api';
import { FormConfigurationModel, IFormConfigurationSchema } from '@dsg/shared/data-access/work-api';
import { DocumentFormService } from '@dsg/shared/feature/form-nuv';
import { take } from 'rxjs';
import { componentIsListType, displayValueOrBlank, getComponentLabelValidity, splitIndicesFromKey } from '../utils/transaction-data-changed.util';
import { TransactionListDataChangedComponent } from './transaction-list-data-changed/transaction-list-data-changed.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TransactionListDataChangedComponent],
  selector: 'dsg-transaction-data-changed',
  standalone: true,
  styleUrls: ['./transaction-data-changed.component.scss'],
  templateUrl: './transaction-data-changed.component.html',
})
export class TransactionDataChangedComponent implements OnInit {
  @Input()
  public event?: AuditEventModel;

  @Input()
  public formConfiguration?: FormConfigurationModel;

  public singleEventUpdates: Map<string, EventUpdates> = new Map();
  public newStates: Record<string, string> = {};
  public oldStates: Record<string, string> = {};

  constructor(private readonly _documentFormService: DocumentFormService) {}

  public ngOnInit(): void {
    if (!this.event) return;

    this._handleTransactionDataUpdatedEvent(this.event);
  }

  public trackByFn(index: number): number {
    return index;
  }

  private _findAddressDisplayValue(component: IFormConfigurationSchema, addressEntryKey: string, newStateValueKey: string): string {
    // Initialize displayValue with newStateValueKey for address fields with no selection options
    let displayValue = newStateValueKey;

    component.components?.forEach(addressComponent => {
      if (addressComponent.key === addressEntryKey) {
        const searchResult = addressComponent.props?.selectOptions?.find((option: { key: string; displayTextValue: string }) => option.key == newStateValueKey);
        displayValue = searchResult?.displayTextValue || newStateValueKey;
      }
    });

    return displayValue;
  }

  private _handleTransactionDataUpdatedEvent(event: AuditEventModel) {
    const { newState, oldState } = event.eventData;
    if (!newState || !oldState) return; // Nothing happens if either is undefined

    const newStates: Record<string, string> = JSON.parse(newState);
    const oldStates: Record<string, string> = JSON.parse(oldState);
    this.newStates = newStates;
    this.oldStates = oldStates;

    this._getUpdates(newStates, oldStates);
    this._getFileRemovalUpdates(oldStates);
  }

  /**
   * Detects updates to single valued components and adds them to the singleEventUpdates map.
   * Does not detect updates to list components.
   */
  private _getUpdates(newStates: Record<string, string>, oldStates: Record<string, string>): void {
    Object.entries(newStates)
      .reverse()
      .forEach(([key, newStateValue]) => {
        const { componentKey } = splitIndicesFromKey(key);

        const { component, label, valid } = getComponentLabelValidity(componentKey, this.formConfiguration);
        if (!valid || componentIsListType(component)) return;

        let _newStateValue = newStateValue;
        let _oldStateValue;
        let newDocumentId = '';
        let oldDocumentId = '';

        if (component && component.type == 'nuverialSelect' && component.props?.selectOptions) {
          _newStateValue =
            component.props.selectOptions.find((option: { key: string; displayTextValue: string }) => option.key == newStateValue)?.displayTextValue ?? '';
        }

        if (component && component.type == 'nuverialFileUpload') {
          newDocumentId = newStateValue;
          _newStateValue = 'File';
        }

        if (component && component.type == 'nuverialAddress' && typeof newStateValue === 'string') {
          _newStateValue = this._findAddressDisplayValue(component, key, newStateValue);
        }

        const newStateDisplayValue: string = displayValueOrBlank(_newStateValue);
        const oldStateDisplayValue: string = displayValueOrBlank(oldStates[key]);
        _oldStateValue = oldStateDisplayValue;

        if (oldStateDisplayValue != 'blank' && component && component.type == 'nuverialFileUpload') {
          oldDocumentId = oldStateDisplayValue;
          _oldStateValue = 'File';
        }

        this.singleEventUpdates.set(key, {
          label: label,
          newDocumentId: newDocumentId,
          newState: newStateDisplayValue,
          oldDocumentId: oldDocumentId,
          oldState: _oldStateValue,
        });
      });
  }

  /**
   * Detects file removal events and adds them to the singleEventUpdates map
   * Only detects events part of nuverialFileUpload (single file upload)
   */
  private _getFileRemovalUpdates(oldStates: Record<string, string>): void {
    Object.entries(oldStates)
      .reverse()
      .forEach(([key, oldStateValue]) => {
        const { componentKey } = splitIndicesFromKey(key);

        // Ignore already captured updates
        if (this.singleEventUpdates.has(componentKey)) return;

        const { component, label, valid } = getComponentLabelValidity(componentKey, this.formConfiguration);
        if (!valid || componentIsListType(component)) return;

        if (component && component.type === 'nuverialFileUpload') {
          const oldDocumentId = oldStateValue;
          const _oldStateValue = 'File';

          const eventUpdate = {
            label: label,
            newDocumentId: '',
            newState: 'blank',
            oldDocumentId: oldDocumentId,
            oldState: _oldStateValue,
          };

          this.singleEventUpdates.set(componentKey, eventUpdate);
        }
      });
  }

  public openDocument(documentId: string) {
    this._documentFormService.openDocument$(documentId).pipe(take(1)).subscribe();
  }
}
