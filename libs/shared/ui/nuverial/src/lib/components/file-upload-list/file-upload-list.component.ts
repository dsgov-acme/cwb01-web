import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NUVERIAL_FILE_UPLOAD_STATUS } from '../../models';
import { NuverialDividerComponent } from '../divider/divider.component';
import { NuverialFileProcessorTooltipComponent } from '../file-processor-tooltip/file-processor-tooltip.component';
import { FileStatus } from '../file-upload/file-upload.component';
import { NuverialIconComponent } from '../icon/icon.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialIconComponent, NuverialFileProcessorTooltipComponent, NuverialDividerComponent],
  selector: 'nuverial-file-upload-list',
  standalone: true,
  styleUrls: ['./file-upload-list.component.scss'],
  templateUrl: './file-upload-list.component.html',
})
export class FileUploadListComponent {
  @Input()
  public fileList: FileStatus[] = [];

  @Input()
  public mobile = false;

  @Output()
  public readonly removeFile = new EventEmitter<string>();

  @Output()
  public readonly stopUpload = new EventEmitter<string>();

  @Output()
  public readonly downloadFile = new EventEmitter<string>();

  public statusOptions = NUVERIAL_FILE_UPLOAD_STATUS;

  public onDownloadFile(name: string): void {
    this.downloadFile.emit(name);
  }

  public onStopUpload(name: string): void {
    this.stopUpload.emit(name);
  }

  public onRemoveFile(name: string): void {
    this.removeFile.emit(name);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
