import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NuverialButtonComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NuverialButtonComponent],
  selector: 'dsg-examples-sidebar',
  standalone: true,
  styleUrls: ['./examples-sidebar.component.scss'],
  templateUrl: './examples-sidebar.component.html',
})
export class ExampleSidebarComponent {}
