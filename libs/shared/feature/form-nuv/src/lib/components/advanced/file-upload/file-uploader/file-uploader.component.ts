import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DocumentModel, checkIfDocumentShouldDisplayErrors } from '@dsg/shared/data-access/document-api';
import { FileStatus, NuverialFileUploadComponent, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, Subject, catchError, concatMap, filter, finalize, from, map, mergeMap, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { DocumentFormService } from '../../../../services/document-form.service';
import { FormRendererService } from '../../../../services/form-renderer.service';
import { FormlyBaseComponent } from '../../../base';
import { FormStateMode } from '../../../forms';
import { FileUploadFieldProperties } from '../models/formly-file-upload.model';

interface FormControlEntry {
  documentId: string;
  filename: string;
}

interface UploadingStatus {
  isUploading: boolean;
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialFileUploadComponent],
  selector: 'dsg-file-uploader',
  standalone: true,
  styleUrls: ['./file-uploader.component.scss'],
  templateUrl: './file-uploader.component.html',
})
export class FormlyFileUploaderComponent extends FormlyBaseComponent<FileUploadFieldProperties> implements OnInit {
  public loading = false;
  public fileStatus: Map<string, FileStatus> = new Map();
  public filePreview: Map<string, File> = new Map();

  public get documentList(): FormControlEntry[] {
    if (!this.formControl.value) return [];

    if (this.field.props.multiple && Array.isArray(this.formControl.value)) {
      return this.formControl.value;
    } else {
      return [this.formControl.value];
    }
  }

  constructor(
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _documentFormService: DocumentFormService,
    private readonly _formRendererService: FormRendererService,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
  ) {
    super();
  }

  private _numUploading = 0; // Do not modify directly. Mutex is achieved with _uploadingSubject

  private readonly _cancelUpload$ = new Subject<string>();
  private readonly _uploadingSubject = new Subject<UploadingStatus>();

  private readonly _updateUploading$ = this._uploadingSubject.pipe(
    concatMap(status => of(status)),
    tap(status => {
      status.isUploading ? this._numUploading++ : this._numUploading--;

      this.formControl.updateValueAndValidity();
    }),
    untilDestroyed(this),
  );

  private get _isUploading(): boolean {
    return this._numUploading > 0;
  }

  private _isUploadingValidator(): ValidatorFn {
    return (_control: AbstractControl): ValidationErrors | null => {
      if (this._isUploading) {
        return { uploading: true };
      }

      return null;
    };
  }

  private _setFileStatus(name: string, status: FileStatus) {
    this.fileStatus.set(name, status);
    this.fileStatus = structuredClone(this.fileStatus);
  }

