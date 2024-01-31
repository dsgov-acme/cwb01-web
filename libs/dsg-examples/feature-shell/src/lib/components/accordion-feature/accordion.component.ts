import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  INuverialPanel,
  NuverialAccordionComponent,
  NuverialButtonComponent,
  NuverialContentDirective,
  NuverialFooterComponent,
  NuverialRadioCardComponent,
  NuverialSectionHeaderComponent,
} from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NuverialAccordionComponent,
    NuverialButtonComponent,
    NuverialSectionHeaderComponent,
    NuverialFooterComponent,
    CommonModule,
    NuverialRadioCardComponent,
    NuverialContentDirective,
  ],
  selector: 'dsg-examples-accordion',
  standalone: true,
  styleUrls: ['./accordion.component.scss'],
  templateUrl: './accordion.component.html',
})
export class ExampleAccordionComponent {
  public checkboxHeader = 'Lorem Ipsum dolor';
  public checkboxContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit.';
  public firstAccordion = {
    buttonLabel: 'Confirm',
    content: 'This is the content for the first accordion panel',
    footer: 'Panel Footer',
  };

  public secondAccordion = {
    buttonLabel: 'Confirm',
    content: 'This is the content for the first accordion panel',
    footer: 'Panel Footer',
  };
  public firstPanelList?: INuverialPanel[] = [
    {
      disabled: false,
      panelTitle: 'First Panel Example',
    },
    {
      disabled: false,
      panelDescription: 'A brief description',
      panelTitle: 'Second Panel Example',
    },
    {
      disabled: true,
      panelTitle: 'Third Example Disabled',
    },
  ];

  public secondPanelList?: INuverialPanel[] = [
    {
      disabled: false,
      panelContent: 'Regular Panel Content in the an accordion here is some lorem ipsum...Lorem Ipsum dolor sit amet consectetur adipiscing elit',
      panelTitle: 'First Panel Example',
    },
    {
      disabled: false,
      panelContent:
        'Second example of some panel content along with some lorem ipsum...Lorem Ipsum dolor sit amet consectetur adipiscing elit sit amet consectetur adipiscing elit',
      panelDescription: 'A brief description',
      panelTitle: 'Second Panel Example',
    },
  ];
}
