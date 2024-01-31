import { TemplateRef } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { createMock } from '@testing-library/angular/jest-utils';
import { ReplaySubject, Subject } from 'rxjs';
import { FeatureFlagService } from '../feature-flag.service';
import { FeatureFlagDisabledDirective } from './feature-flag-disabled.directive';

describe('FeatureFlagDisabledDirective', () => {
  let isFeatureFlagEnabled$: Subject<boolean>;

  function renderDirective() {
    const featureFlagService = createMock(FeatureFlagService);

    isFeatureFlagEnabled$ = new ReplaySubject(1);
    featureFlagService.isFeatureFlagEnabled$.mockReturnValue(isFeatureFlagEnabled$);

    return render(
      `<div *dsgFeatureFlagDisabled="some-flag" data-testid="renderedDiv">
      Feature
    </div>`,
      {
        declarations: [FeatureFlagDisabledDirective],
        providers: [
          { provide: FeatureFlagService, useValue: featureFlagService },
          { provide: TemplateRef, useValue: {} },
        ],
      },
    );
  }

  it('when flag is disabled it should show the div', async () => {
    const { fixture } = await renderDirective();

    isFeatureFlagEnabled$.next(false);

    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).toBeInTheDocument();
    expect(screen.queryByText('Feature')).toBeInTheDocument();
  });

  it('when flag is enabled it should not show the div', async () => {
    const { fixture } = await renderDirective();

    isFeatureFlagEnabled$.next(true);
    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).not.toBeInTheDocument();
    expect(screen.queryByText('Feature')).not.toBeInTheDocument();
  });

  it('when flag is toggling, it should change the view', async () => {
    const { fixture } = await renderDirective();

    isFeatureFlagEnabled$.next(true);
    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).not.toBeInTheDocument();
    expect(screen.queryByText('Feature')).not.toBeInTheDocument();

    isFeatureFlagEnabled$.next(false);

    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).toBeInTheDocument();
    expect(screen.queryByText('Feature')).toBeInTheDocument();
  });
});
