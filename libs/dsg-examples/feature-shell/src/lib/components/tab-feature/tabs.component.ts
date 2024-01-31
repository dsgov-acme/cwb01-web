import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  INuverialTab,
  NuverialContentDirective,
  NuverialSectionHeaderComponent,
  NuverialTabKeyDirective,
  NuverialTabsComponent,
} from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTabsComponent, NuverialSectionHeaderComponent, NuverialTabKeyDirective, NuverialContentDirective],
  selector: 'dsg-examples-tabs',
  standalone: true,
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
})
export class ExampleTabsComponent {
  public tabs: INuverialTab[] = [
    { key: 'formio', label: 'FormIO' },
    { key: 'formly', label: 'Formly' },
    { key: 'formioJson', label: 'FormIO JSON' },
    { disabled: true, key: 'formlyJosn', label: 'Formly JSON' },
  ];
}
