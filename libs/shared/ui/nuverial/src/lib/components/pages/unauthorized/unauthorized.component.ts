import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCardComponent } from '../../card';
import { NuverialIconComponent } from '../../icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialCardComponent, NuverialIconComponent],
  selector: 'nuverial-unauthorized',
  standalone: true,
  styleUrls: ['./unauthorized.component.scss'],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {}
