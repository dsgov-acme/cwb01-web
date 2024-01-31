import { CommonModule } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { INuverialPanel } from '../../models';
import { NuverialAccordionComponent } from './accordion.component';

const dependencies = MockBuilder(NuverialAccordionComponent).keep(MatAccordion).keep(CommonModule).build();

const PANEL_LIST: INuverialPanel[] = [
  {
    disabled: false,
    panelContent: 'test content',
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

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialAccordionComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

describe('AccordionComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations when ariaLabel is set', async () => {
      const { fixture } = await getFixture({ componentProperties: { ariaLabel: 'data panel' } });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });
  it('should create', async () => {
    const { fixture } = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  it('can define a default menu component', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.ariaDescribedBy).toEqual(undefined);
    expect(fixture.componentInstance.bodyTemplateRef).toEqual(undefined);
    expect(fixture.componentInstance.multiExpansion).toEqual(false);
    expect(fixture.componentInstance.panelList).toEqual(undefined);
  });

  it('should set panel items list', async () => {
    const { fixture } = await getFixture({ componentProperties: { panelList: PANEL_LIST } });

    expect(PANEL_LIST.length).toEqual(fixture.componentInstance.panelList?.length);
  });

  it('should default to mat accordion having no expansion elements', async () => {
    const { fixture } = await getFixture({});
    fixture.detectChanges();
    const panels = fixture.debugElement.queryAll(By.css('mat-expansion-panel'));
    expect(panels.length).toEqual(0);
  });

  it('should render the appropriate amount of expansion elements in accordion', async () => {
    const { fixture } = await getFixture({ componentProperties: { panelList: PANEL_LIST } });
    fixture.detectChanges();
    const panels = fixture.debugElement.queryAll(By.css('mat-expansion-panel'));
    expect(panels.length).toEqual(3);
  });

  it('should render panel content if available', async () => {
    const { fixture } = await getFixture({ componentProperties: { panelList: PANEL_LIST } });
    fixture.detectChanges();
    const panels = fixture.debugElement.queryAll(By.css('mat-expansion-panel'));
    expect(panels[0].nativeElement.querySelector('p').textContent).toEqual('test content');
  });

  it('should open accordion', async () => {
    const { fixture } = await getFixture({ componentProperties: { panelList: PANEL_LIST } });
    fixture.componentInstance.onOpened();
    expect(fixture.componentInstance.isOpen).toBeTruthy();
  });

  it('should close accordion', async () => {
    const { fixture } = await getFixture({ componentProperties: { panelList: PANEL_LIST } });
    fixture.componentInstance.onOpened();
    fixture.componentInstance.onClosed();
    expect(fixture.componentInstance.isOpen).toBeFalsy();
  });
});
