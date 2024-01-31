import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'nuverial-pill',
  standalone: true,
  styleUrls: ['./pill.component.scss'],
  templateUrl: './pill.component.html',
})
export class NuverialPillComponent {}
