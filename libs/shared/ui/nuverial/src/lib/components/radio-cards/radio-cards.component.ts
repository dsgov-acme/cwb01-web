import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormInputBaseDirective } from '../../common';
import { NuverialCardCommonComponent } from '../../directives';
import { NuverialCardGroupComponent } from '../card-group/card-group.component';
import { NuverialIconComponent } from '../icon';
import { NuverialRadioCardComponent } from '../radio-card/radio-card.component';
import { INuverialRadioCard } from './radio-cards.model';

/**
 * Cards is a component that groups radioCards or checkCards components, to facilitate their inclusion in forms and to unify values
 *
 * ## Usage
 *
 * ```
 * import { NuverialRadioCardsComponent, INuverialRadioCard } from '@dsg/shared/ui/nuverial';
 *
 * public radioCards: INuverialRadioCard[] = [
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
 *
 * <nuverial-radio-cards [legend]="'this is a legend'" [formControl]="radioControl" [radioCards]="radioCards" />
 *
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatRadioModule, NuverialIconComponent, NuverialCardGroupComponent, NuverialRadioCardComponent],
  providers: [{ provide: NuverialCardCommonComponent, useExisting: forwardRef(() => NuverialRadioCardsComponent) }],
  selector: 'nuverial-radio-cards',
  standalone: true,
  styleUrls: ['./radio-cards.component.scss'],
  templateUrl: './radio-cards.component.html',
})
export class NuverialRadioCardsComponent extends FormInputBaseDirective {
  /**
   * Card is required indicator
   */
  @Input() public required = false;

  @Input() public legend: string | undefined;
  @Input() public radioCards!: INuverialRadioCard[];
  @Input() public columns? = 2;
  @Input() public groupName!: string;
  constructor() {
    super();
  }

  public trackByFn(_index: number, option: INuverialRadioCard) {
    return option.title;
  }
}
