import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, Observable, combineLatest, filter, map, startWith, tap } from 'rxjs';
import { FormInputBaseDirective } from '../../common';
import { NUVERIAL_FILE_UPLOAD_STATUS } from '../../models';
import { FileUploadControl, FileValidationErrors } from '../../models/file-upload-control.model';
import { NuverialButtonComponent } from '../button';
import { IProcessingStatus, ITooltipProcessingResult, NuverialFileProcessorTooltipComponent } from '../file-processor-tooltip';
import { FileUploadListComponent } from '../file-upload-list/file-upload-list.component';
import { NuverialFormFieldErrorComponent } from '../form-field-error';
import { NuverialIconComponent } from '../icon';

export interface FileStatus {
  // Set by parent component
  name: string;
  isProcessing: boolean;
  isUploading: boolean;
  isLoading: boolean;
  uploadProgress: number;
  processingStatus: IProcessingStatus;
  // Set by file-upload component
  progressWidth?: string;
  status?: string;
  statusMessage?: string;
}

/***
 * File upload component that uploads the file. This is an example of how it can be used
 * in the parent component to handle the progress and retrieve the document id
 *
 * ## Usage
 *
 * ```
 * <nuverial-file-upload
    [documentTitle]="field.props.label"
    [filePreview]="filePreview"
    [fileStatus]="fileStatus"
    [formControl]="formControl"
    [loading]="isLoading"
    [maxFileSize]="maxFileSize"
    [multiple]="field.props.multiple || false"
    (removeDocument)="onRemoveDocument($event)"
    (uploadDocument)="onUploadDocument($event)"
  ></nuverial-file-upload>
 *
 * - `documentTitle`: The title of the document(s) to be uploaded
 * - `filePreview`: Map of the file name and object for file preview and download
 * - `fileStatus`: Map of the file name and FileStatus to track status of each file (upload progress, errors, etc)
 * - `formControl`: The formControl that contains either a single file or an array of files (single or multiple upload)
 * - `loading`: Determines if the file previews are loading
 * - `maxFileSize`: The maximum file size of the uploaded document in MB
 * - `multiple`: Determines if multiple files can be uploaded
 * - `removeDocument`: Event emitter that emits the name of the file to be removed and/or cancelled.
 *      The binded method MUST remove the file entry from fileStatus, filePreview, and formControl
 * - `uploadDocument`: Event emitter that emits the file to be uploaded.
 *      The binded method MUST add the file to fileStatus, filePreview, and formControl
 *
 * Example onRemoveDocument:
 *   public onRemoveDocument(name: string) {
 *     this.fileStatus.delete(name);
 *     this.filePreview.delete(name);
 *     this.fileStatus = structuredClone(this.fileStatus);
 *     this.removeDocument(name);
 *     this._cancelUpload$.next(name);
 *   }
 *
 * Example onUploadDocument:
 *   public onUploadDocument(file: File) {
 *     this._documentFormService
 *       .uploadDocument$(file)
 *       .pipe(
 *         tap(response => {
 *           let status = this.fileStatus.get(file.name);
 *
 *           status = this.updateStatus(status, response);
 *           this.fileStatus.set(file.name, updatedfileStatus);
 *           this.fileStatus = structuredClone(this.fileStatus);
 *
 *           if (response instanceof DocumentModel) {
 *             let updatedFormValue = this.updateFormControlValue(this.formControl?.value);
 *
 *             this.formControl?.setValue(updatedFormValue);
 *
 *             if (status) {
 *               const uploadFinishedStatus = this.updateIploadFinishedStatus(status, response);
 *               this.fileStatus.set(file.name, uploadFinishedStatus);
 *               this.fileStatus = structuredClone(this.fileStatus);
 *               this._changeDetectorRef.markForCheck();
 *             }
 *           }
 *         })
 *       )
 *       .subscribe();
 *   }
 *
 */

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NuverialButtonComponent,
    NuverialFormFieldErrorComponent,
    NuverialIconComponent,
    MatFormFieldModule,
    NuverialFileProcessorTooltipComponent,
    MatProgressSpinnerModule,
    FileUploadListComponent,
  ],
  selector: 'nuverial-file-upload',
  standalone: true,
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})
export class NuverialFileUploadComponent extends FormInputBaseDirective implements ControlValueAccessor, OnInit {
  private _fileStatus = new Map<string, FileStatus>();
  private _filePreview = new Map<string, File>();

