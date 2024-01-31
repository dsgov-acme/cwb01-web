import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggingService } from '@dsg/shared/utils/logging';
import { screen } from '@testing-library/angular';
import { MockProvider } from 'ng-mocks';
import { FooterAction, NuverialFooterActionsComponent } from './footer-actions.component';

describe('NuverialFooterActionsComponent', () => {
  let component: NuverialFooterActionsComponent;
  let fixture: ComponentFixture<NuverialFooterActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuverialFooterActionsComponent],
      providers: [MockProvider(LoggingService)],
    })
      .overrideComponent(NuverialFooterActionsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NuverialFooterActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep buttonActionList and menuActionList as empty array when footerActions is empty', () => {
    component.footerActions = [];
    fixture.detectChanges();

    expect(component.buttonActionsList).toStrictEqual([]);
    expect(component.menuActionsList).toStrictEqual([]);
  });

  it('should reverse the order of the available actions when there are 3 actions or less', () => {
    const actions: FooterAction[] = [
      {
        key: 'primary',
        uiClass: 'Primary',
        uiLabel: 'Label primary',
      },
      {
        key: 'secondary',
        uiClass: 'Secondary',
        uiLabel: 'Label secondary',
      },
      {
        key: 'adverse',
        uiClass: 'Adverse',
        uiLabel: 'Label adverse',
      },
    ];

    component.footerActions = actions;
    fixture.detectChanges();

    const nuverialButtons = screen.getAllByTestId(/^action-button-/);
    const buttonText1 = nuverialButtons[0].querySelector('button')?.textContent;
    const buttonText2 = nuverialButtons[1].querySelector('button')?.textContent;
    const buttonText3 = nuverialButtons[2].querySelector('button')?.textContent;
    const menuActionList = screen.queryByTestId('menu-action-list');

    if (!buttonText1 || !buttonText2 || !buttonText3) {
      expect(false).toBeTruthy();

      return;
    }

    expect(buttonText1).toBe(' Label adverse ');
    expect(buttonText2).toBe(' Label secondary ');
    expect(buttonText3).toBe(' Label primary ');
    expect(menuActionList).not.toBeInTheDocument();
  });

  it('should swap the 2 first action buttons when there are more than 3 actions and the menu action list should be present', () => {
    const actions: FooterAction[] = [
      {
        key: 'Approve',
        uiClass: 'Primary',
        uiLabel: 'Approve',
      },
      {
        key: 'Deny',
        uiClass: 'Secondary',
        uiLabel: 'Deny',
      },
      {
        key: 'RequestChanges',
        uiClass: 'Secondary',
        uiLabel: 'Request Changes',
      },
      {
        key: 'Submit',
        uiClass: 'Primary',
        uiLabel: 'Re-submit',
      },
    ];
    component.footerActions = actions;
    fixture.detectChanges();

    const nuverialButtons = screen.getAllByTestId(/^action-button-/);
    const buttonText1 = nuverialButtons[0].querySelector('button')?.textContent;
    const buttonText2 = nuverialButtons[1].querySelector('button')?.textContent;

    const menuActionList = screen.getByTestId('menu-action-list');

    if (!buttonText1 || !buttonText2) {
      expect(false).toBeTruthy();

      return;
    }

    expect(buttonText1).toBe(' Deny ');
    expect(buttonText2).toBe(' Approve ');
    expect(menuActionList).toBeInTheDocument();
  });

  it('should emit the actionSelected event with the correct value', () => {
    const action = 'primary';

    const spy = jest.spyOn(component.actionSelected, 'emit');

    component.onActionClick(action);

    expect(spy).toHaveBeenCalledWith(action);
  });
});
