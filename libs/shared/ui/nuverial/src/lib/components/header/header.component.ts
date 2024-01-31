import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialButtonComponent, NuverialIconComponent],
  selector: 'nuverial-header',
  standalone: true,
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class NuverialHeaderComponent {
  @Output() public readonly logout: EventEmitter<void> = new EventEmitter<void>();
}
