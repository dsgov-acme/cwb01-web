import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuverialButtonComponent, NuverialCardComponent } from '@dsg/shared/ui/nuverial';
import { AuthenticationProviderActions } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialButtonComponent, NuverialCardComponent],
  selector: 'dsg-authentication-status',
  standalone: true,
  styleUrls: ['./authentication-status.component.scss'],
  templateUrl: './authentication-status.component.html',
})
export class AuthenticationStatusComponent {
  @Input() public authenticationProvider!: AuthenticationProviderActions;
  @Input() public title = '';
  @Input() public subTitle = '';
  @Input() public message = '';
  @Input() public linkText!: string | null;

  @Output() public readonly statusClose: EventEmitter<void> = new EventEmitter<void>();
}
