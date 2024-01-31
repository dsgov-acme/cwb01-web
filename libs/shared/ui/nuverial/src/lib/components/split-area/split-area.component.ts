import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AngularSplitModule, IOutputData, SplitComponent } from 'angular-split';
import { tap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AngularSplitModule],
  selector: 'nuverial-split-area',
  standalone: true,
  styleUrls: ['./split-area.component.scss'],
  templateUrl: './split-area.component.html',
})

/**
 * A split area component wrapper
 *
 * ## Usage
 *
 * ```
 *   import { NuverialSplitAreaComponent } from '@dsg/shared/ui/nuverial';
 *
 *   <nuverial-split-area
 *                 [area2InitialSize]="area2InitialSize"
                   [area2MinWidth]="150"
                   (splitDragging)="onSplitDrag($event)"></nuverial-split-area>

    [area2InitialSize]: Determines the initial start size of the second split area.
    [area2minWidth]: Determines the minimum width of the second split area.
    (splitDragging): Event emitter for when the split area is being dragged.

    Public functions:
    setArea2Width(width: number): Sets the width of the second split area. 
                                  This can be used to close or open a split area programmatically.
 * ```
 */
export class NuverialSplitAreaComponent implements AfterViewInit {
  @ViewChild('split') private readonly _split!: SplitComponent;

  @Input() public area2MinWidth = 150;

  @Input() public area2InitialSize = 800;

  @Output() public readonly splitDragging = new EventEmitter<IOutputData>();

  public loading = true;
  public splitAreaSizes = {
    area1: null,
    area2: 0,
  };

  constructor(private readonly _cdr: ChangeDetectorRef) {}

  public setArea2Width(width: number): void {
    this.splitAreaSizes.area2 = width;
  }

  public ngAfterViewInit(): void {
    this.splitAreaSizes.area2 = this.area2InitialSize;
    this._cdr.detectChanges();

    this._split.dragProgress$
      .pipe(
        tap(value => {
          this.splitDragging.emit(value);
        }),
      )
      .subscribe();
  }
}
