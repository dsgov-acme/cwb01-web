import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { NuverialDividerComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, NuverialDividerComponent],
  selector: 'dsg-examples-divider',
  standalone: true,
  styleUrls: ['./divider.component.scss'],
  templateUrl: './divider.component.html',
})
export class ExampleDividerComponent {}