  private _maxFileSize = 15;

  private readonly _singleFilePreview: BehaviorSubject<unknown> = new BehaviorSubject<unknown>('');

  // We override formControl here because file upload requires the formControl to be created
  /**
   * The formControl
   */
  @Input() public override formControl: FormControl = new FormControl();

  /**
   * Attached to the aria-label attribute of the host element. This should be considered a required input field, if not provided a warning message will be logged
   */
  @Input() public ariaLabel?: string;

  /**
   * TextInput aria described by
   */
  @Input() public ariaDescribedBy?: string;

  /**
   * The title of the document to be uploaded
   */
  @Input() public documentTitle?: string;

  /**
   * Determines if the drag and drop functionality is available
   */
  @Input() public fileDragDropAvailable = true;

  public get maxFileSize(): number {
    return this._maxFileSize;
  }
  /**
   * The maximum file size of the uploaded document in MB
   */
  @Input()
  public set maxFileSize(value: number | undefined) {
    if (!value) return;

    this._maxFileSize = value;
  }

  @Input()
  public multiple = false;

  @Input()
  public loading = false;

  @Input()
  public set fileStatus(updatedFileStatus: Map<string, FileStatus>) {
    let isProcessing = false;

    for (const file of updatedFileStatus.values()) {
      let status = '';
      isProcessing = isProcessing || file.isProcessing;

      if (file.isUploading) {
        status = NUVERIAL_FILE_UPLOAD_STATUS.pending;
      } else if (file.isProcessing) {
        status = NUVERIAL_FILE_UPLOAD_STATUS.processing;
      } else {
        status = file.processingStatus.failed ? NUVERIAL_FILE_UPLOAD_STATUS.failure : NUVERIAL_FILE_UPLOAD_STATUS.success;
      }

      const isLoading = file.isLoading || this.filePreview.get(file.name) === undefined;

      updatedFileStatus.set(file.name, { ...file, isLoading, progressWidth: `${file.uploadProgress}%`, status, statusMessage: this.getStatusMessage(status) });
    }

    this.isProcessing = isProcessing;
    this._fileStatus = updatedFileStatus;
  }

  public get fileStatus(): Map<string, FileStatus> {
    return this._fileStatus;
  }

  @Input()
  public set filePreview(updatedFilePreview: Map<string, File>) {
    this._filePreview = updatedFilePreview;
    this.setExistingFiles();
  }

  public get filePreview(): Map<string, File> {
    return this._filePreview;
  }

  @Output()
  public readonly uploadDocument = new EventEmitter<File>();

  @Output()
  public readonly removeDocument = new EventEmitter<string>();

  @ViewChild('fileInput', { static: false }) public fileInput!: ElementRef<HTMLInputElement>;

  public fileUploadControl!: FileUploadControl;
  public imageError = false;
  public statusOptions = NUVERIAL_FILE_UPLOAD_STATUS;
  public isProcessing = false;

  public get showUploadPlaceholder() {
    return this.multiple === true || !this.fileStatus.size;
  }

  public get fileList() {
    return Array.from(this.fileStatus.values());
  }

  public get maxFileSizeBytes() {
    return this.maxFileSize * 1024 * 1024;
  }

  public get isMobile() {
    return this._deviceService.isMobile();
  }

