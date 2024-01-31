import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'nuverial-footer',
  standalone: true,
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export class NuverialFooterComponent {}
