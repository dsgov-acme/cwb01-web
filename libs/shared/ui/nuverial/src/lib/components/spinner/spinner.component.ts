import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/***
 * A loading spinner
 *
 * ## Usage
 *
 * ```
 * import { NuverialSpinnerComponent } from '@dsg/shared/ui/nuverial';
 *   <nuverial-spinner></nuverial-spinner>
 * ```
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'nuverial-spinner',
  standalone: true,
  styleUrls: ['./spinner.component.scss'],
  templateUrl: './spinner.component.html',
})
export class NuverialSpinnerComponent implements OnInit, OnDestroy {
  @HostBinding('class') @Input() public style: 'app-spinner' | 'other' = 'app-spinner';
  @HostBinding('class.position-fixed')
  @Input()
  public overlay = true;

  constructor(private readonly _renderer: Renderer2) {}

  @Input() public ariaLabel?: 'Loading' | `Progress: ${number}%` = 'Loading';
  @Input() public mode: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() public value?: number;

  public ngOnInit(): void {
    if (this.overlay) {
      this._renderer.setStyle(document.body, 'margin', '0');
      this._renderer.setStyle(document.body, 'height', '100%');
      this._renderer.setStyle(document.body, 'width', '100%');
      this._renderer.setStyle(document.body, 'overflow', 'hidden');
    }
  }

  public ngOnDestroy(): void {
    if (this.overlay) {
      this._renderer.removeStyle(document.body, 'margin');
      this._renderer.removeStyle(document.body, 'height');
      this._renderer.removeStyle(document.body, 'width');
      this._renderer.removeStyle(document.body, 'overflow');
    }
  }
}
