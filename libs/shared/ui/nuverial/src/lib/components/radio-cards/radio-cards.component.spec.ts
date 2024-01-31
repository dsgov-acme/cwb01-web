import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialCardCommonComponent } from '../../directives';
import { NuverialCardGroupComponent } from '../card-group';
import { NuverialIconComponent } from '../icon';
import { NuverialRadioCardComponent } from '../radio-card/radio-card.component';
import { NuverialRadioCardsComponent } from './radio-cards.component';
import { INuverialRadioCard } from './radio-cards.model';

const dependencies = MockBuilder(NuverialRadioCardsComponent)
  .keep(MatRadioModule)
  .keep(MatFormFieldModule)
  .keep(NuverialIconComponent)
  .keep(NuverialRadioCardComponent)
  .keep(NuverialCardCommonComponent)
  .mock(NuverialCardGroupComponent)
  .build();

const RADIO_CARDS: INuverialRadioCard[] = [
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

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialRadioCardsComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('RadioCardsComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({
        componentProperties: {
          formControl: new FormControl(undefined),
          radioCards: RADIO_CARDS,
        },
      });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can define a default (empty) radio cards component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
  });

  it('should set aria-labels on radios as radio title', async () => {
    const { fixture } = await getFixture({
      componentProperties: {
        formControl: new FormControl(undefined),
        radioCards: RADIO_CARDS,
      },
    });
    const radios = fixture.nativeElement.querySelectorAll('mat-radio-button input');
    const radiosAriaLabel = Array.from(radios).map(radio => (radio as HTMLElement).getAttribute('aria-label'));

    expect(radiosAriaLabel).toEqual(RADIO_CARDS.map(card => card.title));
  });

  it('should track the radio cards by title', async () => {
    const { fixture } = await getFixture({});

    const results = fixture.componentInstance.trackByFn(0, RADIO_CARDS[0]);

    expect(results).toEqual(RADIO_CARDS[0].title);
  });
});