  private _initFilePreview(): void {
    if (this.mode !== FormStateMode.Edit) return;

    // Get all existing documents
    let documentList: FormControlEntry[] = [];
    if (Array.isArray(this.formControl.value)) {
      documentList = this.formControl.value;
    } else {
      documentList.push(this.formControl.value);
    }

    const initialProcessingStatus = {
      failed: false,
      processors: [],
    };

    // Populate fileStatus to show all files in order
    documentList.forEach(document => {
      const fileName = document?.filename;
      const documentId = document?.documentId;

      if (!fileName || !documentId) return;

      this._setFileStatus(fileName, {
        isLoading: true,
        isProcessing: false,
        isUploading: false,
        name: fileName,
        processingStatus: initialProcessingStatus,
        uploadProgress: 100,
      });
    });

    from(documentList)
      .pipe(
        filter(document => !!document?.documentId),
        tap(_ => (this.loading = true)),
        mergeMap(document => {
          const documentId = document.documentId;
          const fileName = document.filename;
          if (!documentId || !fileName) return EMPTY;

          return this._documentFormService.getDocumentFileDataById$(documentId).pipe(
            tap(blob => {
              const loadedFile = new File([blob], fileName, { type: blob.type }); // Unfortunately getDocumentFileDataById$ does not return the file name

              this._setFileStatus(fileName, {
                isLoading: false,
                isProcessing: false,
                isUploading: false,
                name: fileName,
                processingStatus: initialProcessingStatus,
                uploadProgress: 100,
              });
              this.filePreview.set(fileName, loadedFile);
              this.filePreview = structuredClone(this.filePreview); // Trigger setter

              this._changeDetectorRef.markForCheck();
            }),
            switchMap(_ => {
              return this._documentFormService.getProcessingResultsById$(documentId, () => {
                this._setFileStatus(fileName, {
                  isLoading: false,
                  isProcessing: true,
                  isUploading: false,
                  name: fileName,
                  processingStatus: initialProcessingStatus,
                  uploadProgress: 100,
                });
              });
            }),
            tap(processingResult => {
              const processingStatus = {
                failed: checkIfDocumentShouldDisplayErrors(processingResult) > 0,
                processors: processingResult,
              };

              this._setFileStatus(fileName, {
                isLoading: false,
                isProcessing: false,
                isUploading: false,
                name: fileName,
                processingStatus: processingStatus,
                uploadProgress: 100,
              });
            }),
            catchError(_error => {
              this._nuverialSnackBarService.notifyApplicationError();

              return EMPTY;
            }),
            // We handle unsubscribe in 3 ways here because this is a polling observable and we want to complete if this cancels or we navigate away
            take(1),
            takeUntil(this._cancelUpload$),
            untilDestroyed(this),
          );
        }),
        finalize(() => {
          this.loading = false;
          this._changeDetectorRef.markForCheck();
          this.filePreview = structuredClone(this.filePreview); // Trigger setter
        }),
        takeUntil(this._cancelUpload$.asObservable()),
        untilDestroyed(this),
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this._initFilePreview();

    this.formControl.addValidators(this._isUploadingValidator());
    if (this.field.props.required) {
      this.formControl.addValidators(Validators.required);
    }

    this._updateUploading$.subscribe();
  }

  public onUploadDocument(file: File) {
    this._uploadingSubject.next({ isUploading: true });

    this._documentFormService
      .uploadDocument$(file)
      .pipe(
        tap(response => {
          let status = this.fileStatus.get(file.name);

          // Add the file to the fileStatus map if it doesn't exist
          if (!status) {
            const processingStatus = { failed: false, processors: [] };
            this._setFileStatus(file.name, { isLoading: false, isProcessing: false, isUploading: true, name: file.name, processingStatus, uploadProgress: 0 });
            this.filePreview.set(file.name, file);

            status = this.fileStatus.get(file.name);
            this._changeDetectorRef.markForCheck();
          }

          // Update the upload progress
          if (typeof response === 'number' && status) {
            const updatedfileStatus = { ...status, uploadProgress: response };
            this._setFileStatus(file.name, updatedfileStatus);

            status = this.fileStatus.get(file.name);
            this._changeDetectorRef.markForCheck();
          }

          // Update the form control when upload finishes
          if (response instanceof DocumentModel) {
            let updatedFormValue = this.formControl?.value;

            // Update value depending on multiple or single
            if (this.field.props.multiple) {
              if (!updatedFormValue) updatedFormValue = [];

              updatedFormValue.push({
                documentId: response.documentId,
                filename: file.name,
              });
            } else {
              updatedFormValue = {
                ...updatedFormValue,
                documentId: response.documentId,
                filename: file.name,
              };
            }

            this.formControl?.setValue(updatedFormValue);
            this.formControl?.updateValueAndValidity();

            // Update file processing and upload status
            if (status) {
              const updatedfileStatus = { ...status, isProcessing: true, isUploading: false };
              this._setFileStatus(file.name, updatedfileStatus);
            }
          }
        }),
        filter(response => response instanceof DocumentModel),
        tap(() => this._uploadingSubject.next({ isUploading: false })),
        map(response => response as DocumentModel),
        switchMap(document =>
          this._documentFormService.processDocument$(this._formRendererService.transactionId, document.documentId, this.field.key?.toString() || ''),
        ),
        tap(processingResult => {
          const processingStatus = {
            failed: checkIfDocumentShouldDisplayErrors(processingResult) > 0,
            processors: processingResult,
          };

          const fileStatus = this.fileStatus.get(file.name);
          if (fileStatus) this._setFileStatus(file.name, { ...fileStatus, processingStatus: processingStatus });
        }),
        catchError(_error => {
          this._nuverialSnackBarService.notifyApplicationError();
          this._changeDetectorRef.markForCheck();

          return EMPTY;
        }),
        finalize(() => {
          const fileStatus = this.fileStatus.get(file.name);

          if (fileStatus) {
            const updatedfileStatus = { ...fileStatus, isProcessing: false };
            this._setFileStatus(file.name, updatedfileStatus);
            this._changeDetectorRef.markForCheck();
          }
        }),
        // We handle unsubscribe in 3 ways here because this is a polling observable and we want to complete if this cancels or we navigate away
        take(1),
        takeUntil(this._cancelUpload$.pipe(filter(name => name === file.name))),
        untilDestroyed(this),
      )
      .subscribe();
  }

  public removeDocument(name: string) {
    if (Array.isArray(this.formControl.value)) {
      const updatedValue = this.formControl.value.filter((file: FormControlEntry) => file.filename !== name);
      this.formControl.setValue(updatedValue);
    } else {
      this.formControl.setValue(null);
    }
  }

  public onRemoveDocument(name: string) {
    this.fileStatus.delete(name);
    this.filePreview.delete(name);
    this.fileStatus = structuredClone(this.fileStatus);
    this.removeDocument(name);
    this._cancelUpload$.next(name);

    this.formControl.updateValueAndValidity();
  }

  public openDocument(index: number) {
    const document = this.field.props.multiple ? this.formControl.value[index] : this.formControl.value;

    this._documentFormService.openDocument$(document.documentId).pipe(take(1)).subscribe();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
