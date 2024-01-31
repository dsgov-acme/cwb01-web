import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialFormFieldErrorComponent, NuverialIconComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NuverialIconComponent, NuverialFormFieldErrorComponent],
  selector: 'dsg-examples-form-field-error',
  standalone: true,
  styleUrls: ['./form-field-error.component.scss'],
  templateUrl: './form-field-error.component.html',
})
export class ExampleFormFieldErrorComponent {
  public formErrorContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit';
}
