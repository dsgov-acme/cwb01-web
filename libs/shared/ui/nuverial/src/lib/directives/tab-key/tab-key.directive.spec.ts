import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { render } from '@testing-library/angular';
import { MockBuilder } from 'ng-mocks';
import { NuverialTabsComponent } from '../../components/tabs';
import { NuverialTabKeyDirective } from './tab-key.directive';

const dependencies = MockBuilder(NuverialTabKeyDirective).mock(NuverialTabsComponent).keep(CommonModule).build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(TestComponent, {
    ...dependencies,
    providers: [
      {
        provide: NuverialTabsComponent,
        useValue: {
          addTemplate: jest.fn(),
        },
      },
    ],
    ...props,
  });

  return { fixture };
};

describe('TabKeyDirective', () => {
  it('should add the template to the tabs component', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;
    fixture.detectChanges();
    const tabsComponent = component.directive['_tabsComponent'];
    jest.spyOn(tabsComponent, 'addTemplate');

    component.directive.ngAfterContentInit();

    expect(tabsComponent.addTemplate).toHaveBeenCalledWith('Tab 1', component.directive['_templateRef']);
  });
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTabKeyDirective],
  selector: 'nuverial-text-area-test',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  template: `<ng-template nuverialTabKey="Tab 1"></ng-template>`,
})
class TestComponent {
  @ViewChild(NuverialTabKeyDirective, { static: true }) public directive!: NuverialTabKeyDirective;
}