  public get showSingleFileStatusBar(): boolean {
    const file = this.fileStatus.values().next().value;
    if (!file || this.multiple) return false;

    return file.status !== NUVERIAL_FILE_UPLOAD_STATUS.initial && file.status !== NUVERIAL_FILE_UPLOAD_STATUS.pending;
  }

  public get singleFileStatus(): string {
    const file = this.fileStatus.values().next().value;
    if (!file) return '';

    return file.status;
  }

  public get singleFileProgressWidth(): string {
    const file = this.fileStatus.values().next().value;
    if (!file) return '0%';

    return file.progressWidth || '0%';
  }

  public get singleFileStatusMessage(): string {
    const file = this.fileStatus.values().next().value;
    if (!file) return '';

    return file.statusMessage;
  }

  public get singleFileProcessors(): ITooltipProcessingResult[] {
    const file = this.fileStatus.values().next().value;
    if (!file) return [];

    return file.processingStatus.processors;
  }

  public get showOverlayBackground(): boolean {
    const file = this.fileStatus.values().next().value;
    if (!file || this.multiple) return false;

    const isNotFailed =
      file.status === this.statusOptions.success || file.status === this.statusOptions.pending || file.status === this.statusOptions.processing;

    return this.imageError || isNotFailed;
  }

  public get showPending(): boolean {
    const file = this.fileStatus.values().next().value;
    if (!file || this.multiple) return false;

    return file.status === this.statusOptions.pending;
  }

  public readonly singleFilePreview$: Observable<unknown> = this._singleFilePreview.asObservable();

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _elementRef: ElementRef,
    protected readonly _focusMonitor: FocusMonitor,
    private readonly _deviceService: DeviceDetectorService,
    @Inject(Injector) protected override readonly _injector: Injector,
    @Self() @Optional() protected override readonly _ngControl: NgControl,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.formControl = this._modelFormControl();

    const showList = !this.multiple;
    this.fileUploadControl = new FileUploadControl(this.maxFileSizeBytes, showList, this.multiple);

    this.fileUploadControl.valueChanges$
      .pipe(
        tap((files: File[]) => {
          if (files.length > 0) {
            for (const file of files) {
              if (this.fileStatus.has(file.name)) continue;

              if (this.isFileSizeError()) {
                this.setFormControlFileSizeError();
              } else {
                this.imageError = false;
                this.formControl?.setErrors(null);
                this.uploadFile(file);
                this._changeDetectorRef.markForCheck();
              }
            }
          }
        }),
      )
      .subscribe();

    // Mark file as processing when it's added to formControl (uploaded)
    this.formControl.valueChanges
      .pipe(
        tap(obj => {
          if (!obj) return;

          const name = obj.filename;
          const fileEntry = this.fileStatus.get(name);

          if (fileEntry) {
            const status = this.statusOptions.processing;
            const statusMessage = this.getStatusMessage(status);
            this.fileStatus.set(name, { ...fileEntry, status, statusMessage });
          }

          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this),
      )
      .subscribe();

    this._initErrorHandler(this._focusMonitor.monitor(this._elementRef, true).pipe(filter(origin => origin === null)));
  }

  public getStatusMessage(status: string): string {
    switch (status) {
      case NUVERIAL_FILE_UPLOAD_STATUS.success:
        return 'Successful Upload';

      case NUVERIAL_FILE_UPLOAD_STATUS.pending:
        return '';

      case NUVERIAL_FILE_UPLOAD_STATUS.processing:
        return 'Analyzing your upload to ensure it meets requirements';

      case NUVERIAL_FILE_UPLOAD_STATUS.initial:
        return '';

      case NUVERIAL_FILE_UPLOAD_STATUS.failure:
        return 'Document issues detected';

      default:
        return '';
    }
  }

  public setExistingFiles() {
    if (!this.filePreview.size) return;

    for (const file of this.filePreview.values()) {
      this.fileUploadControl?.addFile(file);

      if (!this.multiple) this._setImagePreview(file);
    }
  }

  public setFormControlFileSizeError() {
    this.formControl.setErrors({ fileSize: true });
  }

