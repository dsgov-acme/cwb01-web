import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialCardComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NuverialCardComponent],
  selector: 'dsg-examples-card',
  standalone: true,
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
})
export class ExampleCardComponent {
  public cardContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit';
  public cardFooter = 'Lorem Ipsum dolor';
  public cardTitle = 'Lorem Ipsum dolor';
}
