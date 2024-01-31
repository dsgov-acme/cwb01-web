import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NuverialIconComponent } from '../icon';
import { ITooltipProcessingResult } from './file-processor-tooltip.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, OverlayModule, NuverialIconComponent],
  selector: 'nuverial-file-processor-tooltip',
  standalone: true,
  styleUrls: ['./file-processor-tooltip.component.scss'],
  templateUrl: './file-processor-tooltip.component.html',
})
export class NuverialFileProcessorTooltipComponent {
  @Input() public processors?: ITooltipProcessingResult[];

  public isTooltipOpen = false;

  public trackByFn(index: number) {
    return index;
  }
}
