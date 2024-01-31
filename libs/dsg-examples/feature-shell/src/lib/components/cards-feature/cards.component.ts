import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { INuverialRadioCard, NuverialContentDirective, NuverialFormFieldErrorComponent, NuverialRadioCardsComponent } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatFormFieldModule, NuverialContentDirective, NuverialRadioCardsComponent, NuverialFormFieldErrorComponent],
  selector: 'dsg-examples-cards',
  standalone: true,
  styleUrls: ['./cards.component.scss'],
  templateUrl: './cards.component.html',
})
export class ExampleRadioCardsComponent {
  public checkboxHeader = 'Lorem Ipsum dolor';
  public checkboxContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit.';
  public formErrorContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit';

  public radioControl = new FormControl({ disabled: false, value: null }, [Validators.required]);

  public radioCards: INuverialRadioCard[] = [
    {
      imageAltLabel: 'imageAltLabel',
      imagePath: '/assets/images/child-performer.jpg',
      imagePosition: 'before',
      title: 'Yes',
      value: 'yes',
    },
    {
      imageAltLabel: 'imageAltLabel',
      imagePath: '/assets/images/child-performer.jpg',
      imagePosition: 'top',
      title: 'No',
      value: 'no',
    },
    {
      title: 'Maybe',
      value: 'maybe',
    },
  ];
}
