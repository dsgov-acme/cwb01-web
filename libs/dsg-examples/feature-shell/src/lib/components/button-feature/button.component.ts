import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialButtonComponent, NuverialIconComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NuverialButtonComponent, NuverialIconComponent],
  selector: 'dsg-examples-button',
  standalone: true,
  styleUrls: ['./button.component.scss'],
  templateUrl: './button.component.html',
})
export class ExampleButtonComponent {}
