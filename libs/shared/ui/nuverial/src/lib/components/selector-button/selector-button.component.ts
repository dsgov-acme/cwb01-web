import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { INuverialTab } from '../tabs';

/**
 * A Pill Selector Button component
 *
 * ## Usage
 *
 * ```
 * import { NuverialSelectorButtonComponent } from '@dsg/shared/ui/nuverial';
 *   <nuverial-selector-button [tabs]="selectorTabs" (selectEvent)="onSelectEvent($event)">
 *   </nuverial-selector-button>
 * ```
 */

@Component({
  animations: [
    trigger('thumbTranslate', [
      state('right', style({ transform: 'translateX({{shiftPosition}}px)' }), { params: { shiftPosition: 0 } }),
      transition('* <=> right', [animate('0.1s')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor],
  selector: 'nuverial-selector-button',
  standalone: true,
  styleUrls: ['./selector-button.component.scss'],
  templateUrl: './selector-button.component.html',
})
export class NuverialSelectorButtonComponent implements AfterViewInit {
  constructor(private readonly _cdr: ChangeDetectorRef) {}
  /**
   * Passing in an array of INuverialTab objects, the label key will be displayed in a row inside the pill container
   */
  @Input() public tabs!: INuverialTab[];
  /**
   * Click event on selecting a label which will emit the key of the selected label
   */
  @Output()
  public readonly selectEvent = new EventEmitter<string>();
  @ViewChildren('tabButton') public buttons!: QueryList<ElementRef>;
  public selectedTabKey = '';
  public buttonWidths: number[] = [];
  public shiftPosition = 0;
  public thumbWidth = '';

  public ngAfterViewInit(): void {
    if (this.tabs && this.tabs.length > 0) {
      this.selectedTabKey = this.tabs[0].key;
      this.buttonWidths = this.buttons.map(button => button.nativeElement.offsetWidth);
      this._updateThumbStyles();
      this._cdr.detectChanges();
    }
  }

  public onSelect(key: string): void {
    this.selectedTabKey = key;
    this._updateThumbStyles();
    this.selectEvent.emit(key);
  }

  public trackByFn(index: number): number {
    return index;
  }

  private _updateThumbStyles(): void {
    const index = this.tabs.findIndex(tab => tab.key === this.selectedTabKey);
    this.thumbWidth = `${this.buttonWidths[index]}px`;
    this.shiftPosition = this.buttonWidths.slice(0, index).reduce((acc, width) => acc + width, 0);
    this._cdr.detectChanges();
  }
}
