import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { NuverialSectionHeaderComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, NuverialSectionHeaderComponent],
  selector: 'dsg-examples-section-header',
  standalone: true,
  styleUrls: ['./section-header.component.scss'],
  templateUrl: './section-header.component.html',
})
export class ExampleSectionHeaderComponent {}
