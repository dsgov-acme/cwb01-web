import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NuverialFileUploadComponent } from '@dsg/shared/ui/nuverial';
import { Subject, Subscription, interval, take, takeUntil, tap } from 'rxjs';
import { MockDocumentApiRoutesService } from './document-service-mock.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialFileUploadComponent],
  selector: 'dsg-examples-file-upload',
  standalone: true,
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})
export class ExampleFileUploadComponent {
  constructor(private readonly _documentManagerService: MockDocumentApiRoutesService, protected readonly _changeDetectorRef: ChangeDetectorRef) {}

  public uploadProgressFront = 0;
  public uploadProgressBack = 0;
  private readonly _cancelUploadFront$ = new Subject<void>();
  private readonly _cancelUploadBack$ = new Subject<void>();
  private _uploadSubFront?: Subscription;
  private _uploadSubBack?: Subscription;

  public onUploadDocumentFront(file: File) {
    this.uploadProgressFront = 0;
    const uploadInterval$ = interval(500); // Adjust the interval duration as needed
    this._uploadSubFront = uploadInterval$
      .pipe(
        tap(_ => {
          this.uploadProgressFront += 10;
          this._changeDetectorRef.detectChanges();
          if (this.uploadProgressFront === 100) {
            this._uploadFile(file);
            this._uploadSubFront?.unsubscribe();
          }
        }),
        takeUntil(this._cancelUploadFront$),
      )
      .subscribe();
  }

  public onUploadDocumentBack(file: File) {
    this.uploadProgressBack = 0;
    const uploadInterval$ = interval(500); // Adjust the interval duration as needed
    this._uploadSubBack = uploadInterval$
      .pipe(
        tap(_ => {
          this.uploadProgressBack += 10;
          this._changeDetectorRef.detectChanges();
          if (this.uploadProgressBack === 100) {
            this._uploadFile(file);
            this._uploadSubBack?.unsubscribe();
          }
        }),
        takeUntil(this._cancelUploadBack$),
      )
      .subscribe();
  }

  private _uploadFile(file: File) {
    this._documentManagerService
      .uploadDocument$(file)
      .pipe(
        take(1),
        tap(doc => {
          // eslint-disable-next-line no-console
          console.log('Uploaded document Id: ', doc.documentId);
        }),
      )
      .subscribe();
  }

  public onCancelFrontUpload() {
    this._cancelUploadFront$.next();
  }

  public onCancelBackUpload() {
    this._cancelUploadBack$.next();
  }
}
