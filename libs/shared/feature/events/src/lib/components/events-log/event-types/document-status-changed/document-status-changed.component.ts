import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AuditEventModel } from '@dsg/shared/data-access/audit-api';
import { EnumMapType, FormConfigurationModel } from '@dsg/shared/data-access/work-api';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import { DocumentFormService } from '@dsg/shared/feature/form-nuv';
import { ReplaySubject, take, tap } from 'rxjs';

interface DocumentStatus {
  documentName: string;
  documentId: string;
  rejectedReasons: string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'dsg-document-status-changed',
  standalone: true,
  styleUrls: ['./document-status-changed.component.scss'],
  templateUrl: './document-status-changed.component.html',
})
export class DocumentStatusChangedComponent implements OnInit {
  @Input()
  public event?: AuditEventModel;

  @Input()
  public formConfiguration?: FormConfigurationModel;

  private readonly _documentStatusSubject: ReplaySubject<DocumentStatus> = new ReplaySubject(1);
  public documentStatus$ = this._documentStatusSubject.asObservable();

  constructor(private readonly _documentFormService: DocumentFormService, private readonly _enumService: EnumerationsStateService) {}

  public ngOnInit(): void {
    if (!this.event) return;

    this._handleDocumentStatusChangedEvent(this.event);
  }

  public trackByFn(index: number): number {
    return index;
  }

  private _handleDocumentStatusChangedEvent(event: AuditEventModel) {
    const { data } = event.eventData;

    if (data) {
      const eventData = JSON.parse(data);

      const splitPath = eventData.documentFieldPath.split('[');
      const multiple = splitPath.length > 1;
      let index = 0;
      let documentFieldPath = eventData.documentFieldPath;

      if (multiple) {
        index = Number(splitPath[1][0]) + 1; // 1-based index for display
        documentFieldPath = splitPath[0];
      }

      this._enumService
        .getEnumMap$(EnumMapType.DocumentRejectionReasons)
        .pipe(
          tap(reasons => {
            let documentName = this.formConfiguration?.getComponentLabelByKey(documentFieldPath) ?? '';
            const documentId = eventData.documentId ?? '';
            const rejectedReasons: string[] = [];

            if (multiple) {
              documentName = `${documentName} - File[${index}]`;
            }

            eventData.rejectedReasons.forEach((rejectedReason: string) => {
              rejectedReasons.push(reasons.get(rejectedReason)?.label ?? 'REASON NOT FOUND');
            });

            this._documentStatusSubject.next({
              documentId,
              documentName,
              rejectedReasons,
            });
          }),
          take(1),
        )
        .subscribe();
    }
  }

  public openDocument(documentId: string) {
    this._documentFormService.openDocument$(documentId).pipe(take(1)).subscribe();
  }
}
