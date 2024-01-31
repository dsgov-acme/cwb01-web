import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NuverialContentDirective,
  CardChange,
  NuverialRadioCardComponent,
  NuverialFormFieldErrorComponent,
  NuverialValidationErrorType,
} from '@dsg/shared/ui/nuverial';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatFormFieldModule, NuverialContentDirective, NuverialRadioCardComponent, NuverialFormFieldErrorComponent],
  selector: 'dsg-examples-radio-card',
  standalone: true,
  styleUrls: ['./radio-card.component.scss'],
  templateUrl: './radio-card.component.html',
})
export class ExampleRadioCardComponent {
  public checkboxHeader = 'Lorem Ipsum dolor';
  public checkboxContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit.';
  public formErrorContent = 'Lorem Ipsum dolor sit amet consectetur adipiscing elit';

  public onCardChange(_event: CardChange): void {
    // for debug purposes
  }
  public onValidationErrors(_event: NuverialValidationErrorType[]): void {
    // for debug purposes
  }
}
