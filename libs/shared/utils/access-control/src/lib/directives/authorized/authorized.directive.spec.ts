import { TemplateRef } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { createMock } from '@testing-library/angular/jest-utils';
import { ReplaySubject, Subject } from 'rxjs';
import { AccessControlService } from '../../services/access-control.service';
import { AuthorizedDirective } from './authorized.directive';

describe('AuthorizedDirective', () => {
  let isAuthorized$: Subject<boolean>;

  function renderDirective() {
    const accessControlService = createMock(AccessControlService);

    isAuthorized$ = new ReplaySubject(1);
    accessControlService.isAuthorized$.mockReturnValue(isAuthorized$);

    return render(
      `<div *dsgAuthorized="test-capability" data-testid="renderedDiv">
      Feature
      </div>`,
      {
        declarations: [AuthorizedDirective],
        providers: [
          { provide: AccessControlService, useValue: accessControlService },
          { provide: TemplateRef, useValue: {} },
        ],
      },
    );
  }

  it('when capability is disabled it should not show the div', async () => {
    const { fixture } = await renderDirective();

    isAuthorized$.next(false);

    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).not.toBeInTheDocument();
    expect(screen.queryByText('Feature')).not.toBeInTheDocument();
  });

  it('when capability is enabled it should show the div', async () => {
    const { fixture } = await renderDirective();

    isAuthorized$.next(true);
    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).toBeInTheDocument();
    expect(screen.queryByText('Feature')).toBeInTheDocument();
  });

  it('when capability is toggling, it should change the view', async () => {
    const { fixture } = await renderDirective();

    isAuthorized$.next(true);
    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).toBeInTheDocument();
    expect(screen.queryByText('Feature')).toBeInTheDocument();

    isAuthorized$.next(false);

    fixture.detectChanges();

    expect(screen.queryByTestId('renderedDiv')).not.toBeInTheDocument();
    expect(screen.queryByText('Feature')).not.toBeInTheDocument();
  });
});