  public uploadFile(file: File): void {
    this.imageError = false;
    this.uploadDocument.emit(file);
    if (!this.multiple) this._setImagePreview(file);
  }

  public handleFileSelection(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    event.stopPropagation();
    if (!fileInput || !fileInput.files) {
      return;
    }

    this.fileUploadControl?.addFiles(Array.from(fileInput.files)); // use addFiles to prevent valueChanges from triggering more than once
    fileInput.value = ''; // reset file input so change event is fired for files of same name
  }

  public stopUpload(name: string): void {
    if (!name) return;

    this.fileUploadControl.removeFile(name);

    this.removeDocument.emit(name);
    this.fileInput.nativeElement.value = '';
  }

  public downloadFile(name: string): void {
    const file = this.filePreview.get(name);
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileUrl);
  }

  private _setImagePreview(file: File): void {
    if (!FileReader || file.size === 0) return;

    const fr = new FileReader();
    fr.onload = (e: ProgressEvent<FileReader>) => {
      this._singleFilePreview.next(e.target?.result);
      this._changeDetectorRef.markForCheck();
    };

    fr.readAsDataURL(file);
  }

  public handleFileBrowserOpen(event: Event): void {
    // Only stop file upload when restricted to single files
    if (!this.multiple && this.fileUploadControl.size) {
      const currentFileName = this.fileUploadControl.value[0].name;
      this.stopUpload(currentFileName);
    }

    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  public isFileSizeError(): boolean {
    const errors = this.fileUploadControl.getErrors();

    return errors.length > 0 && errors.some((error: FileValidationErrors) => Object.prototype.hasOwnProperty.call(error.errors, 'fileSize'));
  }

  public removeFile(name: string): void {
    this.fileUploadControl.removeFile(name);

    this.removeDocument.emit(name);

    this._changeDetectorRef.detectChanges();
  }

  protected override _initErrorHandler(events: Observable<unknown>): void {
    this.error$ = combineLatest([
      events.pipe(startWith(null)),
      this.formControl?.statusChanges.pipe(
        filter(status => !!status),
        startWith(null),
      ),
      this.formControl?.valueChanges.pipe(
        filter(value => !!value),
        startWith(null),
      ),
    ]).pipe(
      filter(([event, _status]) => event === null),
      map(([_event, _status, _value]) => {
        const fileSizeError = this.validateFileSizeError();
        const errors = fileSizeError || this.validateRequired();

        return (
          errors &&
          Object.keys(errors).map(key => ({
            [key]: this._validationMessage(key, this.validationMessages),
          }))
        );
      }),
      tap(errors => errors && this.validationErrors.emit(errors)),
      map(errors => (errors ? Object.keys(errors[0]).map(key => errors[0][key])[0] : '')),
    );
  }

  public validateFileSizeError(): ValidationErrors | undefined {
    if (this.formControl?.hasError('fileSize')) {
      return { fileSize: true };
    }

    return undefined;
  }

  public validateRequired(): ValidationErrors | undefined {
    if (!this.formControl?.hasError('required')) {
      return undefined;
    } else if (this.formControl.touched && this._isFormEmpty()) {
      return { required: true };
    }

    return undefined;
  }

  private _isFormEmpty(): boolean {
    return !this.formControl.value || (Array.isArray(this.formControl.value) && !this.formControl.value.length);
  }

  public dropHandler(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;

    if (!files || this._isNullOrEmpty(files)) return;

    if (!this.multiple && this.fileUploadControl.size) {
      const currentFileName = this.fileUploadControl.value[0].name;
      this.stopUpload(currentFileName);
    }

    this.fileUploadControl.addFiles(Array.from(files));
  }

  private _isNullOrEmpty(fileList: FileList): boolean {
    const files = Array.from(fileList);

    return !files || !files.length || files.reduce((acc, file) => acc || !file.size, false);
  }

  public dragOverHandler(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
